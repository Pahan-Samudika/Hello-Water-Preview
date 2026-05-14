import type { Metadata } from "next";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo";
import { breadcrumbsJsonLd, webPageJsonLd } from "@/lib/structured-data";

const page = {
  title: "Certifications",
  description:
    "Review Hello Water filtration certifications and standards including WaterMark, AS/NZS 4020, Sensitive Choice, and NSF/ANSI performance testing.",
  path: "/certifications",
};

export const metadata: Metadata = createMetadata(page);

export default function CertificationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbsJsonLd([
            { name: "Home", path: "/" },
            { name: "Certifications", path: "/certifications" },
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
