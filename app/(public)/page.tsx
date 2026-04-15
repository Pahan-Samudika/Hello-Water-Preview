import HeroSection from "@/components/shadcn-studio/blocks/hero-section/hero-section";
import { AboutSummary } from "@/components/custom/about-summary";
import { PFASSummary } from "@/components/custom/pfas-summary";
import { TechnologySummary } from "@/components/custom/technology-summary";
import { TrustindexReviewsSection } from "@/components/custom/trustindex-reviews-section";

import { menudata } from "@/constants";

export default function PublicHomePage() {
  return (
    <main className='flex flex-col'>
      <HeroSection menudata={menudata} />
      <AboutSummary />
      <PFASSummary />
      <TechnologySummary />
      <TrustindexReviewsSection />
    </main>
  );
}
