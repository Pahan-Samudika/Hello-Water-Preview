import type { Metadata } from "next";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo";
import { breadcrumbsJsonLd, webPageJsonLd } from "@/lib/structured-data";

const page = {
  title: "Filtration Technology",
  description:
    "Discover the sediment, activated carbon, ACF, KDF, PFAS reduction, and UV purification technology behind Hello Water systems.",
  path: "/technology",
  keywords: ["PFAS filtration technology", "KDF filter media", "ACF cartridge"],
};

export const metadata: Metadata = createMetadata(page);

export default function TechnologyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbsJsonLd([
            { name: "Home", path: "/" },
            { name: "Technology", path: "/technology" },
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
