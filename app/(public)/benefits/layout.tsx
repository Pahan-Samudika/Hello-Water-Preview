import type { Metadata } from "next";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo";
import { breadcrumbsJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createMetadata({
  title: "Benefits",
  description:
    "See how whole-home water filtration improves taste, odour, skin, hair, appliances, scale control, and bottled-water reduction.",
  path: "/benefits",
  keywords: ["water filter benefits", "chlorine reduction", "hard water scale"],
});

export default function BenefitsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Home", path: "/" },
          { name: "Benefits", path: "/benefits" },
        ])}
      />
      {children}
    </>
  );
}
