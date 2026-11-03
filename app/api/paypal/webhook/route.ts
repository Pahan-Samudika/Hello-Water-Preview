import { NextResponse, type NextRequest } from "next/server";
import { verifyPaypalWebhookSignature } from "@/lib/paypal";
import { completePaypalOrder } from "@/lib/order-fulfillment";

export const dynamic = "force-dynamic";

interface PaypalWebhookEvent {
  id?: string;
  event_type?: string;
  resource?: {
    id?: string;
    supplementary_data?: { related_ids?: { order_id?: string } };
  };
}

/**
 * PayPal webhook: completes orders even when the buyer never returns to
 * /checkout/capture (closed tab, lost connection). Subscribe to
 * CHECKOUT.ORDER.APPROVED and PAYMENT.CAPTURE.COMPLETED in the PayPal
 * dashboard and set PAYPAL_WEBHOOK_ID to that webhook's ID.
 *
 * Replays and duplicate deliveries are harmless: completePaypalOrder is
 * idempotent. Non-2xx responses make PayPal retry, so only transient
 * failures return 500.
 */
export async function POST(request: NextRequest) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    console.error("PayPal webhook received but PAYPAL_WEBHOOK_ID is not configured.");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = await request.text();

  let verified: boolean;
  try {
    verified = await verifyPaypalWebhookSignature(
      {
        authAlgo: request.headers.get("paypal-auth-algo"),
        certUrl: request.headers.get("paypal-cert-url"),
        transmissionId: request.headers.get("paypal-transmission-id"),
        transmissionSig: request.headers.get("paypal-transmission-sig"),
        transmissionTime: request.headers.get("paypal-transmission-time"),
      },
      rawBody,
      webhookId
    );
  } catch (error) {
    console.error("PayPal webhook verification errored:", error);
    return NextResponse.json({ error: "Verification unavailable" }, { status: 500 });
  }

  if (!verified) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Only parse trusted fields after the signature has been verified.
  const event = JSON.parse(rawBody) as PaypalWebhookEvent;

  let paypalOrderId: string | undefined;
  switch (event.event_type) {
    case "CHECKOUT.ORDER.APPROVED":
      paypalOrderId = event.resource?.id;
      break;
    case "PAYMENT.CAPTURE.COMPLETED":
      paypalOrderId = event.resource?.supplementary_data?.related_ids?.order_id;
      break;
    default:
      return NextResponse.json({ received: true, ignored: event.event_type ?? "unknown" });
  }

  if (!paypalOrderId) {
    console.warn(`PayPal webhook ${event.id} (${event.event_type}) has no order ID.`);
    return NextResponse.json({ received: true });
  }

  try {
    const result = await completePaypalOrder(paypalOrderId);
    if (!result.success) {
      // Permanent conditions (unknown order, amount mismatch, cancelled order)
      // won't be fixed by a retry, so acknowledge and log for manual review.
      console.warn(`PayPal webhook ${event.id} for order ${paypalOrderId}: ${result.error}`);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`PayPal webhook ${event.id} for order ${paypalOrderId} failed:`, error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
