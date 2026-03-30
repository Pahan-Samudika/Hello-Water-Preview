import { ProductCard } from "@/components/custom/product-card";
import { products } from "@/constants/products";

export default async function ProductsPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Products</h1>
        <p className="text-muted-foreground">
          Explore our best water filtration products in Australia.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            description={product.shortDescription}
            price={product.price}
            image={product.image}
            imageAlt={product.imageAlt}
            href={`/products/${product.slug}`}
          />
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">No products found.</p>
      )}
    </section>
  );
}
