import { TestimonialsSection } from "@/components/custom/testimonials-section";
import AboutUs from "@/components/shadcn-studio/blocks/about-us-section/about-us-section";
import { stats } from "@/constants";

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-7xl space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About Us</h1>
        <p className="text-justify text-muted-foreground">
          At Hello Water Filtration®, we believe the water in your home should be as clean & safe as it looks, because what you can’t see matters most.
          <br/>
          Featuring premium third-party certifications, including NSF International Standard 42, Australian Water Quality Centre AS/NZS 4020 for Drinking Water Product Testing Standards, Watermark Certification, & the Asthma Council Certification for Sensitive Choice, it is the most certified system currently available. 
          We specialise in whole-home water filtration systems that remove chlorine, chloramine, heavy metals, & everyday contaminants, delivering better water from every tap. From your morning shower to the glass you drink at night, we’re here to improve the quality of water you use every single day.
          <br/>
          Our approach is simple: Honest advice, tailored solutions, & a professional installation you can rely on. Because when your water is better, your home -& your health- are too.
        </p>
      </div>

      <AboutUs stats={stats} />

      

      <TestimonialsSection />
    </section>
  );
}
