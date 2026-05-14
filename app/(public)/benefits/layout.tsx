import type { Metadata } from "next";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo";
import { breadcrumbsJsonLd, webPageJsonLd } from "@/lib/structured-data";

const page = {
  title: "Benefits",
  description:
    "See how whole-home water filtration improves taste, odour, skin, hair, appliances, scale control, and bottled-water reduction.",
  path: "/benefits",
  keywords: ["water filter benefits", "chlorine reduction", "hard water scale"],
};

export const metadata: Metadata = createMetadata(page);

export default function BenefitsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbsJsonLd([
            { name: "Home", path: "/" },
            { name: "Benefits", path: "/benefits" },
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
