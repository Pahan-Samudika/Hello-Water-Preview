"use client";
import { MotionWrapper } from "@/components/custom/motion-wrapper";
import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/utils";

const technologyFeatures = [
  {
    title: "Dual Gradient Density pre-filter",
    description: "Built with precision 0.5-micron sediment filtration, this stage features thermally bonded spun fibres that create a precise gradient structure, capturing larger particles on the outer layers while trapping finer sediment deep within the core. this stage aggressively captures dirt, rust, sand, & microscopic debris before they ever reach your water supply. It takes the hit early, protecting the system, preserving performance, & setting the standard for everything that follows.",
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1776256571/fhjrugybaxuadqaqan1c_jsz9rb.webp",
  },
  {
    title: "Granular Activated Carbon Filtration Process",
    description: "It uses Patented RFC Radial Flow Catalytic Granular Activated Carbon (GAC), designed with a highly porous, catalytic surface that enhances adsorption & actively breaks down chemical contaminants at a molecular level. The innovative radial flow design maximises contact time while maintaining a low pressure drop, ensuring efficient performance without restricting flow. This stage effectively reduces chlorine, chloramine, PFAS, VOCs, pesticides, & other organic impurities, dramatically improving taste & odour while delivering consistently cleaner water throughout your home.",
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1776256575/rhscv0npefktv2aofpok_jzett2.webp",
  },
  {
    title: "KDF 55 Filtration Media & Redox Purification",
    description: "This patented, high-purity copper-zinc media purifies water through an advanced redox (oxidation–reduction) reaction, actively targeting & reducing a wide spectrum of contaminants -including bacteria, algae, fungi, iron, heavy metals like lead, mercury, nickel, chromium, & even gases such as hydrogen sulfide. Instead of simply trapping impurities, KDF-55 works at a molecular level, using electron transfer to neutralise & transform contaminants in real time.",
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1776257159/IMG_7583_ylrtzu_ikleg8.webp",
  },
  {
    title: "UV Radiation Micro Filtration System (For Mains & Rainwater Applications)",
    description: "Our UV Radiation Micro Filtration System provides an advanced layer of protection, targeting & neutralising pathogenic micro-organisms carried in water, including viruses, protozoa, & bacteria. Certified to achieve up to 99.9999% (6-log) reduction, it ensures consistently safe, high-quality water throughout your home.",
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1776257295/181640_uxpxjl.webp",
  },
  {
    title: "Environmental Responsibility",
    description: "Our systems are designed with environmental responsibility in mind, reducing reliance on bottled water & single-use plastics while promoting sustainable water use at home. By improving water quality at the source, we help minimise waste, lower plastic pollution, & support a more eco-conscious lifestyle without compromising on purity or performance.",
    image: "https://res.cloudinary.com/dnlb02zp9/image/upload/v1776257140/181405_n4hnfi.webp",
  },
];

export default function BenefitsPage() {
  return (
    <div className="relative overflow-hidden w-full min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:py-16 sm:px-6 lg:px-8">
        <MotionWrapper
          className="mb-16 space-y-4"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          <MotionWrapper
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
            }}
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
              Our Technology
            </h1>
          </MotionWrapper>
          <MotionWrapper
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
            }}
          >
            <p className="text-muted-foreground sm:text-lg text-justify">
              At Hello Water Filtration®, we don’t just filter water, we transform it. Using cutting-edge
              purification technology, our systems are engineered to deliver cleaner, safer, better-tasting
              water at every tap. Every component is designed to perform at the highest standard, so you
              can trust what flows through your home.
            </p>
          </MotionWrapper>
        </MotionWrapper>

        <section className="relative mt-20 md:mt-32">
          <div className="text-center mb-16 md:mb-24">
            <MotionWrapper
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-primary bg-primary/10 rounded-lg border border-primary/20">
                Innovation
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
                Here’s What Makes Us {" "}
                <span className="bg-gradient-to-r from-primary via-sky-500 to-cyan-400 bg-clip-text text-transparent">
                  Different
                </span>
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
                Discover the engineering and thought process behind our advanced 5-level, 3-stage filtration ecosystem.
              </p>
            </MotionWrapper>
          </div>

          <div className="space-y-12 md:space-y-12 relative pb-12 mt-12">
            {technologyFeatures.map((feature, index) => {
              const isEven = index % 2 === 0;
              return (
                <MotionWrapper
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className={cn(
                    "flex flex-col items-center group relative",
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  )}
                >
                  {/* Image Section */}
                  <div className="w-full md:w-7/12 relative">
                    <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-border/20 group/img">
                      <SmartImage
                        src={feature.image}
                        alt={feature.title}
                        className="object-cover transition-transform duration-[2s] ease-out group-hover/img:scale-105"
                        containerClassName="absolute inset-0 w-full h-full"
                      />
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/img:opacity-100 transition-opacity duration-700 mix-blend-overlay pointer-events-none" />
                    </div>
                  </div>

                  {/* Text Section (Overlapping) */}
                  <div className={cn(
                    "w-[90%] md:w-6/12 relative z-10 -mt-16 md:mt-0",
                    isEven ? "md:-ml-16 lg:-ml-24" : "md:-mr-16 lg:-mr-24"
                  )}>
                    <div className="bg-background/80 dark:bg-background/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 lg:p-14 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/40 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 transition-transform duration-700 ease-out group-hover:-translate-y-2 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                      
                      <div className="relative z-10">
                        <div className="inline-flex h-1.5 w-12 bg-primary rounded-full mb-6 transition-all duration-500 group-hover:w-20" />
                        
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-[1.15] mb-6 drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)] dark:drop-shadow-sm">
                          {feature.title}
                        </h3>
                        
                        <p className="text-foreground/90 text-justify drop-shadow-[0_1px_5px_rgba(255,255,255,0.4)] dark:drop-shadow-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </MotionWrapper>
              );
            })}
          </div>
        </section>
      </section>
    </div>
  );
}
