"use server";

import { createOrder, getShippingSettings, getProductBySlug } from "@/lib/db-queries";
import { createPaypalOrder } from "@/lib/paypal";
import { headers } from "next/headers";
import { createOrderAccessToken, setOrderAccessCookie } from "@/lib/order-access";
import { completePaypalOrder, type FulfillmentResult } from "@/lib/order-fulfillment";

const MAX_QUANTITY_PER_ITEM = 50;
const MAX_CART_LINES = 20;

export interface InitiatePaypalCheckoutInput {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    suburb: string;
    postcode: string;
    state: string;
  };
  cartItems: {
    slug: string;
    quantity: number;
    /** Required when the product has variants (e.g. cartridge sizes). */
    variantId?: string;
  }[];
}

export async function initiatePaypalCheckout(input: InitiatePaypalCheckoutInput) {
  const { customer, cartItems } = input;

  if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.suburb || !customer.postcode || !customer.state) {
    return { success: false, error: "Missing required shipping fields." };
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return { success: false, error: "Shopping cart is empty." };
  }

  if (cartItems.length > MAX_CART_LINES) {
    return { success: false, error: "Too many items in cart." };
  }

  // Validate quantities and slugs before touching prices: quantities must be whole
  // numbers within bounds, and each product/variant pair may appear only once.
  const seenLines = new Set<string>();
  for (const item of cartItems) {
    if (typeof item?.slug !== "string" || item.slug.length === 0 || item.slug.length > 200) {
      return { success: false, error: "Invalid product in cart." };
    }
    if (item.variantId !== undefined && (typeof item.variantId !== "string" || item.variantId.length > 200)) {
      return { success: false, error: "Invalid product option in cart." };
    }
    if (
      typeof item.quantity !== "number" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > MAX_QUANTITY_PER_ITEM
    ) {
      return { success: false, error: `Invalid quantity for ${item.slug}. Quantity must be a whole number between 1 and ${MAX_QUANTITY_PER_ITEM}.` };
    }
    const lineKey = `${item.slug}::${item.variantId ?? ""}`;
    if (seenLines.has(lineKey)) {
      return { success: false, error: `Duplicate product in cart: ${item.slug}` };
    }
    seenLines.add(lineKey);
  }

  try {
    // 1. Calculate price on the server side (Zero-Trust verification)
    let calculatedSubtotal = 0;
    const itemDetails = [];

    for (const item of cartItems) {
      const product = await getProductBySlug(item.slug);
      if (!product) {
        return { success: false, error: `Product not found: ${item.slug}` };
      }

      // Price by the selected variant when the product has variants; the
      // client only says which variant, never what it costs.
      const hasVariants = !!product.variants && product.variants.length > 0;
      const variant = hasVariants
        ? product.variants!.find((v) => v.id === item.variantId) ?? null
        : null;
      if (hasVariants && !variant) {
        return { success: false, error: `Please select a size for ${product.name} again and re-add it to your cart.` };
      }
      if (!hasVariants && item.variantId) {
        return { success: false, error: `${product.name} has changed. Please remove it and add it to your cart again.` };
      }

      const priceStr = variant ? variant.price : product.price;
      if (priceStr.toLowerCase().includes("call for price")) {
        return { success: false, error: `Filtration systems cannot be purchased online: ${product.name}` };
      }

      const match = priceStr.match(/\d+(\.\d+)?/);
      const priceNumeric = match ? parseFloat(match[0]) : 0;
      if (priceNumeric <= 0) {
        return { success: false, error: `Invalid price configuration for: ${product.name}` };
      }

      calculatedSubtotal += priceNumeric * item.quantity;
      itemDetails.push({
        id: product.id,
        slug: product.slug,
        name: variant ? `${product.name} (${variant.label})` : product.name,
        priceString: priceStr,
        priceNumeric: priceNumeric,
        quantity: item.quantity,
        image: variant?.image || product.image,
        ...(variant ? { variantId: variant.id, variantLabel: variant.label } : {}),
      });
    }

    const shippingSettings = await getShippingSettings();
    const deliveryFee = shippingSettings.standardDeliveryFee;
    const gstCalculated = calculatedSubtotal * 0.1;
    const finalTotal = calculatedSubtotal + gstCalculated + deliveryFee;

    // 2. Generate Return and Cancel URLs dynamically
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    
    const returnUrl = `${baseUrl}/checkout/capture`;
    const cancelUrl = `${baseUrl}/checkout?error=cancelled`;

    // 3. Create PayPal Order
    const paypalOrder = await createPaypalOrder(finalTotal, returnUrl, cancelUrl);
    if (!paypalOrder?.id) {
      return { success: false, error: "Failed to initiate order with PayPal." };
    }

    const approvalUrl = paypalOrder.links.find((link) => link.rel === "approve")?.href;
    if (!approvalUrl) {
      return { success: false, error: "No PayPal approval URL returned." };
    }

    // 4. Save order to Firestore with status 'Pending' and payment.id set to PayPal Order ID.
    // The access token lets only this browser view the order confirmation page.
    const access = createOrderAccessToken();
    const orderData = {
      customer,
      items: itemDetails,
      subtotal: calculatedSubtotal,
      shipping: deliveryFee,
      gst: gstCalculated,
      total: finalTotal,
      status: "Pending" as const,
      payment: {
        method: "paypal" as const,
        id: paypalOrder.id, // Replaced with the capture ID once paid
        paypalOrderId: paypalOrder.id, // Stable lookup key for capture and webhooks
        payerEmail: "",
        status: paypalOrder.status,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      accessTokenHash: access.hash,
    };

    const orderId = await createOrder(orderData);
    await setOrderAccessCookie(orderId, access.token);

    return { success: true, approvalUrl, orderId };
  } catch (error: unknown) {
    console.error("Error initiating PayPal checkout:", error);
    const message = error instanceof Error ? error.message : "Initiation failed.";
    return { success: false, error: message };
  }
}

export async function capturePaypalCheckout(paypalOrderId: string): Promise<FulfillmentResult> {
  if (typeof paypalOrderId !== "string" || !/^[A-Z0-9]{5,64}$/.test(paypalOrderId)) {
    return { success: false, error: "Missing or invalid PayPal order token." };
  }

  try {
    return await completePaypalOrder(paypalOrderId);
  } catch (error: unknown) {
    console.error("Error capturing PayPal payment:", error);
    return {
      success: false,
      error: "We couldn't confirm your payment. If you were charged, please call 1300 515 469.",
    };
  }
}
