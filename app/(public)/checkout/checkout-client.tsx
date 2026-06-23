"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartImage } from "@/components/ui/smart-image";
import { ShoppingBag, ArrowLeft, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";

interface CheckoutClientProps {
  standardDeliveryFee: number;
}

export function CheckoutClient({ standardDeliveryFee }: CheckoutClientProps) {
  const { cart, subtotal, gstAmount, totalWithGst } = useCart();
  const [mounted, setMounted] = useState(false);

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

  // Calculate final total
  const finalTotal = totalWithGst + standardDeliveryFee;

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Check if form is fully valid
  const isFormValid =
    shippingDetails.name.trim() !== "" &&
    shippingDetails.email.trim() !== "" &&
    shippingDetails.phone.trim() !== "" &&
    shippingDetails.address.trim() !== "" &&
    shippingDetails.suburb.trim() !== "" &&
    shippingDetails.postcode.trim() !== "" &&
    shippingDetails.state !== "";

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
            Secure Checkout
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
                    <select
                      id="checkout-state"
                      name="state"
                      value={shippingDetails.state}
                      onChange={handleInputChange}
                      required
                      className="flex h-12 w-full rounded-xl border border-input/40 bg-background px-3 py-1 text-sm shadow-xs transition-all focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-primary/50 focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                    >
                      <option value="" disabled>Select State</option>
                      <option value="NSW">NSW (New South Wales)</option>
                      <option value="VIC">VIC (Victoria)</option>
                      <option value="QLD">QLD (Queensland)</option>
                      <option value="WA">WA (Western Australia)</option>
                      <option value="SA">SA (South Australia)</option>
                      <option value="TAS">TAS (Tasmania)</option>
                      <option value="ACT">ACT (Capital Territory)</option>
                      <option value="NT">NT (Northern Territory)</option>
                    </select>
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

            {/* Payment Section Placeholder (Step 3 UI) */}
            <div className="rounded-[2rem] border border-border/40 bg-card/25 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                  2
                </span>
                Payment Options
              </h2>

              {!isFormValid ? (
                <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 p-8 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="rounded-full bg-muted/40 p-3 text-muted-foreground">
                    <CreditCard className="size-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Payment forms locked</p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Please fill in all the required delivery details above to unlock your payment and PayPal payment options.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center flex flex-col items-center justify-center space-y-3 animate-fadeIn">
                  <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-400">
                    <ShieldCheck className="size-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Delivery Information Complete</p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      PayPal payment option is ready. In the next step, the checkout will render your sandbox/live PayPal buttons right here.
                    </p>
                  </div>
                  <button
                    disabled
                    className="mt-3 inline-flex h-11 items-center justify-center px-6 rounded-xl bg-slate-800 text-xs font-bold text-slate-400 border border-slate-700 w-full max-w-xs cursor-not-allowed"
                  >
                    PayPal Loading (Step 4)...
                  </button>
                </div>
              )}
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

            {/* Guarantees */}
            <div className="rounded-2rem bg-muted/30 p-4 border border-white/5 space-y-3.5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="size-4.5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-foreground">Secure SSL Encrypted Checkout</h4>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    We ensure secure transactions with high grade SSL protocols. Your payment info is handled externally by PayPal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
