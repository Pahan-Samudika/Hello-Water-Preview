"use client";
import TestimonialsComponent, { type TestimonialItem } from "@/components/shadcn-studio/blocks/testimonials-component-18/testimonials-component-18";
import { TrustindexTestimonialsSection } from "@/components/custom/trustindex-testimonials-section";
import AboutUs from "@/components/shadcn-studio/blocks/about-us-section/about-us-section";
import { stats } from "@/constants";
import { MotionWrapper } from "@/components/custom/motion-wrapper";
import { HowItWorks } from "@/components/custom/how-it-works";
import { testimonials as rawTestimonials } from "@/constants/testimonials";

export default function AboutPage() {
  // Map testimonials data for the component
  const mappedTestimonials: TestimonialItem[] = rawTestimonials.map((t) => ({
    name: t.name,
    role: t.location || "Verified Customer",
    company: "Hello Water",
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${t.name}&backgroundColor=00a3ff,0055ff,00d4ff&fontFamily=Inter,sans-serif`,
    rating: 5,
    content: t.quote,
  }));

  return (
    <div className="relative overflow-hidden w-full min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:py-16 sm:px-6 lg:px-8">
        <MotionWrapper
          className="mb-8 max-w-7xl space-y-4"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
          initial="hidden"
          whileInView="visible"
        >
          <MotionWrapper
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
              About Us
            </h1>
          </MotionWrapper>
          <MotionWrapper
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            <p className="text-justify text-muted-foreground sm:text-lg">
              At Hello Water Filtration®, we believe the water in your home should be as clean & safe and tasty as it looks, because what you can’t see matters most.
              <br />
              <br />
              Featuring worlds leading Pentair™ premium Water filtration Cartridges, media and other components, the system independently certified by  NSF International Standard 42 for material safety and integrity, Australian Water Quality Centre AS/NZS 4020 for Drinking Water Product Testing Standards, Watermark Certification, & the Australian Asthma Council Certification for Sensitive Choice, it is the most certified system currently available in Australian Market.
              We specialise in whole-home water filtration systems that remove chlorine, chloramine, heavy metals, & everyday contaminants in the drinking water as a result of environment pollution, delivering better water from every tap, shower, and your hot water system. From your morning shower to the glass you drink at night, we’re here to improve the quality of water you use every single day.
              </p>
          </MotionWrapper>
        </MotionWrapper>

        <AboutUs stats={stats} />
      </section>

      <HowItWorks />

      <TestimonialsComponent testimonials={mappedTestimonials} />

      <TrustindexTestimonialsSection />
    </div>
  );
}
