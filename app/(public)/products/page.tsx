import { ProductCard } from "@/components/custom/product-card";
import { getProducts } from "@/lib/db-queries";
import { type Product } from "@/constants/products";
import { MotionWrapper } from "@/components/custom/motion-wrapper";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbsJsonLd,
  productCollectionJsonLd,
} from "@/lib/structured-data";

export const revalidate = 0;

export default async function ProductsPage() {
  const products = await getProducts();
  const filtrationSystems = products.filter((p) => p.category === "Filtration Systems");
  const cartridges = products.filter((p) => p.category === "Cartridges");

  return (
    <main className="relative overflow-hidden w-full min-h-screen">
      <JsonLd
        data={[
          breadcrumbsJsonLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
          ]),
          productCollectionJsonLd(products),
        ]}
      />
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:py-16 sm:px-6 lg:px-8">
        <MotionWrapper 
          className="mb-12 space-y-4"
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
              Explore our range of high-quality water filtration products designed to provide you with clean, safe, & great-tasting water.
            </p>
          </MotionWrapper>
        </MotionWrapper>

        {/* Filtration Systems Section */}
        {filtrationSystems.length > 0 && (
          <div className="mb-16">
            <MotionWrapper
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.3 } },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-center sm:text-left text-2xl font-bold text-foreground sm:text-3xl">Filtration Systems</h2>
            </MotionWrapper>
            
            <MotionWrapper
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {filtrationSystems.map((product) => (
                <ProductGridItem key={product.id} product={product} />
              ))}
            </MotionWrapper>
          </div>
        )}

        {/* Cartridges Section */}
        {cartridges.length > 0 && (
          <div className="mb-16">
            <MotionWrapper
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-center sm:text-left text-2xl font-bold text-foreground sm:text-3xl">Cartridges</h2>
            </MotionWrapper>

            <MotionWrapper
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {cartridges.map((product) => (
                <ProductGridItem key={product.id} product={product} />
              ))}
            </MotionWrapper>
          </div>
        )}

        {products.length === 0 && (
          <p className="mt-6 text-sm text-muted-foreground">No products found.</p>
        )}
      </section>
    </main>
  );
}

function ProductGridItem({ product }: { product: Product }) {
  return (
    <MotionWrapper
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
        description={product.cardDescription}
        price={product.price}
        image={product.image}
        imageAlt={product.imageAlt}
        recent={product.recent}
        href={`/products/${product.slug}`}
      />
    </MotionWrapper>
  );
}
