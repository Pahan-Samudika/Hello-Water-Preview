"use client";

import React, { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { type Product, type ProductVariant } from "@/constants/products";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
  /** When true, the button stays disabled until a variant is selected. */
  requiresVariant?: boolean;
}

export function AddToCartButton({ product, selectedVariant, requiresVariant = false }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const isDisabled = requiresVariant && !selectedVariant;

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  const activeName = selectedVariant ? `${product.name} (${selectedVariant.label})` : product.name;
  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeImage = selectedVariant?.image || product.image;
  const activeId = selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id;

  const handleAddToCart = () => {
    if (isDisabled) return;
    addItem(
      {
        id: activeId,
        slug: product.slug,
        name: activeName,
        priceString: activePrice,
        image: activeImage,
        variantId: selectedVariant?.id,
      },
      quantity
    );
    toast.success(`${activeName} added to cart!`, {
      description: `${quantity} x ${activePrice} added successfully.`,
      duration: 3000,
    });
  };

  return (
    <div className="space-y-2 pt-2">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
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
          disabled={isDisabled}
          aria-describedby={isDisabled ? "add-to-cart-hint" : undefined}
          className="flex-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-black text-primary-foreground hover:bg-primary/95 transition-all shadow-lg shadow-primary/10 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:bg-primary"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>
      </div>
      {isDisabled && (
        <p id="add-to-cart-hint" className="text-xs font-semibold text-muted-foreground">
          Select an option / size above to add to cart.
        </p>
      )}
    </div>
  );
}
