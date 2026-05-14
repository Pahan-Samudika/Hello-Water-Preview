import type { Metadata } from "next";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo";
import { breadcrumbsJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createMetadata({
  title: "Water Filtration FAQs",
  description:
    "Answers to common questions about Hello Water whole-home filtration, installation, servicing, replacement cartridges, cost, and warranty.",
  path: "/faq",
  keywords: ["water filtration FAQ", "whole home filter installation"],
});

export default function FaqLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Home", path: "/" },
          { name: "FAQs", path: "/faq" },
        ])}
      />
      {children}
    </>
  );
}
