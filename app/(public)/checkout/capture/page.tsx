"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { capturePaypalCheckout } from "@/app/actions/orders";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

function CaptureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("Invalid checkout session. Missing payment token.");
      return;
    }

    let isMounted = true;

    async function executeCapture() {
      try {
        const result = await capturePaypalCheckout(token!);
        if (!isMounted) return;

        if (result.success) {
          setStatus("success");
          // Package purchases skip the cart, so leave the shopper's cart alone.
          if (!result.isPackage) clearCart();
          // Redirect to success page
          router.replace(`/checkout/success?orderId=${result.orderId}`);
        } else {
          setStatus("error");
          setErrorMsg(result.error || "Failed to capture payment. Please contact support.");
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Capture execution failed:", err);
        setStatus("error");
        setErrorMsg("An unexpected error occurred while completing payment verification.");
      }
    }

    executeCapture();

    return () => {
      isMounted = false;
    };
  }, [token, router]);

  return (
    <div className="max-w-md w-full text-center space-y-6 rounded-[2.5rem] border border-border/40 bg-card/30 backdrop-blur-xl p-8 sm:p-12 shadow-2xl">
      {status === "loading" && (
        <>
          <div className="mx-auto rounded-full bg-primary/10 p-6 text-primary w-fit animate-pulse">
            <Loader2 className="h-12 w-12 animate-spin" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Securing Your Order</h1>
            <p className="text-sm text-muted-foreground">
              We are verifying your transaction with PayPal and finalizing your order details. Please do not close or refresh this page.
            </p>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <div className="mx-auto rounded-full bg-destructive/10 p-6 text-destructive w-fit">
            <AlertCircle className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Checkout Failed</h1>
            <p className="text-sm text-rose-300 font-medium">
              {errorMsg}
            </p>
          </div>
          <button
            onClick={() => router.replace("/checkout")}
            className="inline-flex h-12 items-center justify-center px-8 rounded-full bg-primary text-sm font-black text-primary-foreground hover:bg-primary/95 transition-all shadow-lg shadow-primary/10 w-full cursor-pointer"
          >
            Return to Checkout
          </button>
        </>
      )}

      {status === "success" && (
        <>
          <div className="mx-auto rounded-full bg-emerald-500/10 p-6 text-emerald-500 w-fit">
            <ShieldCheck className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Payment Approved</h1>
            <p className="text-sm text-muted-foreground">
              Your payment was captured successfully. Redirecting you to your order confirmation page...
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default function CheckoutCapturePage() {
  return (
    <main className="relative overflow-hidden w-full min-h-screen flex items-center justify-center py-16 px-6">
      <Suspense fallback={
        <div className="max-w-md w-full text-center space-y-6 rounded-[2.5rem] border border-border/40 bg-card/30 backdrop-blur-xl p-8 sm:p-12 shadow-2xl">
          <div className="mx-auto rounded-full bg-primary/10 p-6 text-primary w-fit animate-pulse">
            <Loader2 className="h-12 w-12 animate-spin" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Loading Checkout</h1>
            <p className="text-sm text-muted-foreground">
              Loading payment capture context...
            </p>
          </div>
        </div>
      }>
        <CaptureContent />
      </Suspense>
    </main>
  );
}
