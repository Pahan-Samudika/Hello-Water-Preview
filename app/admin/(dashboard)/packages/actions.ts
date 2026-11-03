"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession, hasPermission } from "@/lib/admin-auth";
import {
  createPackage,
  updatePackage,
  deletePackage,
  getPackageById,
  getProductBySlug,
} from "@/lib/db-queries";
import {
  MAX_PACKAGE_ITEMS,
  MAX_PACKAGE_ITEM_QUANTITY,
  roundCurrency,
  type CartridgePackage,
  type PackageItem,
} from "@/constants/packages";

// Security guard: packages are part of the product catalogue
async function checkAuth() {
  const session = await getAdminSession();
  if (!session || !hasPermission(session, "Product Management")) {
    throw new Error("Unauthorized access. Permission denied.");
  }
  return session;
}

export interface PackageInput {
  name: string;
  systemSlug: string;
  systemVariantId: string;
  items: PackageItem[];
  deliveryFee: number;
  active: boolean;
}

type PackageFields = Omit<CartridgePackage, "id" | "createdAt" | "updatedAt">;

const MAX_PRICE = 100000;

function isMoney(value: unknown, { allowZero }: { allowZero: boolean }): value is number {
  if (typeof value !== "number" || !Number.isFinite(value)) return false;
  if (value > MAX_PRICE) return false;
  if (allowZero ? value < 0 : value <= 0) return false;
  // At most two decimal places
  return Math.abs(roundCurrency(value) - value) < 1e-9;
}

/**
 * Check every field against the live catalogue so a package can never point
 * at a product, size or price that checkout would reject.
 */
async function validatePackageInput(input: PackageInput): Promise<PackageFields> {
  if (!input || typeof input !== "object") throw new Error("Invalid package data.");

  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name || name.length > 120) {
    throw new Error("Package name is required (max 120 characters).");
  }

  if (typeof input.systemSlug !== "string" || !input.systemSlug) {
    throw new Error("Please choose a filtration system.");
  }
  const system = await getProductBySlug(input.systemSlug);
  if (!system || system.category !== "Filtration Systems") {
    throw new Error("Selected filtration system was not found.");
  }

  const systemVariantId = typeof input.systemVariantId === "string" ? input.systemVariantId : "";
  if (systemVariantId && !system.variants?.some((v) => v.id === systemVariantId)) {
    throw new Error("Selected system size was not found.");
  }

  if (!isMoney(input.deliveryFee, { allowZero: true })) {
    throw new Error("Delivery fee must be zero or a positive amount with at most 2 decimals.");
  }

  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw new Error("Add at least one cartridge to the package.");
  }
  if (input.items.length > MAX_PACKAGE_ITEMS) {
    throw new Error(`A package can contain at most ${MAX_PACKAGE_ITEMS} cartridges.`);
  }

  const seen = new Set<string>();
  const items: PackageItem[] = [];
  for (const raw of input.items) {
    const slug = typeof raw?.slug === "string" ? raw.slug : "";
    const variantId = typeof raw?.variantId === "string" ? raw.variantId : "";

    const product = slug ? await getProductBySlug(slug) : null;
    if (!product || product.category !== "Cartridges") {
      throw new Error(`Cartridge not found: ${slug || "(empty)"}`);
    }

    const hasVariants = !!product.variants && product.variants.length > 0;
    const variant = hasVariants ? product.variants!.find((v) => v.id === variantId) : undefined;
    if (hasVariants && !variant) {
      throw new Error(`Please choose a size for ${product.name}.`);
    }
    if (!hasVariants && variantId) {
      throw new Error(`${product.name} has no sizes; remove and re-add it.`);
    }
    const label = variant ? `${product.name} (${variant.label})` : product.name;

    const key = `${slug}::${variantId}`;
    if (seen.has(key)) throw new Error(`${label} is listed more than once.`);
    seen.add(key);

    if (!Number.isInteger(raw.quantity) || raw.quantity < 1 || raw.quantity > MAX_PACKAGE_ITEM_QUANTITY) {
      throw new Error(`Quantity for ${label} must be a whole number between 1 and ${MAX_PACKAGE_ITEM_QUANTITY}.`);
    }
    if (!isMoney(raw.offerPrice, { allowZero: false })) {
      throw new Error(`Offer price for ${label} must be a positive amount with at most 2 decimals.`);
    }

    items.push({ slug, variantId, quantity: raw.quantity, offerPrice: roundCurrency(raw.offerPrice) });
  }

  return {
    name,
    systemSlug: system.slug,
    systemVariantId,
    items,
    deliveryFee: roundCurrency(input.deliveryFee),
    active: input.active === true,
  };
}

function revalidatePackagePaths(...systemSlugs: (string | undefined)[]) {
  revalidatePath("/admin/packages");
  revalidatePath("/checkout");
  for (const slug of new Set(systemSlugs)) {
    if (slug) revalidatePath(`/products/${slug}`);
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected error occurred.";
}

export async function createPackageAction(input: PackageInput) {
  try {
    await checkAuth();
    const fields = await validatePackageInput(input);
    const now = new Date().toISOString();
    const pkg: Omit<CartridgePackage, "id"> = { ...fields, createdAt: now, updatedAt: now };
    const id = await createPackage(pkg);
    revalidatePackagePaths(fields.systemSlug);
    return { success: true as const, package: { ...pkg, id } };
  } catch (error: unknown) {
    console.error("Create package error:", error);
    return { success: false as const, error: errorMessage(error) };
  }
}

export async function updatePackageAction(id: string, input: PackageInput) {
  try {
    await checkAuth();
    const existing = typeof id === "string" && id ? await getPackageById(id) : null;
    if (!existing) throw new Error("Package not found.");

    const fields = await validatePackageInput(input);
    await updatePackage(id, fields);
    revalidatePackagePaths(existing.systemSlug, fields.systemSlug);
    const updated: CartridgePackage = {
      ...existing,
      ...fields,
      updatedAt: new Date().toISOString(),
    };
    return { success: true as const, package: updated };
  } catch (error: unknown) {
    console.error("Update package error:", error);
    return { success: false as const, error: errorMessage(error) };
  }
}

export async function setPackageActiveAction(id: string, active: boolean) {
  try {
    await checkAuth();
    const existing = typeof id === "string" && id ? await getPackageById(id) : null;
    if (!existing) throw new Error("Package not found.");

    await updatePackage(id, { active: active === true });
    revalidatePackagePaths(existing.systemSlug);
    return { success: true as const };
  } catch (error: unknown) {
    console.error("Toggle package error:", error);
    return { success: false as const, error: errorMessage(error) };
  }
}

export async function deletePackageAction(id: string) {
  try {
    await checkAuth();
    const existing = typeof id === "string" && id ? await getPackageById(id) : null;
    if (!existing) throw new Error("Package not found.");

    await deletePackage(id);
    revalidatePackagePaths(existing.systemSlug);
    return { success: true as const };
  } catch (error: unknown) {
    console.error("Delete package error:", error);
    return { success: false as const, error: errorMessage(error) };
  }
}
