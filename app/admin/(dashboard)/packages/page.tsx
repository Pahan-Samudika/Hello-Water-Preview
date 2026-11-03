import { requireSession } from "@/lib/admin-auth";
import { getPackages, getProducts } from "@/lib/db-queries";
import { PackagesClient } from "./packages-client";

export const revalidate = 0;

export default async function AdminPackagesPage() {
  // Guard: packages are part of the product catalogue
  await requireSession("Product Management");

  const [packages, products] = await Promise.all([getPackages(), getProducts()]);

  return <PackagesClient initialPackages={packages} products={products} />;
}
