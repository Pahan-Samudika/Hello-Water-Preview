import { requireSession } from "@/lib/admin-auth";
import { getProducts } from "@/lib/db-queries";
import { ProductsClient } from "./products-client";

export const revalidate = 0;

export default async function AdminProductsPage() {
  // Guard: Requires "Product Management" permission
  await requireSession("Product Management");

  // Fetch all products
  const products = await getProducts();

  return <ProductsClient initialProducts={products} />;
}
