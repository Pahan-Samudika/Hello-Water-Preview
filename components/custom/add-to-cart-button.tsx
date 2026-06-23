"use client";

import React, { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { type Product } from "@/constants/products";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        priceString: product.price,
        image: product.image,
      },
      quantity
    );
    toast.success(`${product.name} added to cart!`, {
      description: `${quantity} x ${product.price} added successfully.`,
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center pt-2">
      {/* Quantity Selector */}
      <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 p-1 w-full sm:w-32 h-12 shrink-0">
        <button
          onClick={handleDecrement}
          className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-10 text-center font-bold text-foreground text-sm">
          {quantity}
        </span>
        <button
          onClick={handleIncrement}
          className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add To Cart Button */}
      <button
        onClick={handleAddToCart}
        className="flex-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-black text-primary-foreground hover:bg-primary/95 transition-all shadow-lg shadow-primary/10 cursor-pointer"
      >
        <ShoppingBag className="h-4 w-4" />
        <span>Add to Cart</span>
      </button>
    </div>
  );
}
