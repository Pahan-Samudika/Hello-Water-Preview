import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getProductBySlug, products } from "@/constants/products";
import { MotionWrapper } from "@/components/custom/motion-wrapper";

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductViewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="relative overflow-hidden w-full min-h-screen">
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

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
            <MotionWrapper
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="overflow-hidden rounded-[2.5rem] border bg-muted/20 shadow-xl"
            >
              <img
                src={product.image}
                alt={product.imageAlt}
                className="block aspect-square w-full object-cover"
              />
            </MotionWrapper>

            <MotionWrapper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="space-y-5 rounded-[2.5rem] border bg-background p-6 sm:p-8 lg:p-10 shadow-xl"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
                {product.category}
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
                {product.name}
              </h1>

              <p className="text-3xl font-semibold bg-linear-to-r from-primary via-sky-500 to-cyan-400 bg-clip-text text-transparent w-fit">
                {product.price}
              </p>

              <p className="text-base leading-relaxed text-muted-foreground">
                {product.shortDescription}
              </p>

              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                {product.features.slice(0, 4).map((feature) => (
                  <div
                    key={feature}
                    className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm leading-6 text-foreground/90 font-medium tracking-tight"
                  >
                    {feature}
                  </div>
                ))}
              </div>
            </MotionWrapper>
          </div>

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

                <div className="rounded-[2rem] bg-muted/40 p-6 sm:p-8 border border-white/5 dark:border-white/10">
                  <h3 className="text-xl font-bold">Key features</h3>
                  <div className="mt-6 grid gap-4 flex-wrap sm:grid-cols-2">
                    {product.features.map((feature) => (
                      <div
                        key={feature}
                        className="rounded-2xl border bg-background shadow-xs px-5 py-3.5 text-sm leading-6 flex items-center gap-3 font-medium text-foreground/90"
                      >
                        <div className="size-1.5 rounded-full bg-primary shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </MotionWrapper>
        </div>
      </section>
    </div>
  );
}
