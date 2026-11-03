"use server";

import {
  createOrder,
  getShippingSettings,
  getProductBySlug,
  getPackageById,
  type OrderItem,
} from "@/lib/db-queries";
import { createPaypalOrder } from "@/lib/paypal";
import { headers } from "next/headers";
import { createOrderAccessToken, setOrderAccessCookie } from "@/lib/order-access";
import { completePaypalOrder, type FulfillmentResult } from "@/lib/order-fulfillment";
import { computePackageTotals, GST_RATE } from "@/constants/packages";
import type { Product, ProductVariant } from "@/constants/products";

const MAX_QUANTITY_PER_ITEM = 50;
const MAX_CART_LINES = 20;

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  suburb: string;
  postcode: string;
  state: string;
}

export interface InitiatePaypalCheckoutInput {
  customer: CheckoutCustomer;
  cartItems: {
    slug: string;
    quantity: number;
    /** Required when the product has variants (e.g. cartridge sizes). */
    variantId?: string;
  }[];
}

export interface InitiatePackageCheckoutInput {
  customer: CheckoutCustomer;
  packageId: string;
}

type CheckoutResult =
  | { success: true; approvalUrl: string; orderId: string }
  | { success: false; error: string };

function validateCustomer(customer: CheckoutCustomer | undefined): string | null {
  if (
    !customer ||
    !customer.name ||
    !customer.email ||
    !customer.phone ||
    !customer.address ||
    !customer.suburb ||
    !customer.postcode ||
    !customer.state
  ) {
    return "Missing required shipping fields.";
  }
  return null;
}

/**
 * Find the variant the buyer chose and reject combinations that no longer
 * match the product (variant removed, or variants added/removed since).
 */
function resolveVariant(
  product: Product,
  variantId: string | undefined
): { ok: true; variant: ProductVariant | null } | { ok: false; error: string } {
  const hasVariants = !!product.variants && product.variants.length > 0;
  const variant = hasVariants ? product.variants!.find((v) => v.id === variantId) ?? null : null;
  if (hasVariants && !variant) {
    return { ok: false, error: `Please select a size for ${product.name} again and re-add it to your cart.` };
  }
  if (!hasVariants && variantId) {
    return { ok: false, error: `${product.name} has changed. Please remove it and add it to your cart again.` };
  }
  return { ok: true, variant };
}

function buildOrderItem(
  product: Product,
  variant: ProductVariant | null,
  priceString: string,
  priceNumeric: number,
  quantity: number
): OrderItem {
  return {
    id: product.id,
    slug: product.slug,
    name: variant ? `${product.name} (${variant.label})` : product.name,
    priceString,
    priceNumeric,
    quantity,
    image: variant?.image || product.image,
    ...(variant ? { variantId: variant.id, variantLabel: variant.label } : {}),
  };
}

/**
 * Create the PayPal order for a server-computed total, then persist the
 * Pending order and give this browser its order access cookie.
 */
async function createPaypalAndSaveOrder(params: {
  customer: CheckoutCustomer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  gst: number;
  total: number;
  pkg?: { id: string; name: string };
  cancelPath: string;
}): Promise<CheckoutResult> {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const returnUrl = `${baseUrl}/checkout/capture`;
  const cancelUrl = `${baseUrl}${params.cancelPath}`;

  const paypalOrder = await createPaypalOrder(params.total, returnUrl, cancelUrl);
  if (!paypalOrder?.id) {
    return { success: false, error: "Failed to initiate order with PayPal." };
  }

  const approvalUrl = paypalOrder.links.find((link) => link.rel === "approve")?.href;
  if (!approvalUrl) {
    return { success: false, error: "No PayPal approval URL returned." };
  }

  // Save order with status 'Pending' and payment.id set to the PayPal Order ID.
  // The access token lets only this browser view the order confirmation page.
  const access = createOrderAccessToken();
  const now = new Date().toISOString();
  const orderId = await createOrder({
    customer: params.customer,
    items: params.items,
    ...(params.pkg ? { package: params.pkg } : {}),
    subtotal: params.subtotal,
    shipping: params.shipping,
    gst: params.gst,
    total: params.total,
    status: "Pending",
    payment: {
      method: "paypal",
      id: paypalOrder.id, // Replaced with the capture ID once paid
      paypalOrderId: paypalOrder.id, // Stable lookup key for capture and webhooks
      payerEmail: "",
      status: paypalOrder.status,
    },
    createdAt: now,
    updatedAt: now,
    accessTokenHash: access.hash,
  });
  await setOrderAccessCookie(orderId, access.token);

  return { success: true, approvalUrl, orderId };
}

