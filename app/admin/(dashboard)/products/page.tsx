import { requireSession } from "@/lib/admin-auth";
import { getProducts, getCertifications } from "@/lib/db-queries";
import { ProductsClient } from "./products-client";

export const revalidate = 0;

export default async function AdminProductsPage() {
  // Guard: Requires "Product Management" permission
  await requireSession("Product Management");

  // Fetch all products & certifications
  const products = await getProducts();
  const certifications = await getCertifications();

  return <ProductsClient initialProducts={products} certifications={certifications} />;
}
