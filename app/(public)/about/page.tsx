import { TestimonialsSection } from "@/components/custom/testimonials-section";
import AboutUs from "@/components/shadcn-studio/blocks/about-us-section/about-us-section";
import { stats } from "@/constants";

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-7xl space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About Us</h1>
        <p className="text-muted-foreground">
          Welcome to Hello Water, where our passion for pure, clean water
            meets our commitment to enhancing lives. With over two decades of
            experience in the residential, commercial, and industrial water
            purification industry, Hello Water stands as a trusted name in
            delivering innovative solutions that redefine the way you experience
            water.
        </p>
      </div>

      <AboutUs stats={stats} />

      

      <TestimonialsSection />
    </section>
  );
}
