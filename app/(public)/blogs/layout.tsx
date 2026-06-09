import type { Metadata } from "next";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata } from "@/lib/seo";
import { breadcrumbsJsonLd, webPageJsonLd } from "@/lib/structured-data";

const page = {
  title: "Blogs & Water Quality Articles",
  description:
    "Stay informed with the latest articles on water quality, PFAS contamination, environmental impact, and whole-home filtration systems in Australia.",
  path: "/blogs",
};

export const metadata: Metadata = createMetadata(page);

export default function BlogsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbsJsonLd([
            { name: "Home", path: "/" },
            { name: "Blogs", path: "/blogs" },
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
