import { getPackageById, getProductBySlug, getActivePackagesForSystem } from "@/lib/db-queries";
import { resolvePackage, type ResolvedPackage } from "@/constants/packages";
import type { Product } from "@/constants/products";

const PACKAGE_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

export function isValidPackageId(id: unknown): id is string {
  return typeof id === "string" && PACKAGE_ID_PATTERN.test(id);
}

/**
 * Load an active package and price it against the live catalogue.
 * Returns null when the package is missing, hidden or out of date.
 */
export async function getResolvedActivePackage(id: string): Promise<ResolvedPackage | null> {
  if (!isValidPackageId(id)) return null;

  const pkg = await getPackageById(id);
  if (!pkg || pkg.active !== true || !Array.isArray(pkg.items)) return null;

  const slugs = Array.from(new Set(pkg.items.map((item) => item.slug)));
  const products = await Promise.all(slugs.map((slug) => getProductBySlug(slug)));
  const bySlug = new Map<string, Product>();
  products.forEach((product) => {
    if (product) bySlug.set(product.slug, product);
  });

  return resolvePackage(pkg, (slug) => bySlug.get(slug));
}

/** Active, still-valid packages for a system's product page. */
export async function getResolvedPackagesForSystem(
  systemSlug: string,
  allProducts: Product[]
): Promise<ResolvedPackage[]> {
  const packages = await getActivePackagesForSystem(systemSlug);
  if (packages.length === 0) return [];

  const bySlug = new Map(allProducts.map((p) => [p.slug, p]));
  return packages
    .map((pkg) => resolvePackage(pkg, (slug) => bySlug.get(slug)))
    .filter((pkg): pkg is ResolvedPackage => pkg !== null);
}
