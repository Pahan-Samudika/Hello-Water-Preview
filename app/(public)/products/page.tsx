import { ProductCard } from "@/components/custom/product-card";
import { products } from "@/constants/products";
import { MotionWrapper } from "@/components/custom/motion-wrapper";

export default async function ProductsPage() {
  return (
    <div className="relative overflow-hidden w-full min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:py-16 sm:px-6 lg:px-8">
        <MotionWrapper 
          className="mb-8 space-y-4"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          <MotionWrapper
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
            }}
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
              Our Products
            </h1>
          </MotionWrapper>
          <MotionWrapper
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
            }}
          >
            <p className="text-muted-foreground sm:text-lg">
              Explore our range of high-quality water filtration products designed to provide you with clean, safe, and great-tasting water.
            </p>
          </MotionWrapper>
        </MotionWrapper>

        <MotionWrapper
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {products.map((product) => (
            <MotionWrapper
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
                },
              }}
            >
              <ProductCard
                name={product.name}
                description={product.shortDescription}
                price={product.price}
                image={product.image}
                imageAlt={product.imageAlt}
                href={`/products/${product.slug}`}
              />
            </MotionWrapper>
          ))}
        </MotionWrapper>

        {products.length === 0 && (
          <p className="mt-6 text-sm text-muted-foreground">No products found.</p>
        )}
      </section>
    </div>
  );
}
