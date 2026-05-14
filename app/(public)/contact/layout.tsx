import type { Metadata } from "next";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo";
import { breadcrumbsJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description:
    "Contact Hello Water Filtration for product advice, water filtration quotes, installation support, and replacement cartridge service.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      {children}
    </>
  );
}
