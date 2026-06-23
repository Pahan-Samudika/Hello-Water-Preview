"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: number;
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
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  gstAmount: number;
  totalWithGst: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

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
    if (quantity <= 0) return;
    const priceNumeric = parseProductPrice(item.priceString);

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((i) => i.id === item.id);
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }
      return [...prevCart, { ...item, priceNumeric, quantity }];
    });
    
    // Automatically open cart drawer
    setCartOpen(true);
  };

  const removeItem = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
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
