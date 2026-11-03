import nodemailer from "nodemailer";
import path from "path";
import type { Order } from "@/lib/db-queries";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sends the customer receipt and the admin new-order notification.
 * Throws if either message fails so the caller can record the failure.
 */
export async function sendOrderConfirmationEmails(
  orderData: Order,
  orderId: string,
  captureId: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const packageLine = orderData.package
    ? `<p style="font-size: 13px; color: #0369a1; margin: 8px 0 0 0; font-weight: bold;">Cartridge Set: ${escapeHtml(orderData.package.name)}</p>`
    : "";

  const orderItemsTableRows = orderData.items.map(
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
        ${packageLine}
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
  // Comma-separated. Falls back to the enquiry list so existing deployments keep receiving alerts.
  const adminRecipients =
    process.env.ORDER_RECIPIENTS || process.env.ENQUIRY_RECIPIENTS || "content@hellowaterfiltration.com.au";
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
        ${orderData.package ? `<p><strong>Cartridge Set:</strong> ${escapeHtml(orderData.package.name)}</p>` : ""}
        <p><strong>Order Total:</strong> $${orderData.total.toFixed(2)} AUD (incl. GST & shipping)</p>
        <hr />
        <p>Please log in to the Hello Water Admin Dashboard to view full details and print shipping labels.</p>
      </div>
    `,
  });
}
