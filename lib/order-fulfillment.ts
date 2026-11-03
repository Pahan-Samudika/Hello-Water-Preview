import { FieldValue } from "firebase-admin/firestore";
import { db } from "@/lib/firebase";
import type { Order } from "@/lib/db-queries";
import { capturePaypalOrder, getPaypalOrder, type PaypalOrderDetails } from "@/lib/paypal";
import { sendOrderConfirmationEmails } from "@/lib/order-emails";

const EMAIL_CLAIM_LEASE_MS = 5 * 60 * 1000;

type OrderRef = FirebaseFirestore.DocumentReference;

interface OrderNotificationState {
  confirmationEmailSentAt?: string;
  confirmationEmailClaimedAt?: string;
}

/**
 * Send the confirmation emails for a paid order at most once. Each caller
 * (capture page, page refresh, webhook delivery or retry) tries to claim the
 * send in a transaction; the claim is a lease, so a caller that died mid-send
 * doesn't block the next one forever. Failures release the claim so the next
 * call retries. Email problems never fail the payment flow.
 */
async function ensureConfirmationSent(orderRef: OrderRef): Promise<void> {
  const claimedAt = new Date().toISOString();
  let order: (Order & OrderNotificationState) | null = null;

  try {
    order = await db.runTransaction(async (tx) => {
      const snap = await tx.get(orderRef);
      const data = snap.data() as (Order & OrderNotificationState) | undefined;
      if (!data || !PAID_STATUSES.includes(data.status) || data.confirmationEmailSentAt) return null;
      // Orders paid before this tracking existed already had their emails sent.
      if (!data.payment?.paypalOrderId) return null;

      const lastClaim = data.confirmationEmailClaimedAt ? Date.parse(data.confirmationEmailClaimedAt) : 0;
      if (Date.now() - lastClaim < EMAIL_CLAIM_LEASE_MS) return null;

      tx.update(orderRef, { confirmationEmailClaimedAt: claimedAt });
      return data;
    });
  } catch (claimError) {
    console.error(`Order ${orderRef.id}: failed to claim confirmation email send:`, claimError);
    return;
  }
  if (!order) return;

  try {
    await sendOrderConfirmationEmails({ ...order, id: orderRef.id }, orderRef.id, order.payment.id);
    await orderRef.update({ confirmationEmailSentAt: new Date().toISOString() });
  } catch (mailError) {
    console.error(`Order ${orderRef.id}: failed to send confirmation emails:`, mailError);
    await orderRef
      .update({
        confirmationEmailClaimedAt: FieldValue.delete(),
        confirmationEmailError: String(mailError).slice(0, 500),
      })
      .catch((e) => console.error(`Order ${orderRef.id}: failed to record email error:`, e));
  }
}

export type FulfillmentResult =
  | {
      success: true;
      orderId: string;
      /** True for cartridge package orders, which never went through the cart. */
      isPackage: boolean;
    }
  | { success: false; error: string; orderId?: string };

const PAID_STATUSES: ReadonlyArray<Order["status"]> = ["Processing", "Shipped", "Completed"];

/**
 * Find the order created for a PayPal order ID. New orders keep the PayPal
 * order ID in `payment.paypalOrderId`; older ones only had it in `payment.id`
 * until capture, so fall back to that for orders that are still pending.
 */
async function findOrderRef(paypalOrderId: string) {
  const byOrderId = await db
    .collection("orders")
    .where("payment.paypalOrderId", "==", paypalOrderId)
    .limit(1)
    .get();
  if (!byOrderId.empty) return byOrderId.docs[0].ref;

  const legacy = await db.collection("orders").where("payment.id", "==", paypalOrderId).limit(1).get();
  return legacy.empty ? null : legacy.docs[0].ref;
}

function verifyAmount(paypalOrder: PaypalOrderDetails, expectedTotal: number): string | null {
  const purchaseUnit = paypalOrder.purchase_units?.[0];
  if (!purchaseUnit) return "Invalid purchase units structure in PayPal order.";

  const currency = purchaseUnit.amount?.currency_code;
  if (currency !== "AUD") return `Invalid transaction currency: expected AUD, got ${currency}`;

  const value = parseFloat(purchaseUnit.amount?.value || "0");
  if (Math.abs(value - expectedTotal) > 0.01) {
    return `Amount mismatch: expected $${expectedTotal.toFixed(2)}, got $${value.toFixed(2)}`;
  }
  return null;
}

