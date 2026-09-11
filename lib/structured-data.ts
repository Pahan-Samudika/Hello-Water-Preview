import { type Product } from "@/constants/products";
import { absoluteUrl, siteConfig } from "@/lib/seo";
import type { DBBlogPost } from "@/lib/db-queries";

const organizationId = `${siteConfig.url}/#organization`;
const websiteId = `${siteConfig.url}/#website`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": organizationId,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logo),
    image: absoluteUrl("/opengraph-image"),
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address,
    },
    areaServed: {
      "@type": "Country",
      name: "Australia",
    },
    sameAs: siteConfig.socialLinks,
    priceRange: "$$",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        email: siteConfig.email,
        contactType: "customer support",
        areaServed: "AU",
        availableLanguage: ["en"],
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: {
      "@id": organizationId,
    },
  };
}

export function webPageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@id": websiteId,
    },
    publisher: {
      "@id": organizationId,
    },
  };
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Whole-home water filtration installation and servicing",
    description: siteConfig.description,
    serviceType: "Water filtration installation",
    provider: {
      "@id": organizationId,
    },
    areaServed: {
      "@type": "Country",
      name: "Australia",
    },
    url: siteConfig.url,
  };
}

export function breadcrumbsJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productJsonLd(
  product: Product,
  compatibleSystems?: Product[]
) {
  const numericPrice = product.price.match(/\$([\d,.]+)/)?.[1]?.replace(/,/g, "");

  // Build per-variant offers when variants exist
  const offers =
    product.variants && product.variants.length > 0
      ? product.variants.map((variant) => {
          const vPrice = variant.price?.match(/\$([\d,.]+)/)?.[1]?.replace(/,/g, "");
          return {
            "@type": "Offer",
            url: absoluteUrl(`/products/${product.slug}?variant=${variant.id}`),
            availability: "https://schema.org/InStock",
            priceCurrency: "AUD",
            name: variant.label || variant.name,
            ...(vPrice ? { price: vPrice } : {}),
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "AUD",
              description: variant.price || product.price,
            },
          };
        })
      : {
          "@type": "Offer",
          url: absoluteUrl(`/products/${product.slug}`),
          availability: "https://schema.org/InStock",
          priceCurrency: "AUD",
          ...(numericPrice ? { price: numericPrice } : {}),
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "AUD",
            description: product.price,
          },
        };

  // Features as structured additionalProperty
  const additionalProperty =
    product.features && product.features.length > 0
      ? product.features.map((f) => ({
          "@type": "PropertyValue",
          name: "Feature",
          value: f,
        }))
      : undefined;

  // Related compatible systems (for cartridges)
  const isRelatedTo =
    compatibleSystems && compatibleSystems.length > 0
      ? compatibleSystems.map((sys) => ({
          "@type": "Product",
          name: sys.name,
          url: absoluteUrl(`/products/${sys.slug}`),
        }))
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${absoluteUrl(`/products/${product.slug}`)}#product`,
    name: product.name,
    description: product.shortDescription,
    image: product.image ? [absoluteUrl(product.image)] : undefined,
    url: absoluteUrl(`/products/${product.slug}`),
    sku: product.slug,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers,
    ...(additionalProperty ? { additionalProperty } : {}),
    ...(isRelatedTo ? { isRelatedTo } : {}),
  };
}

export function productCollectionJsonLd(productList: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Hello Water Filtration products",
    description:
      "Whole-home water filtration systems, reverse osmosis, UV purification, and replacement cartridges.",
    url: absoluteUrl("/products"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: productList.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/products/${product.slug}`),
        name: product.name,
      })),
    },
  };
}

export function faqPageJsonLd(
  categories: { items: { question: string; answer: string }[] }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((category) =>
      category.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      }))
    ),
  };
}

export function articleJsonLd(post: DBBlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(`/blogs/${post.slug}`)}#article`,
    headline: post.title,
    description: post.excerpt,
    url: absoluteUrl(`/blogs/${post.slug}`),
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    image: post.coverImage ? absoluteUrl(post.coverImage) : absoluteUrl("/opengraph-image"),
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@id": organizationId,
    },
    isPartOf: {
      "@id": websiteId,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blogs/${post.slug}`),
    },
  };
}
