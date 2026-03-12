import type { ReactNode } from "react";

import Navbar from "@/components/shadcn-studio/blocks/navbar-component/navbar-component";
import { Footer } from "@/components/custom/footer";

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
    title: "Contact Us",
    href: "/contact",
  },
];

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar navigationData={navigationData} />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
