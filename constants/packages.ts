/**
 * Cartridge packages: a whole set of replacement cartridges for a filtration
 * system, sold together at admin-defined offer prices with one flat delivery
 * fee per order. Bought straight from the product page via
 * `/checkout?package=<id>`, bypassing the cart.
 */

import type { Product } from "@/constants/products";

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

/**
 * Whether a package should show for the selected system size. With no size
 * selected every package shows (each is labelled with its size).
 */
export function packageMatchesVariant(
  pkg: Pick<CartridgePackage, "systemVariantId">,
  selectedVariantId: string
): boolean {
  if (!pkg.systemVariantId || !selectedVariantId) return true;
  return pkg.systemVariantId === selectedVariantId;
}

export type ResolvedPackageLine = {
  key: string;
  productId: number;
  slug: string;
  variantId: string;
  variantLabel?: string;
  /** Display name incl. size, e.g. "DGD Sediment Cartridge (20\")" */
  name: string;
  image: string;
  quantity: number;
  offerPrice: number;
  /** Regular unit price excl. GST, 0 when unknown. */
  regularPrice: number;
};

/** A package joined with live product data, ready to display or charge. */
export type ResolvedPackage = {
  id: string;
  name: string;
  systemSlug: string;
  systemVariantId: string;
  lines: ResolvedPackageLine[];
  subtotal: number;
  gst: number;
  delivery: number;
  total: number;
  /** Sum of regular prices excl. GST, for showing the saving. */
  regularSubtotal: number;
};

function parseRegularPrice(priceStr: string | undefined): number {
  if (!priceStr || priceStr.toLowerCase().includes("call for price")) return 0;
  const match = priceStr.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

/**
 * Join a package with the catalogue. Returns null when anything no longer
 * lines up (product removed, size removed, bad price), so callers can treat
 * the package as unavailable instead of charging for something stale.
 * Does not check `active`; callers decide that.
 */
export function resolvePackage(
  pkg: CartridgePackage,
  findProduct: (slug: string) => Product | null | undefined
): ResolvedPackage | null {
  if (!Array.isArray(pkg.items) || pkg.items.length === 0 || pkg.items.length > MAX_PACKAGE_ITEMS) {
    return null;
  }
  if (typeof pkg.deliveryFee !== "number" || !Number.isFinite(pkg.deliveryFee) || pkg.deliveryFee < 0) {
    return null;
  }

  const lines: ResolvedPackageLine[] = [];
  for (const item of pkg.items) {
    if (
      typeof item.offerPrice !== "number" ||
      !Number.isFinite(item.offerPrice) ||
      item.offerPrice <= 0 ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > MAX_PACKAGE_ITEM_QUANTITY
    ) {
      return null;
    }

    const product = findProduct(item.slug);
    if (!product || product.category !== "Cartridges") return null;

    const hasVariants = !!product.variants && product.variants.length > 0;
    const variant = hasVariants ? product.variants!.find((v) => v.id === item.variantId) : undefined;
    if (hasVariants && !variant) return null;
    if (!hasVariants && item.variantId) return null;

    lines.push({
      key: `${product.slug}::${item.variantId}`,
      productId: product.id,
      slug: product.slug,
      variantId: item.variantId,
      ...(variant ? { variantLabel: variant.label } : {}),
      name: variant ? `${product.name} (${variant.label})` : product.name,
      image: variant?.image || product.image,
      quantity: item.quantity,
      offerPrice: roundCurrency(item.offerPrice),
      regularPrice: parseRegularPrice(variant ? variant.price : product.price),
    });
  }

  const totals = computePackageTotals({ items: lines, deliveryFee: pkg.deliveryFee });
  const regularSubtotal = roundCurrency(
    lines.reduce((sum, line) => sum + line.regularPrice * line.quantity, 0)
  );

  return {
    id: pkg.id,
    name: pkg.name,
    systemSlug: pkg.systemSlug,
    systemVariantId: pkg.systemVariantId || "",
    lines,
    ...totals,
    regularSubtotal,
  };
}

export function formatAud(value: number): string {
  return `$${value.toFixed(2)}`;
}
