import type { ReactNode } from "react";

import Navbar from "@/components/shadcn-studio/blocks/navbar-component-01/navbar-component-01";

const navigationData = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Products",
    href: "/products",
  },
  {
    title: "About Us",
    href: "/about",
  },
  {
    title: "Contacts",
    href: "/contact",
  },
];

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar navigationData={navigationData} />
      <main>{children}</main>
    </>
  );
}
