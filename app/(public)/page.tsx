import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import HeroSection from "@/components/shadcn-studio/blocks/hero-section/hero-section";
// [SPRING BLOOM SALE] Comment out to disable
import { AnnouncementBanner } from "@/components/custom/announcement-banner";
import { PromotionsSection } from "@/components/custom/promotions-section";
import { AboutSummary } from "@/components/custom/about-summary";
import { PFASSummary } from "@/components/custom/pfas-summary";
import { TechnologySummary } from "@/components/custom/technology-summary";
import { TrustindexReviewsSection } from "@/components/custom/trustindex-reviews-section";

import { menudata } from "@/constants";
import { createMetadata } from "@/lib/seo";
import { serviceJsonLd, webPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createMetadata({
  title: "Whole-Home Water Filtration Australia",
  description:
    "Hello Water Filtration installs certified whole-home water filtration systems, PFAS reduction technology, reverse osmosis, UV purification, and replacement cartridges across Australia.",
  path: "/",
  keywords: [
    "whole-home water filtration Australia",
    "PFAS water filter Australia",
    "home water filtration installation",
  ],
});

export default function PublicHomePage() {
  return (
    <main className='flex flex-col'>
      <JsonLd
        data={[
          webPageJsonLd({
            name: "Whole-home water filtration in Australia",
            description: metadata.description as string,
            path: "/",
          }),
          serviceJsonLd(),
        ]}
      />
      {/* [SPRING BLOOM SALE] Comment out to disable */}
      <AnnouncementBanner />
      <HeroSection menudata={menudata} />
      <PromotionsSection />
      <AboutSummary />
      <PFASSummary />
      <TechnologySummary />
      <TrustindexReviewsSection />
    </main>
  );
}
