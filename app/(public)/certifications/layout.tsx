import type { Metadata } from "next";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo";
import { breadcrumbsJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createMetadata({
  title: "Certifications",
  description:
    "Review Hello Water filtration certifications and standards including WaterMark, AS/NZS 4020, Sensitive Choice, and NSF/ANSI performance testing.",
  path: "/certifications",
});

export default function CertificationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Home", path: "/" },
          { name: "Certifications", path: "/certifications" },
        ])}
      />
      {children}
    </>
  );
}
