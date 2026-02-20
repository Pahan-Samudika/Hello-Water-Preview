const WORDPRESS_BASE_URL = "https://www.hellowaterfiltration.com.au";

type FetchProductsOptions = {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
};

export type WooCommerceProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  short_description: string;
  description: string;
  prices?: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit?: number;
  };
  images?: Array<{
    id: number;
    src: string;
    thumbnail: string;
    alt: string;
    name: string;
  }>;
};

export async function fetchWooCommerceProducts(
  options: FetchProductsOptions = {},
): Promise<WooCommerceProduct[]> {
  const { page = 1, perPage = 12, search, category } = options;

  const url = new URL("/wp-json/wc/store/v1/products", WORDPRESS_BASE_URL);

  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));

  if (search) {
    url.searchParams.set("search", search);
  }

  if (category) {
    url.searchParams.set("category", category);
  }

  const response = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch WooCommerce products: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as WooCommerceProduct[];
}

export async function fetchWooCommerceProductBySlug(
  slug: string,
): Promise<WooCommerceProduct | null> {
  const url = new URL("/wp-json/wc/store/v1/products", WORDPRESS_BASE_URL);
  url.searchParams.set("slug", slug);
  url.searchParams.set("per_page", "1");

  const response = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch WooCommerce product by slug: ${response.status} ${response.statusText}`,
    );
  }

  const products = (await response.json()) as WooCommerceProduct[];
  return products[0] ?? null;
}