/**
 * Capture (if needed) and mark an order as paid. Safe to call any number of
 * times, concurrently, from the browser return page and from the webhook:
 * - the PayPal capture call carries an idempotency key,
 * - a capture that fails because another caller already captured is
 *   recovered by re-reading the PayPal order,
 * - the Pending -> Processing transition happens in a Firestore transaction,
 *   and only the caller that performs it sends confirmation emails.
 */
export async function completePaypalOrder(paypalOrderId: string): Promise<FulfillmentResult> {
  const orderRef = await findOrderRef(paypalOrderId);
  if (!orderRef) {
    return { success: false, error: "Order not found." };
  }
  const orderId = orderRef.id;

  const initialSnap = await orderRef.get();
  const initial = initialSnap.data() as Order | undefined;
  if (!initial) return { success: false, error: "Order not found." };
  const isPackage = !!initial.package;

  if (PAID_STATUSES.includes(initial.status)) {
    await ensureConfirmationSent(orderRef);
    return { success: true, orderId, isPackage };
  }
  if (initial.status !== "Pending") {
    return { success: false, orderId, error: `Order ${orderId} is ${initial.status} and cannot be paid.` };
  }

  // 1. Check PayPal's view of the order and the amount before capturing.
  let paypalOrder = await getPaypalOrder(paypalOrderId);
  const amountError = verifyAmount(paypalOrder, initial.total);
  if (amountError) return { success: false, orderId, error: amountError };

  // 2. Capture if it hasn't happened yet.
  if (paypalOrder.status === "APPROVED") {
    try {
      await capturePaypalOrder(paypalOrderId);
      paypalOrder = await getPaypalOrder(paypalOrderId);
    } catch (captureError) {
      // A concurrent caller may have captured first; trust PayPal's state.
      console.warn(`PayPal capture for ${paypalOrderId} failed, re-checking order status:`, captureError);
      paypalOrder = await getPaypalOrder(paypalOrderId);
      if (paypalOrder.status === "APPROVED") {
        // Still uncaptured, so the failure was transient. Throw so callers
        // (the webhook) can signal a retry instead of acknowledging.
        throw captureError;
      }
    }
  }

  if (paypalOrder.status !== "COMPLETED") {
    return {
      success: false,
      orderId,
      error: `PayPal transaction status is ${paypalOrder.status}. Payment has not been completed.`,
    };
  }

  const capture = paypalOrder.purchase_units?.[0]?.payments?.captures?.[0];
  if (!capture || capture.status !== "COMPLETED") {
    return { success: false, orderId, error: `PayPal capture status is ${capture?.status ?? "missing"}.` };
  }
  const captureId = capture.id;
  const payerEmail = paypalOrder.payer?.email_address || "";

  // 3. Atomically move Pending -> Processing, exactly once across callers.
  const transition = await db.runTransaction(async (tx) => {
    const snap = await tx.get(orderRef);
    const current = snap.data() as Order | undefined;
    if (!current) return { won: false as const, status: "missing" };
    if (current.status !== "Pending") return { won: false as const, status: current.status };

    tx.update(orderRef, {
      status: "Processing",
      payment: {
        method: "paypal",
        id: captureId,
        paypalOrderId,
        payerEmail,
        status: "COMPLETED",
      },
      updatedAt: new Date().toISOString(),
    });
    return { won: true as const };
  });

  if (!transition.won) {
    if (PAID_STATUSES.includes(transition.status as Order["status"])) {
      await ensureConfirmationSent(orderRef);
      return { success: true, orderId, isPackage };
    }
    // Money was captured but the order was changed (e.g. cancelled) meanwhile.
    console.error(
      `PayPal order ${paypalOrderId} captured (${captureId}) but order ${orderId} is ${transition.status}. Needs manual review/refund.`
    );
    return {
      success: false,
      orderId,
      error: "Your payment was received but the order needs attention. Please call 1300 515 469.",
    };
  }

  // 4. Send confirmation emails. Retried by later calls if this one fails.
  await ensureConfirmationSent(orderRef);

  return { success: true, orderId, isPackage };
}
