import type { Metadata } from "next";

export const siteConfig = {
  name: "Hello Water Filtration",
  shortName: "Hello Water",
  url: "https://hellowaterfiltration.com.au",
  description:
    "Australian whole-home water filtration systems, reverse osmosis, UV purification, replacement cartridges, installation, and servicing.",
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
  return new URL(path, siteConfig.url).toString();
}

export function createMetadata({
  title,
  description,
  path = "/",
  image = "/opengraph-image",
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
    : siteConfig.name;
  const pageDescription = description ?? siteConfig.description;
  const url = absoluteUrl(path);

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [...defaultKeywords, ...keywords],
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
      locale: "en_AU",
      type,
      images: [
        {
          url: absoluteUrl(image),
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
      images: [absoluteUrl(image)],
    },
  };
}
