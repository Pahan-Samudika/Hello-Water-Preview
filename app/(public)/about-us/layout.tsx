import type { Metadata } from "next";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo";
import { breadcrumbsJsonLd, webPageJsonLd } from "@/lib/structured-data";

const page = {
  title: "About Us",
  description:
    "Learn about Hello Water Filtration, an Australian water filtration company delivering certified whole-home systems and service across Australia.",
  path: "/about-us",
};

export const metadata: Metadata = createMetadata(page);

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbsJsonLd([
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about-us" },
          ]),
          webPageJsonLd({
            name: page.title,
            description: page.description,
            path: page.path,
          }),
        ]}
      />
      {children}
    </>
  );
}
