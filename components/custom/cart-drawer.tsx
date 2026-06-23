"use client";

import React, { useEffect, useRef } from "react";
import { useCart } from "@/hooks/use-cart";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SmartImage } from "@/components/ui/smart-image";

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeItem,
    subtotal,
    gstAmount,
    totalWithGst,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [cartOpen]);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setCartOpen]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer Container */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-[130] flex w-full max-w-md flex-col border-l border-white/5 bg-background/95 backdrop-blur-xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 p-5">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Your Shopping Cart</h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="rounded-full bg-primary/10 p-5 text-primary">
                    <ShoppingBag className="h-10 w-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">Your cart is empty</h3>
                    <p className="text-xs text-muted-foreground max-w-[240px]">
                      Add some replacement cartridges to your cart to get started with your checkout.
                    </p>
                  </div>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="inline-flex h-10 items-center justify-center px-6 rounded-full bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10 cursor-pointer"
                  >
                    Browse Cartridges
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-start gap-4 rounded-2rem border border-border/40 bg-card/40 p-4 transition-all hover:bg-card/70 hover:border-border/80"
                  >
                    {/* Product Image */}
                    <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/30">
                      <SmartImage
                        src={item.image}
                        alt={item.name}
                        useNextImage
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <h4 className="font-bold text-sm text-foreground truncate" title={item.name}>
                        {item.name}
                      </h4>
                      <p className="text-xs font-semibold text-primary">
                        {item.priceString}
                      </p>

                      {/* Quantity Selector & Delete Button */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center rounded-lg border border-border/80 bg-background/50 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout CTA */}
            {cart.length > 0 && (
              <div className="border-t border-border/60 bg-muted/20 p-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subtotal (excl. GST)</span>
                    <span className="font-semibold text-foreground">${subtotal.toFixed(2)} AUD</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Estimated GST (10%)</span>
                    <span className="font-semibold text-foreground">${gstAmount.toFixed(2)} AUD</span>
                  </div>
                  <div className="border-t border-border/40 my-1 pt-2 flex justify-between text-sm font-bold text-foreground">
                    <span>Total (incl. GST)</span>
                    <span className="text-primary">${totalWithGst.toFixed(2)} AUD</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic text-right">
                    Standard delivery fee calculated at checkout.
                  </p>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-black text-primary-foreground hover:bg-primary/95 transition-all shadow-lg shadow-primary/10 group cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
