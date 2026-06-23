"use server";

import { db } from "@/lib/firebase";
import { createOrder, getShippingSettings, getProductBySlug } from "@/lib/db-queries";
import nodemailer from "nodemailer";

export interface PlaceOrderInput {
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
  payment: {
    id: string; // PayPal transaction ID
    payerEmail: string;
    status: string;
  };
}

export async function placeOrder(input: PlaceOrderInput) {
  const { customer, cartItems, payment } = input;

  if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.suburb || !customer.postcode || !customer.state) {
    return { success: false, error: "Missing required shipping fields." };
  }

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: "Shopping cart is empty." };
  }

  if (!payment.id) {
    return { success: false, error: "Missing payment transaction identifier." };
  }

  try {
    // 1. Zero-Trust verification: Load products and calculate prices on the server side
    let calculatedSubtotal = 0;
    const itemDetails = [];

    for (const item of cartItems) {
      if (item.quantity <= 0) continue;
      
      // Fetch product detail directly from database/constants to ensure price integrity
      const product = await getProductBySlug(item.slug);
      if (!product) {
        return { success: false, error: `Product not found: ${item.slug}` };
      }

      // Parse price (e.g. "$156.00 + GST" -> 156.00)
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

    // 2. Fetch standard shipping settings from Firestore Settings collection
    const shippingSettings = await getShippingSettings();
    const deliveryFee = shippingSettings.standardDeliveryFee;

    // 3. Complete totals (10% GST calculation)
    const gstCalculated = calculatedSubtotal * 0.1;
    const finalTotal = calculatedSubtotal + gstCalculated + deliveryFee;

    // 4. Save order to Firestore
    const orderData = {
      customer,
      items: itemDetails,
      subtotal: calculatedSubtotal,
      shipping: deliveryFee,
      gst: gstCalculated,
      total: finalTotal,
      status: "Processing" as const, // Automatically sets to Processing since payment was authorized
      payment: {
        method: "paypal" as const,
        id: payment.id,
        payerEmail: payment.payerEmail,
        status: payment.status,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const orderId = await createOrder(orderData);

    // 5. Send order notification emails using Nodemailer
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

      const orderItemsTableRows = itemDetails.map(
        (item) => `
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
          <div style="background-color: #0c0a09; padding: 25px; text-align: center; border-bottom: 3px solid #0ea5e9;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 0.05em;">HELLO WATER</h1>
            <p style="color: #0ea5e9; margin: 5px 0 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase;">Order Confirmation</p>
          </div>
          
          <div style="padding: 30px;">
            <p style="font-size: 16px; margin-top: 0;">Hi <strong>${customer.name}</strong>,</p>
            <p style="font-size: 14px; color: #555;">Thank you for your purchase! We have received your payment, and your order is now being processed.</p>
            
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 15px; margin: 20px 0; border: 1px solid #f1f5f9;">
              <table style="width: 100%; font-size: 13px;">
                <tr>
                  <td style="color: #64748b; font-weight: bold; padding: 3px 0;">Order Reference:</td>
                  <td style="font-weight: bold; text-align: right; color: #0f172a;">${orderId}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: bold; padding: 3px 0;">Transaction ID:</td>
                  <td style="text-align: right; font-family: monospace;">${payment.id}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: bold; padding: 3px 0;">Order Date:</td>
                  <td style="text-align: right;">${new Date().toLocaleDateString()}</td>
                </tr>
              </table>
            </div>

            <h3 style="font-size: 15px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 25px;">Delivery Address</h3>
            <p style="font-size: 13px; color: #475569; margin: 5px 0; line-height: 1.5;">
              <strong>${customer.name}</strong><br />
              ${customer.address}<br />
              ${customer.suburb}, ${customer.state} ${customer.postcode}<br />
              Phone: ${customer.phone}<br />
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
                <td style="padding: 6px 10px; text-align: right; width: 120px;">$${calculatedSubtotal.toFixed(2)} AUD</td>
              </tr>
              <tr>
                <td style="padding: 6px 10px; text-align: right; color: #64748b;">GST (10%):</td>
                <td style="padding: 6px 10px; text-align: right;">$${gstCalculated.toFixed(2)} AUD</td>
              </tr>
              <tr>
                <td style="padding: 6px 10px; text-align: right; color: #64748b;">Delivery Fee:</td>
                <td style="padding: 6px 10px; text-align: right;">$${deliveryFee.toFixed(2)} AUD</td>
              </tr>
              <tr style="border-top: 1px solid #e2e8f0;">
                <td style="padding: 12px 10px; text-align: right; font-size: 15px; font-weight: bold; color: #0f172a;">Total Amount:</td>
                <td style="padding: 12px 10px; text-align: right; font-size: 16px; font-weight: bold; color: #0ea5e9;">$${finalTotal.toFixed(2)} AUD</td>
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
        to: customer.email,
        subject: `Your Hello Water Order Receipt - ${orderId}`,
        html: emailHtml,
      });

      // Admin Email
      const adminRecipients = process.env.ENQUIRY_RECIPIENTS || "content@hellowaterfiltration.com.au";
      await transporter.sendMail({
        from: `"Hello Water Shop Notification" <${process.env.SMTP_USER}>`,
        to: adminRecipients,
        subject: `[New Order] ${orderId} - Paid via PayPal ($${finalTotal.toFixed(2)} AUD)`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>A new cartridge order has been placed & paid!</h2>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>PayPal Capture ID:</strong> ${payment.id}</p>
            <p><strong>Customer Name:</strong> ${customer.name}</p>
            <p><strong>Customer Email:</strong> ${customer.email}</p>
            <p><strong>Order Total:</strong> $${finalTotal.toFixed(2)} AUD (incl. GST & shipping)</p>
            <hr />
            <p>Please log in to the Hello Water Admin Dashboard to view full details and print shipping labels.</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Nodemailer: Error sending order emails:", mailError);
      // We do not fail the order because payment has already succeeded, we just log the email failure.
    }

    return { success: true, orderId };
  } catch (error: unknown) {
    console.error("Error processing order server action:", error);
    const message = error instanceof Error ? error.message : "Something went wrong during checkout.";
    return { success: false, error: message };
  }
}
