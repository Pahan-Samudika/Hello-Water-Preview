"use server";

import { db } from "@/lib/firebase";
import { createOrder, getShippingSettings, getProductBySlug } from "@/lib/db-queries";
import nodemailer from "nodemailer";
import { createPaypalOrder, capturePaypalOrder, getPaypalOrder } from "@/lib/paypal";
import { headers } from "next/headers";
import path from "path";

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
  }[];
}

export async function initiatePaypalCheckout(input: InitiatePaypalCheckoutInput) {
  const { customer, cartItems } = input;

  if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.suburb || !customer.postcode || !customer.state) {
    return { success: false, error: "Missing required shipping fields." };
  }

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: "Shopping cart is empty." };
  }

  try {
    // 1. Calculate price on the server side (Zero-Trust verification)
    let calculatedSubtotal = 0;
    const itemDetails = [];

    for (const item of cartItems) {
      if (item.quantity <= 0) continue;
      
      const product = await getProductBySlug(item.slug);
      if (!product) {
        return { success: false, error: `Product not found: ${item.slug}` };
      }

      const priceStr = product.price;
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
        name: product.name,
        priceString: product.price,
        priceNumeric: priceNumeric,
        quantity: item.quantity,
        image: product.image,
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

    // 4. Save order to Firestore with status 'Pending' and payment.id set to PayPal Order ID
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
        id: paypalOrder.id, // Store PayPal Order ID here first
        payerEmail: "",
        status: paypalOrder.status,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const orderId = await createOrder(orderData);

    return { success: true, approvalUrl, orderId };
  } catch (error: unknown) {
    console.error("Error initiating PayPal checkout:", error);
    const message = error instanceof Error ? error.message : "Initiation failed.";
    return { success: false, error: message };
  }
}

