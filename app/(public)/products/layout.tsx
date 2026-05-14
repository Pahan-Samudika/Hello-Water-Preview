import type { Metadata } from "next";
import type { ReactNode } from "react";

import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Water Filtration Products",
  description:
    "Explore Hello Water whole-home filtration systems, reverse osmosis systems, UV purification, and replacement cartridges for Australian homes.",
  path: "/products",
  keywords: ["water filtration products", "whole house water filter systems"],
});

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return children;
}
