import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getProductBySlug, getProducts } from "@/lib/db-queries";
import { type Product } from "@/constants/products";
import { MotionWrapper } from "@/components/custom/motion-wrapper";
import { MoreProducts } from "@/components/custom/more-products";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo";
import { breadcrumbsJsonLd, productJsonLd } from "@/lib/structured-data";
import { ProductDetailsInteractive } from "@/components/custom/product-details-interactive";
export const revalidate = 0;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return createMetadata({
      title: "Product Not Found",
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/products/${product.slug}`,
    image: product.image || "/opengraph-image",
    type: "article",
    keywords: [
      product.category,
      product.name,
      ...(product.features?.slice(0, 5) ?? []),
    ],
  });
}

export default async function ProductViewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();

  // Compute compatible systems server-side so crawlers can index the links
  const isCartridge = product.category === "Cartridges";
  const compatibleSystems = isCartridge
    ? allProducts.filter((p) => {
        if (p.category !== "Filtration Systems" || !p.stages) return false;
        return p.stages.some((stage) =>
          stage.cartridges.some((link) => link.slug === product!.slug)
        );
      })
    : [];

  return (
    <main className="relative overflow-hidden w-full min-h-screen">
      <JsonLd
        data={[
          breadcrumbsJsonLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: product.name, path: `/products/${product.slug}` },
          ]),
          productJsonLd(product, compatibleSystems.length > 0 ? compatibleSystems : undefined),
        ]}
      />
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:py-12 sm:px-6 lg:px-8">
        <div className="space-y-8 md:space-y-12">
          <MotionWrapper
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-4"
          >
            <Link
              href="/products"
              className="inline-flex w-fit items-center gap-2 rounded-full border bg-background px-5 py-2.5 text-sm font-medium text-muted-foreground shadow-sm transition-all hover:bg-primary/5 hover:text-primary hover:border-primary/20"
            >
              <ArrowLeft className="size-4" />
              <span>Back to products</span>
            </Link>
          </MotionWrapper>

          <ProductDetailsInteractive
            product={product}
            allProducts={allProducts}
            initialCompatibleSystems={compatibleSystems}
          />

          {/* Server-rendered compatible systems links — visible to crawlers, hidden visually */}
          {compatibleSystems.length > 0 && (
            <nav
              aria-label="Compatible filtration systems"
              className="sr-only"
            >
              <h2>Compatible Filtration Systems</h2>
              <ul>
                {compatibleSystems.map((sys) => (
                  <li key={sys.slug}>
                    <a href={`/products/${sys.slug}`}>{sys.name}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <MotionWrapper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <article className="rounded-[2.5rem] border bg-card/95 backdrop-blur-xl p-6 sm:p-8 lg:p-12 shadow-2xl">
              <div className="border-b border-border/60 pb-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/70">
                  Product Description
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  Product details
                </h2>
              </div>

              <div className="mt-8 space-y-8">
                <div className="space-y-5">
                  {product.description.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="rounded-[2rem] bg-muted/30 p-6 sm:p-8 border border-white/5 dark:border-white/10">
                  <h3 className="text-xl font-bold tracking-tight">Key Features</h3>
                  <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {product.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                      >
                        <svg className="mt-1 size-4 shrink-0 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </MotionWrapper>

          <MotionWrapper
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <MoreProducts currentProductSlug={product.slug} products={allProducts} />
          </MotionWrapper>
        </div>
      </section>
    </main>
  );
}