export async function initiatePaypalCheckout(input: InitiatePaypalCheckoutInput): Promise<CheckoutResult> {
  const { customer, cartItems } = input;

  const customerError = validateCustomer(customer);
  if (customerError) {
    return { success: false, error: customerError };
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
    // Calculate price on the server side (Zero-Trust verification)
    let calculatedSubtotal = 0;
    const itemDetails: OrderItem[] = [];

    for (const item of cartItems) {
      const product = await getProductBySlug(item.slug);
      if (!product) {
        return { success: false, error: `Product not found: ${item.slug}` };
      }

      // Price by the selected variant when the product has variants; the
      // client only says which variant, never what it costs.
      const resolved = resolveVariant(product, item.variantId);
      if (!resolved.ok) {
        return { success: false, error: resolved.error };
      }
      const { variant } = resolved;

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
      itemDetails.push(buildOrderItem(product, variant, priceStr, priceNumeric, item.quantity));
    }

    const shippingSettings = await getShippingSettings();
    const deliveryFee = shippingSettings.standardDeliveryFee;
    const gstCalculated = calculatedSubtotal * GST_RATE;
    const finalTotal = calculatedSubtotal + gstCalculated + deliveryFee;

    return await createPaypalAndSaveOrder({
      customer,
      items: itemDetails,
      subtotal: calculatedSubtotal,
      shipping: deliveryFee,
      gst: gstCalculated,
      total: finalTotal,
      cancelPath: "/checkout?error=cancelled",
    });
  } catch (error: unknown) {
    console.error("Error initiating PayPal checkout:", error);
    const message = error instanceof Error ? error.message : "Initiation failed.";
    return { success: false, error: message };
  }
}

/**
 * Checkout for a cartridge package. The client only names the package; every
 * price and the delivery fee are read from Firestore here.
 */
export async function initiatePackageCheckout(input: InitiatePackageCheckoutInput): Promise<CheckoutResult> {
  const { customer, packageId } = input ?? ({} as InitiatePackageCheckoutInput);

  const customerError = validateCustomer(customer);
  if (customerError) {
    return { success: false, error: customerError };
  }

  if (typeof packageId !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(packageId)) {
    return { success: false, error: "Invalid cartridge set." };
  }

  const unavailable = "This cartridge set is currently unavailable. Please contact us on 1300 515 469.";

  try {
    const pkg = await getPackageById(packageId);
    if (!pkg || pkg.active !== true || !Array.isArray(pkg.items) || pkg.items.length === 0) {
      return { success: false, error: unavailable };
    }
    if (typeof pkg.deliveryFee !== "number" || !Number.isFinite(pkg.deliveryFee) || pkg.deliveryFee < 0) {
      return { success: false, error: unavailable };
    }

    const itemDetails: OrderItem[] = [];
    for (const item of pkg.items) {
      if (
        typeof item.offerPrice !== "number" ||
        !Number.isFinite(item.offerPrice) ||
        item.offerPrice <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return { success: false, error: unavailable };
      }

      const product = await getProductBySlug(item.slug);
      if (!product) {
        return { success: false, error: unavailable };
      }
      const resolved = resolveVariant(product, item.variantId || undefined);
      if (!resolved.ok) {
        return { success: false, error: unavailable };
      }

      itemDetails.push(
        buildOrderItem(product, resolved.variant, `$${item.offerPrice.toFixed(2)} + GST`, item.offerPrice, item.quantity)
      );
    }

    const totals = computePackageTotals(pkg);

    return await createPaypalAndSaveOrder({
      customer,
      items: itemDetails,
      pkg: { id: pkg.id, name: pkg.name },
      subtotal: totals.subtotal,
      shipping: totals.delivery,
      gst: totals.gst,
      total: totals.total,
      cancelPath: `/checkout?package=${encodeURIComponent(pkg.id)}&error=cancelled`,
    });
  } catch (error: unknown) {
    console.error("Error initiating package checkout:", error);
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
