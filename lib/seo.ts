import type { Metadata } from "next";

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "https://hellowaterfiltration.com.au";

export const siteConfig = {
  name: "Hello Water Filtration",
  shortName: "Hello Water",
  url: configuredSiteUrl.replace(/\/+$/, ""),
  description:
    "Australian whole-home water filtration systems, reverse osmosis, UV purification, replacement cartridges, installation, and servicing.",
  locale: "en_AU",
  logo: "/icon.svg",
  phone: "1300 515 469",
  email: "support@hellowaterfiltration.com.au",
  address: {
    streetAddress: "103/55 Victor Crs",
    addressLocality: "Narre Warren",
    addressRegion: "VIC",
    postalCode: "3805",
    addressCountry: "AU",
  },
  socialLinks: [
    "https://web.facebook.com/people/Hello-Water/61551773243133/",
  ],
};

const defaultOgImage = "/opengraph-image";

export const defaultKeywords = [
  "whole home water filtration",
  "water filtration Australia",
  "home water filter",
  "PFAS water filtration",
  "reverse osmosis system",
  "UV water purification",
  "replacement water cartridges",
  "Hello Water Filtration",
];

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${siteConfig.url}${normalizedPath}`;
}

export function createMetadata({
  title,
  description,
  path = "/",
  image = defaultOgImage,
  type = "website",
  keywords = [],
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
  noIndex?: boolean;
} = {}): Metadata {
  const pageTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} | Whole-Home Water Filtration Australia`;
  const pageDescription = description ?? siteConfig.description;
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const mergedKeywords = Array.from(new Set([...defaultKeywords, ...keywords]));

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: mergedKeywords,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
    other: {
      "geo.region": siteConfig.address.addressRegion,
      "geo.placename": siteConfig.address.addressLocality,
      "business:contact_data:country_name": "Australia",
    },
  };
}
