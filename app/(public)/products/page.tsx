import { ProductCard } from "@/components/custom/product-card";
import {
  fetchWooCommerceProducts,
  type WooCommerceProduct,
} from "@/utils/fetchUtil";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80";

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, "").trim();
}

function formatProductPrice(product: WooCommerceProduct) {
  const prices = product.prices;

  if (!prices?.price) {
    return "View Details";
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

export default async function ProductsPage() {
  let products: WooCommerceProduct[] = [];
  let hasError = false;

  try {
    products = await fetchWooCommerceProducts({ perPage: 9 });
  } catch {
    hasError = true;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Products</h1>
        <p className="text-muted-foreground">
          Explore our best water filtration products in Australia.
        </p>
      </div>

      {hasError && (
        <p className="mb-6 rounded-md border px-4 py-3 text-sm text-muted-foreground">
          Unable to load products right now. Please try again shortly.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            name={product.name}
            description={stripHtml(product.short_description || product.description)}
            price={formatProductPrice(product)}
            image={product.images?.[0]?.src || FALLBACK_IMAGE}
            imageAlt={product.images?.[0]?.alt || product.name}
          />
        ))}
      </div>

      {!hasError && products.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">No products found.</p>
      )}
    </section>
  );
}
