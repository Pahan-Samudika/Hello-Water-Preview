import type { Metadata } from "next";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo";
import { breadcrumbsJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createMetadata({
  title: "About Us",
  description:
    "Learn about Hello Water Filtration, an Australian water filtration company delivering certified whole-home systems and service across Australia.",
  path: "/about-us",
});

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about-us" },
        ])}
      />
      {children}
    </>
  );
}
