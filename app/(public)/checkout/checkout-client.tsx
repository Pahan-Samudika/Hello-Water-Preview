"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SmartImage } from "@/components/ui/smart-image";
import { ShoppingBag, ArrowLeft, ShieldCheck, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { initiatePaypalCheckout } from "@/app/actions/orders";

interface CheckoutClientProps {
  standardDeliveryFee: number;
}

const AU_STATES = [
  { value: "NSW", label: "NSW (New South Wales)" },
  { value: "VIC", label: "VIC (Victoria)" },
  { value: "QLD", label: "QLD (Queensland)" },
  { value: "WA", label: "WA (Western Australia)" },
  { value: "SA", label: "SA (South Australia)" },
  { value: "TAS", label: "TAS (Tasmania)" },
  { value: "ACT", label: "ACT (Capital Territory)" },
  { value: "NT", label: "NT (Northern Territory)" },
];

export function CheckoutClient({ standardDeliveryFee }: CheckoutClientProps) {
  const { cart, subtotal, gstAmount, totalWithGst, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping form state
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    suburb: "",
    postcode: "",
    state: "",
  });

  // Check if form is fully valid
  const isFormValid =
    shippingDetails.name.trim() !== "" &&
    shippingDetails.email.trim() !== "" &&
    shippingDetails.phone.trim() !== "" &&
    shippingDetails.address.trim() !== "" &&
    shippingDetails.suburb.trim() !== "" &&
    shippingDetails.postcode.trim() !== "" &&
    shippingDetails.state !== "";

  // Calculate final total
  const finalTotal = totalWithGst + standardDeliveryFee;

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync error parameters from URL to state
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "cancelled") {
        setPaymentError("Payment was cancelled. You can try again or proceed with a different transaction.");
      } else {
        setPaymentError(decodeURIComponent(errorParam));
      }
    }
  }, [searchParams]);

  const handlePayWithPaypal = async () => {
    if (!isFormValid) {
      setPaymentError("Please fill in all the required delivery details first.");
      const formElement = document.getElementById("checkout-name");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "center" });
        formElement.focus();
      }
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const result = await initiatePaypalCheckout({
        customer: shippingDetails,
        cartItems: cart.map((item) => ({
          slug: item.slug,
          quantity: item.quantity,
          variantId: item.variantId,
        })),
      });

      if (result.success) {
        // Redirect browser to PayPal payment approval
        window.location.href = result.approvalUrl;
      } else {
        setPaymentError(result.error || "Failed to initiate PayPal checkout. Please try again.");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("PayPal checkout initiation failed:", err);
      setPaymentError("An unexpected error occurred while connecting to PayPal. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary" />
      </div>
    );
  }

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  // If cart is empty, show empty state
  if (cart.length === 0) {
    return (
      <main className="relative overflow-hidden w-full min-h-screen flex items-center justify-center py-16 px-6">
        <div className="max-w-md w-full text-center space-y-6 rounded-[2.5rem] border border-border/40 bg-card/30 backdrop-blur-xl p-8 sm:p-12 shadow-2xl">
          <div className="mx-auto rounded-full bg-primary/10 p-6 text-primary w-fit">
            <ShoppingBag className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Your Cart is Empty</h1>
            <p className="text-sm text-muted-foreground">
              You must add at least one cartridge product to your shopping cart before you can check out.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center px-8 rounded-full bg-primary text-sm font-black text-primary-foreground hover:bg-primary/95 transition-all shadow-lg shadow-primary/10 w-full"
          >
            Browse Cartridges
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden w-full min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:py-16 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-12 space-y-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Products</span>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
            Checkout
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Please fill in your delivery details below to proceed to the PayPal payment screen.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] items-start">
          {/* Left Column: Form & Payment Placeholders */}
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-border/40 bg-card/25 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                  1
                </span>
                Shipping & Contact Information
              </h2>

              <div className="space-y-5">
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="checkout-name" className="pl-1 text-sm font-medium text-foreground/85">
                    Full Name
                  </Label>
                  <Input
                    id="checkout-name"
                    name="name"
                    value={shippingDetails.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    className="h-12 rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="checkout-email" className="pl-1 text-sm font-medium text-foreground/85">
                      Email Address
                    </Label>
                    <Input
                      id="checkout-email"
                      name="email"
                      type="email"
                      value={shippingDetails.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
                      required
                      className="h-12 rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="checkout-phone" className="pl-1 text-sm font-medium text-foreground/85">
                      Mobile Number
                    </Label>
                    <Input
                      id="checkout-phone"
                      name="phone"
                      type="tel"
                      value={shippingDetails.phone}
                      onChange={handleInputChange}
                      placeholder="04xx xxx xxx"
                      required
                      className="h-12 rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="checkout-address" className="pl-1 text-sm font-medium text-foreground/85">
                    Street Address
                  </Label>
                  <Input
                    id="checkout-address"
                    name="address"
                    value={shippingDetails.address}
                    onChange={handleInputChange}
                    placeholder="123 Waterway Lane"
                    required
                    className="h-12 rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50"
                  />
                </div>

                {/* Suburb, Postcode, State */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="flex flex-col gap-2 sm:col-span-1">
                    <Label htmlFor="checkout-suburb" className="pl-1 text-sm font-medium text-foreground/85">
                      Suburb / Town
                    </Label>
                    <Input
                      id="checkout-suburb"
                      name="suburb"
                      value={shippingDetails.suburb}
                      onChange={handleInputChange}
                      placeholder="Sydney"
                      required
                      className="h-12 rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="checkout-postcode" className="pl-1 text-sm font-medium text-foreground/85">
                      Postcode
                    </Label>
                    <Input
                      id="checkout-postcode"
                      name="postcode"
                      value={shippingDetails.postcode}
                      onChange={handleInputChange}
                      placeholder="2000"
                      required
                      className="h-12 rounded-xl border-input/40 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="checkout-state" className="pl-1 text-sm font-medium text-foreground/85">
                      State / Territory
                    </Label>
                    <Select
                      name="state"
                      items={AU_STATES}
                      value={shippingDetails.state || null}
                      onValueChange={(val) =>
                        setShippingDetails((prev) => ({ ...prev, state: (val as string | null) ?? "" }))
                      }
                      required
                    >
                      <SelectTrigger
                        id="checkout-state"
                        className="data-[size=default]:h-12 w-full rounded-xl border-input/40 bg-transparent px-3 shadow-xs focus-visible:ring-primary/50 focus-visible:border-primary/50"
                      >
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent
                        alignItemWithTrigger={false}
                        align="end"
                        className="w-auto min-w-(--anchor-width) rounded-xl p-1"
                      >
                        {AU_STATES.map((s) => (
                          <SelectItem key={s.value} value={s.value} className="rounded-lg py-2 pl-3">
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Country (Pre-filled and Locked) */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="checkout-country" className="pl-1 text-sm font-medium text-foreground/85">
                    Country
                  </Label>
                  <Input
                    id="checkout-country"
                    name="country"
                    value="Australia"
                    disabled
                    className="h-12 rounded-xl border-input/40 shadow-xs opacity-60 bg-muted/20"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="rounded-[2rem] border border-border/40 bg-card/25 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-6">
            <h2 className="text-xl font-bold text-foreground pb-4 border-b border-border/40 flex items-center gap-2">
              <ShoppingBag className="size-5 text-primary" />
              Order Summary
            </h2>

            {/* Itemized list */}
            <div className="divide-y divide-border/30 max-h-80 overflow-y-auto pr-2 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 pt-3 first:pt-0">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted/40">
                    <SmartImage
                      src={item.image}
                      alt={item.name}
                      useNextImage
                      fill
                      sizes="56px"
                      containerClassName="h-full w-full"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h4 className="font-bold text-xs text-foreground line-clamp-2" title={item.name}>
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right font-semibold text-xs text-foreground shrink-0 pt-0.5">
                    ${(item.priceNumeric * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-border/40 pt-4 space-y-3">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtotal (excl. GST)</span>
                <span className="font-semibold text-foreground">${subtotal.toFixed(2)} AUD</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Estimated GST (10%)</span>
                <span className="font-semibold text-foreground">${gstAmount.toFixed(2)} AUD</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Standard Delivery (Flat Rate)</span>
                <span className="font-semibold text-foreground">${standardDeliveryFee.toFixed(2)} AUD</span>
              </div>

              <div className="border-t border-border/40 pt-4 flex justify-between text-base font-bold text-foreground">
                <span>Total Amount</span>
                <span className="text-primary text-lg">${finalTotal.toFixed(2)} AUD</span>
              </div>
            </div>


            {/* Payment Area */}
            <div className="pt-4 border-t border-border/40 space-y-4">
              {paymentError && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-xs text-destructive-foreground">
                  <p className="font-semibold text-rose-300">{paymentError}</p>
                </div>
              )}

              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePayWithPaypal}
                className="w-full h-12 rounded-full bg-primary text-primary-foreground font-black text-sm hover:bg-primary/95 transition-all shadow-lg shadow-primary/10 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 text-primary-foreground" />
                    Connecting to PayPal...
                  </>
                ) : (
                  <>
                    Proceed to Payment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
