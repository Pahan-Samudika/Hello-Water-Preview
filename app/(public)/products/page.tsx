import { ProductCard } from "@/components/custom/product-card";
import { products } from "@/constants/products";
import { MotionWrapper } from "@/components/custom/motion-wrapper";

export default async function ProductsPage() {
  return (
    <div className="relative overflow-hidden w-full min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:py-12 sm:px-6 lg:px-8">
        <MotionWrapper 
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
            Our Products
          </h1>
          <p className="text-muted-foreground sm:text-lg">
            Explore our range of high-quality water filtration products designed to provide you with clean, safe, and great-tasting water.
          </p>
        </MotionWrapper>

        <MotionWrapper
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
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
        </MotionWrapper>

        {products.length === 0 && (
          <p className="mt-6 text-sm text-muted-foreground">No products found.</p>
        )}
      </section>
    </div>
  );
}
