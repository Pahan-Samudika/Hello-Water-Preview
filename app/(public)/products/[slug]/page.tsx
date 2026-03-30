import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getProductBySlug, products } from "@/constants/products";

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
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <Link
            href="/products"
            className="inline-flex w-fit items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span>Back to products</span>
          </Link>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
          <div className="overflow-hidden rounded-[2rem] border bg-muted/20">
            <img
              src={product.image}
              alt={product.imageAlt}
              className="block aspect-square w-full object-cover"
            />
          </div>

          <div className="space-y-5 rounded-[2rem] border bg-background p-6 sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {product.category}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            <p className="text-2xl font-semibold">{product.price}</p>

            <p className="text-base leading-7 text-muted-foreground">
              {product.shortDescription}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {product.features.slice(0, 4).map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border bg-muted/25 px-4 py-3 text-sm leading-6"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        <article className="rounded-[2rem] border bg-background p-6 sm:p-8 lg:p-10">
          <div className="border-b pb-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Product Description
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Product details
            </h2>
          </div>

          <div className="mt-8 space-y-8">
            <div className="space-y-4">
              {product.description.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-muted-foreground sm:text-base">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="rounded-3xl bg-muted/25 p-5 sm:p-6">
              <h3 className="text-lg font-semibold">Key features</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <div
                    key={feature}
                    className="rounded-2xl border bg-background px-4 py-3 text-sm leading-6"
                  >
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
