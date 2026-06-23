import type { ReactNode } from "react";

import { Header } from "@/components/header";
import { Footer } from "@/components/custom/footer";
import { CartDrawer } from "@/components/custom/cart-drawer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <CartDrawer />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
