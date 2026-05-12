import type { ReactNode } from "react";

import { Header } from "@/components/header";
import { Footer } from "@/components/custom/footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
