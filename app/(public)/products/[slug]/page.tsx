import Link from "next/link";
import { notFound } from "next/navigation";

import {
  fetchWooCommerceProductBySlug,
  type WooCommerceProduct,
} from "@/utils/fetchUtil";

function formatProductPrice(product: WooCommerceProduct) {
  const prices = product.prices;

  if (!prices?.price) {
    return "Price on request";
  }

  const minorUnit = prices.currency_minor_unit ?? 2;
  const amount = Number(prices.price);

  if (Number.isNaN(amount)) {
    return `${prices.currency_symbol}${prices.price}`;
  }

  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: prices.currency_code || "AUD",
  }).format(amount / 10 ** minorUnit);
}

function sanitizeProductHtml(input: string) {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

export default async function ProductViewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchWooCommerceProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const imageSrc = product.images?.[0]?.src;
  const imageAlt = product.images?.[0]?.alt || product.name;
  const descriptionHtml = sanitizeProductHtml(
    product.description || product.short_description || "",
  );

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/products" className="text-sm text-muted-foreground hover:underline">
        Back to products
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border bg-muted/20">
          {imageSrc ? (
            <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-96 items-center justify-center text-sm text-muted-foreground">
              No image available
            </div>
          )}
        </div>

        <div className="space-y-5 rounded-2xl border p-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          <p className="text-2xl font-semibold">{formatProductPrice(product)}</p>

          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        </div>
      </div>
    </section>
  );
}
