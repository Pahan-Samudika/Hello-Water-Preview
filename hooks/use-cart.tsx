"use client";

import React, { createContext, useContext, useState, useSyncExternalStore } from "react";

export interface CartItem {
  id: number | string;
  slug: string;
  name: string;
  priceString: string;
  priceNumeric: number;
  quantity: number;
  image: string;
  /** Selected variant (e.g. cartridge size); the server prices by it. */
  variantId?: string;
}

/**
 * Carts saved before variantId existed only encoded the variant in the line id
 * as `${productId}-${variantId}` (product ids are numeric). Recover it so those
 * carts can still check out.
 */
function migrateStoredCart(items: CartItem[]): CartItem[] {
  return items.map((item) => {
    if (item.variantId || typeof item.id !== "string") return item;
    const match = item.id.match(/^\d+-(.+)$/);
    return match ? { ...item, variantId: match[1] } : item;
  });
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

const STORAGE_KEY = "hw_cart";
const EMPTY_CART: CartItem[] = [];

/*
 * The cart lives in localStorage and is read through useSyncExternalStore:
 * the server and the hydration pass see an empty cart, then React switches to
 * the stored one without a setState-in-effect round trip. Changes made in
 * another tab arrive through the `storage` event.
 */
let cartCache: CartItem[] | null = null;
const cartListeners = new Set<() => void>();

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_CART;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? migrateStoredCart(parsed) : EMPTY_CART;
  } catch (e) {
    console.error("Error loading cart from localStorage", e);
    return EMPTY_CART;
  }
}

function getCartSnapshot(): CartItem[] {
  if (cartCache === null) cartCache = readStoredCart();
  return cartCache;
}

function getServerCartSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function subscribeToCart(listener: () => void) {
  cartListeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      cartCache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    cartListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function updateCart(update: (prev: CartItem[]) => CartItem[]) {
  const prev = getCartSnapshot();
  const next = update(prev);
  if (next === prev) return;
  cartCache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (e) {
    console.error("Error saving cart to localStorage", e);
  }
  cartListeners.forEach((listener) => listener());
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerCartSnapshot);
  const [cartOpen, setCartOpen] = useState(false);

  const addItem = (item: Omit<CartItem, "quantity" | "priceNumeric">, quantity = 1) => {
    if (!Number.isInteger(quantity) || quantity <= 0) return;
    const priceNumeric = parseProductPrice(item.priceString);

    updateCart((prevCart) => {
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
    updateCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number | string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      removeItem(id);
      return;
    }
    const clamped = Math.min(quantity, MAX_QUANTITY_PER_ITEM);
    updateCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: clamped } : item))
    );
  };

  const clearCart = () => {
    updateCart(() => EMPTY_CART);
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
