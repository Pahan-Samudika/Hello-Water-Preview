import Image from "next/image";

import { TrustindexTestimonialsSection } from "@/components/custom/trustindex-testimonials-section";
import AboutUs from "@/components/shadcn-studio/blocks/about-us-section/about-us-section";
import { stats } from "@/constants";
import { MotionWrapper } from "@/components/custom/motion-wrapper";
import { HowItWorks } from "@/components/custom/how-it-works";
import txtLogoWhite from "@/assets/svg/txtlogo-white.svg";
import txtLogoBlack from "@/assets/svg/txtlogo-black.svg";

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden w-full min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:py-16 sm:px-6 lg:px-8">
        <MotionWrapper
          className="mb-12 space-y-8 max-w-6xl mx-auto md:space-y-12"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <MotionWrapper
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
              About Us
            </h1>
          </MotionWrapper>

          <MotionWrapper
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            <div className="my-8 md:my-14 mx-auto w-full max-w-[250px] sm:max-w-md lg:max-w-lg">
              <Image src={txtLogoBlack} alt="Hello Water" className="w-full h-auto mx-auto dark:hidden" />
              <Image src={txtLogoWhite} alt="Hello Water" className="hidden w-full h-auto mx-auto dark:block" />
            </div>
          </MotionWrapper>

          <MotionWrapper
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            <p className="text-justify text-muted-foreground sm:text-lg leading-relaxed max-w-5xl mx-auto">
              At Hello Water Filtration®, we believe the water in your home should be as clean & safe & tasty as it looks, because what you can’t see matters most.
              <br />
              <br />
              Featuring worlds leading Pentair™ premium Water filtration Cartridges, media & other components, the system independently certified by  NSF International Standard 42 for material safety & integrity, Australian Water Quality Centre AS/NZS 4020 for Drinking Water Product Testing Standards, Watermark Certification, & the Australian Asthma Council Certification for Sensitive Choice, it is the most certified system currently available in Australian Market.
              We specialise in whole-home water filtration systems that remove chlorine, chloramine, heavy metals, & everyday contaminants in the drinking water as a result of environment pollution, delivering better water from every tap, shower, & your hot water system. From your morning shower to the glass you drink at night, we’re here to improve the quality of water you use every single day.
            </p>
          </MotionWrapper>
        </MotionWrapper>

        <AboutUs stats={stats} />
      </section>

      <HowItWorks />

      <TrustindexTestimonialsSection />
    </main>
  );
}
