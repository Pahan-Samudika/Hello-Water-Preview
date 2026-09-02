import type { ReactNode } from "react";

import { Header } from "@/components/header";
import { Footer } from "@/components/custom/footer";
// [WINTER SALE] Uncomment to re-enable snowfall for future events
// import { Snowfall } from "@/components/custom/snowfall";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* [WINTER SALE] Uncomment to re-enable snowfall for future events */}
      {/* <Snowfall /> */}
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
