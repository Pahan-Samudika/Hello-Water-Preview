import Link from "next/link";
import HeroSection from "@/components/shadcn-studio/blocks/hero-section/hero-section";

import { menudata } from "@/constants";

export default function PublicHomePage() {
  return (
    <main className='flex flex-col'>
        <HeroSection menudata={menudata} />
      </main>
  );
}