export async function capturePaypalCheckout(paypalOrderId: string) {
  if (!paypalOrderId) {
    return { success: false, error: "Missing PayPal order token." };
  }

  try {
    // 1. Fetch the order draft from Firestore matching payment.id == paypalOrderId
    const snapshot = await db.collection("orders").where("payment.id", "==", paypalOrderId).limit(1).get();
    if (snapshot.empty) {
      return { success: false, error: "Order draft not found in database." };
    }

    const orderDoc = snapshot.docs[0];
    const orderData = orderDoc.data();
    const orderId = orderDoc.id;

    // If it's already captured/processing, just return success
    if (orderData.status !== "Pending") {
      return { success: true, orderId };
    }

    // 2. Fetch the PayPal Order details first to check actual status and verify details
    const paypalOrder = await getPaypalOrder(paypalOrderId);
    if (!paypalOrder) {
      return { success: false, error: "PayPal order details could not be retrieved." };
    }

    // Verify PayPal order currency and amount matches expected Firestore order details (Defense-in-depth)
    const purchaseUnit = paypalOrder.purchase_units?.[0];
    if (!purchaseUnit) {
      return { success: false, error: "Invalid purchase units structure in PayPal order." };
    }

    const paypalAmountValue = parseFloat(purchaseUnit.amount?.value || "0");
    const paypalCurrency = purchaseUnit.amount?.currency_code;

    if (paypalCurrency !== "AUD") {
      return { success: false, error: `Invalid transaction currency: expected AUD, got ${paypalCurrency}` };
    }

    const expectedTotal = orderData.total;
    const delta = Math.abs(paypalAmountValue - expectedTotal);
    if (delta > 0.01) {
      return { success: false, error: `Amount mismatch: expected $${expectedTotal.toFixed(2)}, got $${paypalAmountValue.toFixed(2)}` };
    }

    let captureId = paypalOrderId;
    let payerEmail = paypalOrder.payer?.email_address || "";

    // 3. Handle capture or retrieve existing capture status
    if (paypalOrder.status === "COMPLETED") {
      // Payment has already been captured (idempotency recovery)
      console.log(`PayPal order ${paypalOrderId} has already been completed. Performing recovery processing.`);
      const capture = purchaseUnit.payments?.captures?.[0];
      if (capture) {
        captureId = capture.id;
      }
    } else if (paypalOrder.status === "APPROVED") {
      // Order is approved but not captured, proceed with capture
      const captureResult = await capturePaypalOrder(paypalOrderId);
      if (captureResult.status !== "COMPLETED") {
        return { success: false, error: `PayPal transaction capture status: ${captureResult.status}` };
      }

      const capture = captureResult.purchase_units?.[0]?.payments?.captures?.[0];
      captureId = capture?.id || paypalOrderId;
      payerEmail = captureResult.payer?.email_address || payerEmail;
    } else {
      return { success: false, error: `PayPal transaction status is ${paypalOrder.status}. Cannot capture payment.` };
    }

    // 4. Update Firestore Order status to 'Processing' and save actual transaction capture ID
    await db.collection("orders").doc(orderId).update({
      status: "Processing",
      payment: {
        method: "paypal",
        id: captureId, // Replace order token with final transaction capture ID
        payerEmail: payerEmail,
        status: "COMPLETED",
      },
      updatedAt: new Date().toISOString(),
    });

    // 4. Send Order Confirmation Emails (Nodemailer)
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "465"),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const orderItemsTableRows = orderData.items.map(
        (item: any) => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <div style="font-weight: bold; font-size: 14px;">${item.name}</div>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.priceNumeric * item.quantity).toFixed(2)} AUD</td>
          </tr>
        `
      ).join("");

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-w: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <div style="background-color: #0c0a09; background-image: linear-gradient(#0c0a09, #0c0a09) !important; padding: 25px; text-align: center; border-bottom: 3px solid #0ea5e9;">
            <img src="cid:logo" alt="Hello Water" style="height: 24px; width: auto; margin: 0 auto; display: block;" />
            <p style="color: #0ea5e9; margin: 8px 0 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase;">Order Confirmation</p>
          </div>
          
          <div style="padding: 30px;">
            <p style="font-size: 16px; margin-top: 0;">Hi <strong>${orderData.customer.name}</strong>,</p>
            <p style="font-size: 14px; color: #555;">Thank you for your purchase! We have received your payment, and your order is now being processed.</p>
            
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 15px; margin: 20px 0; border: 1px solid #f1f5f9;">
              <table style="width: 100%; font-size: 13px;">
                <tr>
                  <td style="color: #64748b; font-weight: bold; padding: 3px 0;">Order Reference:</td>
                  <td style="font-weight: bold; text-align: right; color: #0f172a;">${orderId}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: bold; padding: 3px 0;">Transaction ID:</td>
                  <td style="text-align: right; font-family: monospace;">${captureId}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: bold; padding: 3px 0;">Order Date:</td>
                  <td style="text-align: right;">${new Date().toLocaleDateString()}</td>
                </tr>
              </table>
            </div>

            <h3 style="font-size: 15px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 25px;">Delivery Address</h3>
            <p style="font-size: 13px; color: #475569; margin: 5px 0; line-height: 1.5;">
              <strong>${orderData.customer.name}</strong><br />
              ${orderData.customer.address}<br />
              ${orderData.customer.suburb}, ${orderData.customer.state} ${orderData.customer.postcode}<br />
              Phone: ${orderData.customer.phone}<br />
              Australia
            </p>

            <h3 style="font-size: 15px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 30px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background-color: #f8fafc;">
                  <th style="padding: 10px; text-align: left; font-size: 12px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Item</th>
                  <th style="padding: 10px; text-align: center; font-size: 12px; color: #64748b; border-bottom: 1px solid #e2e8f0; width: 60px;">Qty</th>
                  <th style="padding: 10px; text-align: right; font-size: 12px; color: #64748b; border-bottom: 1px solid #e2e8f0; width: 100px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsTableRows}
              </tbody>
            </table>

            <table style="width: 100%; margin-top: 20px; font-size: 13px; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 10px; text-align: right; color: #64748b;">Subtotal (excl. GST):</td>
                <td style="padding: 6px 10px; text-align: right; width: 120px;">$${orderData.subtotal.toFixed(2)} AUD</td>
              </tr>
              <tr>
                <td style="padding: 6px 10px; text-align: right; color: #64748b;">GST (10%):</td>
                <td style="padding: 6px 10px; text-align: right;">$${orderData.gst.toFixed(2)} AUD</td>
              </tr>
              <tr>
                <td style="padding: 6px 10px; text-align: right; color: #64748b;">Delivery Fee:</td>
                <td style="padding: 6px 10px; text-align: right;">$${orderData.shipping.toFixed(2)} AUD</td>
              </tr>
              <tr style="border-top: 1px solid #e2e8f0;">
                <td style="padding: 12px 10px; text-align: right; font-size: 15px; font-weight: bold; color: #0f172a;">Total Amount:</td>
                <td style="padding: 12px 10px; text-align: right; font-size: 16px; font-weight: bold; color: #0ea5e9;">$${orderData.total.toFixed(2)} AUD</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0 0 5px 0;">Hello Water Filtration Systems | Australia</p>
            <p style="margin: 0;">If you have any questions, reply to this email or call 1300 515 469</p>
          </div>
        </div>
      `;

      // Customer Email
      await transporter.sendMail({
        from: `"Hello Water Shop" <${process.env.SMTP_USER}>`,
        to: orderData.customer.email,
        subject: `Your Hello Water Order Receipt - ${orderId}`,
        html: emailHtml,
        attachments: [
          {
            filename: "txtlogo-white.svg",
            path: path.join(process.cwd(), "assets/svg/txtlogo-white.svg"),
            cid: "logo",
          },
        ],
      });

      // Admin Email
      const adminRecipients = process.env.ENQUIRY_RECIPIENTS || "content@hellowaterfiltration.com.au";
      await transporter.sendMail({
        from: `"Hello Water Shop Notification" <${process.env.SMTP_USER}>`,
        to: adminRecipients,
        subject: `[New Order] ${orderId} - Paid via PayPal ($${orderData.total.toFixed(2)} AUD)`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>A new cartridge order has been placed & paid!</h2>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>PayPal Capture ID:</strong> ${captureId}</p>
            <p><strong>Customer Name:</strong> ${orderData.customer.name}</p>
            <p><strong>Customer Email:</strong> ${orderData.customer.email}</p>
            <p><strong>Order Total:</strong> $${orderData.total.toFixed(2)} AUD (incl. GST & shipping)</p>
            <hr />
            <p>Please log in to the Hello Water Admin Dashboard to view full details and print shipping labels.</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Nodemailer: Error sending order confirmation emails:", mailError);
    }

    return { success: true, orderId };
  } catch (error: unknown) {
    console.error("Error capturing PayPal payment:", error);
    const message = error instanceof Error ? error.message : "Capture failed.";
    return { success: false, error: message };
  }
}
