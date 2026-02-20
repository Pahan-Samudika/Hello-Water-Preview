"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type QuantityCounterProps = {
  initialValue?: number;
  min?: number;
};

export function QuantityCounter({
  initialValue = 1,
  min = 1,
}: QuantityCounterProps) {
  const startValue = Math.max(min, initialValue);
  const [quantity, setQuantity] = useState(startValue);

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => setQuantity((current) => Math.max(min, current - 1))}
      >
        <Minus />
        <span className="sr-only">Decrease quantity</span>
      </Button>

      <input
        id="product-quantity"
        type="number"
        min={min}
        value={quantity}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          setQuantity(Number.isNaN(nextValue) ? min : Math.max(min, nextValue));
        }}
        className="h-9 w-20 rounded-md border bg-transparent px-2 text-center text-sm"
      />

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => setQuantity((current) => current + 1)}
      >
        <Plus />
        <span className="sr-only">Increase quantity</span>
      </Button>
    </div>
  );
}
