"use client";

import { ChevronDown, HelpCircle, MessageCircle, PhoneCall, Wrench, Settings, CreditCard, ShieldCheck, Waves, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { faqPageJsonLd } from "@/lib/structured-data";
import { MotionWrapper } from "@/components/custom/motion-wrapper";

const faqCategories = [
  {
    title: "Product & Benefits",
    icon: Waves,
    items: [
      {
        question: "What is a whole-home water filtration system?",
        answer: "A whole-home filtration system treats water at the point it enters your property, meaning every tap, shower, & appliance receives filtered water, not just your kitchen sink."
      },
      {
        question: "How is Hello Water Filtration different from other filtration systems in the market?",
        answer: "Our systems are carefully designed and engineered using premium components from leading global industry partners, including Pentair® — a world-renowned USA based water treatment company with more than 75 years of expertise in water filtration technology. We also incorporate advanced filtration innovations from EnnoPure, a Stanford University originated technology company now recognised as a leader in the Greater China water purification industry. Together, these technologies bring cutting-edge material science and proven filtration performance into every system we deliver.\n\nWe use highly certified filtration media engineered for performance, durability, & longer service life compared to standard systems in the market.\n\nAll systems undergo rigorous independent testing, making them among the most comprehensively third-party certified water filtration systems available across Australia and New Zealand. These certifications reinforce their reliability, safety, performance, and compliance with recognised international water quality standards.\n\nOverall, Hello Water stands apart through its combination of proven engineering from Pentair, advanced innovation from EnnoPure, & independently verified performance standards."
      },
      {
        question: "Will I still need to buy bottled water?",
        answer: "No. Most customers find the whole-home system provides excellent water quality throughout the house & so there’s no need to purchase bottled water."
      },
      {
        question: "Does your system remove chlorine & chloramine?",
        answer: "Yes. Our Catalytic Grannular carbon filtration, KDF media and ACF Cartridges removes 99.99% of chlorine & chloramine."
      },
      {
        question: "What about fluoride?",
        answer: "Yes. Our 5-level, 3-stage system removes fluoride using KDF -F media"
      },
      {
        question: "Does the system reduce hard water?",
        answer: "No, the system is not a water softener, however the KDF 55 Media reduces Calcium & Magnesium, preventing limescale build up & acts as an anti scaling filter."
      },
      {
        question: "Does it remove heavy metals?",
        answer: "Yes. Our system includes advanced filtration media designed to completely remove heavy metals that are commonly found in municipal water supplies."
      },
      {
        question: "Does this remove bacteria and viruses?",
        answer: "No — in general, municipally treated water supplies are already disinfected through chlorination and are typically free from harmful bacteria and viruses. Our systems are primarily designed to reduce chemicals, heavy metals, PFAS, sediment, and other common water contaminants.\n\nHowever, the patented KDF media technology used in our systems provides bacteriostatic properties, helping to inhibit the growth of bacteria within the filtration media itself.\n\nFor rainwater, bore water, or other untreated water sources where microbiological contamination may be present, we recommend adding our UV purification system for comprehensive protection against bacteria, viruses, and other microorganisms."
      },
      {
        question: "Will I notice a difference immediately?",
        answer: "Yes. Most customers notice an immediate improvement in water quality after installation, including cleaner, better-tasting water, softer skin, healthier-looking hair, and a significant reduction in chlorine taste and odour throughout the home."
      },
      {
        question: "Does it help protect appliances?",
        answer: "Yes. By reducing sediment & hardness minerals, the system helps extend the life of dishwashers, washing machines, & hot water systems."
      },
      {
        question: "Will the water pressure drop?",
        answer: "No. Our high-flow design is built to maintain strong water pressure throughout your home."
      },
      {
        question: "What is the Hello Water Filtration system for larger homes & semi commercial properties?",
        answer: "The system is a high-performance whole-home filtration setup designed for larger homes & semi-commercial properties, delivering up to 119 litres per minute flow rate. It uses upgraded filtration media including DGD sediment filtration & EnnoPure ePureFlo Activated Carbon Fibre (ACF) technology."
      },
      {
        question: "How is it different from the standard system?",
        answer: "The Standard system is designed for typical residential homes, offering balanced whole-home filtration through sediment, carbon, & ion-exchange softening for everyday water quality improvement. The Advanced system is built for higher demand homes & semi-commercial use, enhanced sediment filtration using DGD gradient density cartridges, & EnnoPure ePureFlo ACF carbon technology that reduces chlorine taste & odour up to 2x more effectively than standard cartridges."
      },
      {
        question: "Does it improve water quality more than the standard system?",
        answer: "Yes. It provides stronger sediment removal, improved chlorine taste & odour reduction, & higher flow performance for larger households."
      }
    ]
  },
  {
    title: "Installation",
    icon: Wrench,
    items: [
      {
        question: "How long does installation take?",
        answer: "2-3 hours."
      },
      {
        question: "Where is the system installed?",
        answer: "The system is installed externally at the main water line entry point, side-wall water connection or in proximity to the water meter, ensuring whole house coverage."
      },
      {
        question: "Will this system work with any home?",
        answer: "Yes. Our systems are compatible with most residential properties. We’ll assess your setup before installation to ensure the best fit."
      },
      {
        question: "Do you offer free water testing?",
        answer: "Yes. We provide in-home water assessments to determine the best filtration solution for your needs."
      }
    ]
  },
  {
    title: "Maintenance & Service",
    icon: Settings,
    items: [
      {
        question: "How often do filters need replacing?",
        answer: "Filter replacement typically occurs every 12 to 14 months, depending on water usage & local water quality."
      },
      {
        question: "What happens if I forget to change the filters?",
        answer: "You don’t have to worry; we track your service schedule & contact you when it’s time for a replacement."
      },
      {
        question: "Do you offer servicing?",
        answer: "Yes. We offer ongoing servicing & maintenance to ensure optimal performance year after year."
      },
      {
        question: "Is there a subscription or ongoing contract?",
        answer: "No lock-in contracts. We simply remind you when your service is due; you stay in control."
      }
    ]
  },
  {
    title: "Cost & Warranty",
    icon: CreditCard,
    items: [
      {
        question: "How much do replacement cartridges cost?",
        answer: "Individually they cost $49 for the 1st stage, $95 for the 2nd stage & $135 for the 3rd stage cartridge. You can also purchase all three cartridges together for a total of $279."
      },
      {
        question: "How much does a whole-home system cost?",
        answer: "Price is determined by multiple factors including but not limited to, the number of bathrooms in the house. For an exact quote, contact us & we’ll be able to determine exactly how much it’ll cost you."
      },
      {
        question: "Is there a warranty?",
        answer: "Yes. Our systems come with a 12 month manufacturer warranty on the system for peace of mind."
      },
      {
        question: "Is financing available?",
        answer: "Yes. Contact us to discuss flexible payment options."
      }
    ]
  },
  {
    title: "About Hello Water",
    icon: ShieldCheck,
    items: [
      {
        question: "What makes your system different from cheaper filters?",
        answer: "Unlike basic systems, we use a multi-stage filtration process with high-capacity Pentair® cartridges, professional installation, & ongoing service support; not just a DIY filter."
      },
      {
        question: "Are you an Australian company?",
        answer: "Yes. Hello Water is an Australian owned company & proudly services Australian households. We understand local water conditions better than most."
      },
      {
        question: "How do I get a quote?",
        answer: "Simply reach out to us through our dedicated contact us page, E-mail, WhatsApp, Facebook, Instagram or call our team to book your free consultation."
      }
    ]
  }
];

export default function FAQPage() {
  const faqJsonLd = faqPageJsonLd(faqCategories);

  return (
    <main className="relative overflow-hidden w-full min-h-screen">
      <JsonLd data={faqJsonLd} />
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:py-16 sm:px-6 lg:px-8">
        <MotionWrapper
          className="mb-12 space-y-4"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <MotionWrapper
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
            }}
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
              Frequently Asked Questions
            </h1>
          </MotionWrapper>
          <MotionWrapper
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
            }}
          >
            <p className="text-muted-foreground sm:text-lg">
              Everything you need to know about Hello Water Filtration. If you cannot find your answer here, reach out to our team.
            </p>
          </MotionWrapper>
        </MotionWrapper>

        <div className="space-y-16">
          {faqCategories.map((category, catIndex) => (
            <MotionWrapper
              key={category.title}
              id={category.title === "Product & Benefits" ? "benefits" : undefined}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="space-y-6"
            >
              <MotionWrapper
                className="flex items-center gap-4 pb-3 border-b border-border/50"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
                }}
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-white/40 backdrop-blur-sm">
                  <category.icon className="size-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">{category.title}</h2>
              </MotionWrapper>

              <div className="grid gap-4">
                {category.items.map((item, itemIndex) => {
                  const id = `${catIndex}-${itemIndex}`;

                  return (
                    <MotionWrapper
                      key={id}
                      variants={{
                        hidden: { opacity: 0, y: 20, scale: 0.98 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
                        },
                      }}
                    >
                      <details
                        className="group rounded-3xl border border-white/35 bg-white/35 shadow-sm backdrop-blur-md transition-all duration-300 open:border-primary/40 open:bg-white/40 open:shadow-xl open:shadow-primary/5 dark:border-white/10 dark:bg-white/5 dark:open:border-primary/20 dark:open:bg-white/10"
                      >
                        <summary className="flex w-full cursor-pointer list-none items-center justify-between px-6 py-5 text-left focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
                          <span className="pr-8 text-base font-semibold text-foreground transition-colors group-hover:text-primary/70 group-open:text-primary md:text-lg">
                            {item.question}
                          </span>
                          <span className="flex-shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors group-hover:text-primary/50 group-open:bg-primary/20 group-open:text-primary">
                            <ChevronDown className="size-5 transition-transform duration-300 group-open:rotate-180" />
                          </span>
                        </summary>

                        <div
                          id={`faq-answer-${id}`}
                          className="px-6 pb-6 leading-relaxed text-sm md:text-base"
                        >
                          <div className="h-px w-full bg-linear-to-r from-primary/30 via-transparent to-transparent mb-4" />
                          <p className="whitespace-pre-line">{item.answer}</p>
                        </div>
                      </details>
                    </MotionWrapper>
                  );
                })}
              </div>
            </MotionWrapper>
          ))}
        </div>

        {/* Contact CTA */}
        <MotionWrapper
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-24 p-8 md:p-12 rounded-[2.5rem] border border-white/40 bg-white/20 backdrop-blur-2xl text-center relative overflow-hidden dark:border-white/10 dark:bg-white/5"
        >
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-6 shadow-inner ring-1 ring-white/50">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Cannot find the answer you are looking for?</h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Our water specialists are here to provide expert advice tailored to your home&apos;s unique needs. Reach out to us directly for a personalized solution
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:1300515469"
              className="inline-flex w-full sm:w-auto h-14 items-center justify-center rounded-full bg-primary px-10 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
            >
              <PhoneCall className="w-5 h-5 mr-2" />
              1300 515 469
            </a>
            <Link
              href="/contact"
              className="group relative inline-flex w-full sm:w-auto h-14 items-center justify-center overflow-hidden rounded-full px-10 text-lg font-bold border border-white/40 bg-white/10 backdrop-blur-sm hover:bg-white/20 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Us
              <ArrowRightIcon className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </MotionWrapper>
      </section>
    </main>
  );
}
