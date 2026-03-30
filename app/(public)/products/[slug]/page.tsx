import Link from "next/link";
import { notFound } from "next/navigation";

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
      <Link href="/products" className="text-sm text-muted-foreground hover:underline">
        Back to products
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border bg-muted/20">
          <img
            src={product.image}
            alt={product.imageAlt}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-5 rounded-2xl border p-6">
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

          <div className="space-y-4">
            {product.description.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-7 text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="rounded-2xl border bg-muted/30 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Key Features
            </h2>
            <ul className="mt-4 space-y-3">
              {product.features.map((feature) => (
                <li key={feature} className="text-sm leading-6 text-foreground">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
