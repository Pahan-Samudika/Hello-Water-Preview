"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: number | string;
  slug: string;
  name: string;
  priceString: string;
  priceNumeric: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "priceNumeric">, quantity?: number) => void;
  removeItem: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  gstAmount: number;
  totalWithGst: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

// Keep in sync with the limits in app/actions/orders.ts
export const MAX_QUANTITY_PER_ITEM = 50;
export const MAX_CART_LINES = 20;

const CartContext = createContext<CartContextType | undefined>(undefined);

export function parseProductPrice(priceStr: string): number {
  if (!priceStr || priceStr.toLowerCase().includes("call for price")) {
    return 0;
  }
  const match = priceStr.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("hw_cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error("Error loading cart from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("hw_cart", JSON.stringify(cart));
      } catch (e) {
        console.error("Error saving cart to localStorage", e);
      }
    }
  }, [cart, isLoaded]);

  const addItem = (item: Omit<CartItem, "quantity" | "priceNumeric">, quantity = 1) => {
    if (!Number.isInteger(quantity) || quantity <= 0) return;
    const priceNumeric = parseProductPrice(item.priceString);

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((i) => i.id === item.id);
      if (existingItemIndex > -1) {
        return prevCart.map((i, idx) =>
          idx === existingItemIndex
            ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_QUANTITY_PER_ITEM) }
            : i
        );
      }
      if (prevCart.length >= MAX_CART_LINES) return prevCart;
      return [...prevCart, { ...item, priceNumeric, quantity: Math.min(quantity, MAX_QUANTITY_PER_ITEM) }];
    });
    
    // Automatically open cart drawer
    setCartOpen(true);
  };

  const removeItem = (id: number | string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number | string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      removeItem(id);
      return;
    }
    const clamped = Math.min(quantity, MAX_QUANTITY_PER_ITEM);
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: clamped } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.priceNumeric * item.quantity, 0);

  // GST is 10% in Australia (the prices in the DB are excl. GST, i.e., "$156.00 + GST")
  const gstAmount = subtotal * 0.1;
  const totalWithGst = subtotal + gstAmount;

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        gstAmount,
        totalWithGst,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
