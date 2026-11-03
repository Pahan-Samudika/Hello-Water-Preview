/**
 * Cartridge packages: a whole set of replacement cartridges for a filtration
 * system, sold together at admin-defined offer prices with one flat delivery
 * fee per order. Bought straight from the product page via
 * `/checkout?package=<id>`, bypassing the cart.
 */

export type PackageItem = {
  /** Cartridge product slug. */
  slug: string;
  /** Cartridge variant id; empty string when the cartridge has no variants. */
  variantId: string;
  quantity: number;
  /** Offer price per unit, excl. GST. */
  offerPrice: number;
};

export type CartridgePackage = {
  /** Firestore document id. */
  id: string;
  name: string;
  /** Filtration system this package belongs to. */
  systemSlug: string;
  /** Optional system variant (size) the package applies to; empty = all sizes. */
  systemVariantId?: string;
  items: PackageItem[];
  /** Flat delivery fee for the whole package order, excl. GST. */
  deliveryFee: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export const GST_RATE = 0.1;
export const MAX_PACKAGE_ITEMS = 20;
export const MAX_PACKAGE_ITEM_QUANTITY = 50;

/** Round to cents to avoid floating point drift in totals. */
export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function computePackageTotals(pkg: Pick<CartridgePackage, "items" | "deliveryFee">) {
  const subtotal = roundCurrency(
    pkg.items.reduce((sum, item) => sum + item.offerPrice * item.quantity, 0)
  );
  const gst = roundCurrency(subtotal * GST_RATE);
  const delivery = roundCurrency(pkg.deliveryFee);
  return { subtotal, gst, delivery, total: roundCurrency(subtotal + gst + delivery) };
}

/** Whether a package applies to the currently selected system size. */
export function packageMatchesVariant(pkg: CartridgePackage, selectedVariantId: string): boolean {
  if (!pkg.systemVariantId) return true;
  return pkg.systemVariantId === selectedVariantId;
}

export function formatAud(value: number): string {
  return `$${value.toFixed(2)}`;
}
