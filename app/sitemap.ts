import type { MetadataRoute } from "next";

import { products } from "@/constants/products";
import { siteConfig } from "@/lib/seo";

const staticRoutes = [
  "",
  "/products",
  "/about-us",
  "/benefits",
  "/technology",
  "/certifications",
  "/faq",
  "/contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified,
      changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : route === "/products" ? 0.9 : 0.7,
    })),
    ...products.map((product) => ({
      url: `${siteConfig.url}/products/${product.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
