import HeroSection from "@/components/shadcn-studio/blocks/hero-section/hero-section";
import { AboutSummary } from "@/components/custom/about-summary";
import { TrustindexReviewsSection } from "@/components/custom/trustindex-reviews-section";

import { menudata } from "@/constants";

export default function PublicHomePage() {
  return (
    <main className='flex flex-col'>
      <HeroSection menudata={menudata} />
      <AboutSummary />
      <TrustindexReviewsSection />
    </main>
  );
}
