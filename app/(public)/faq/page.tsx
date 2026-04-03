"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle, PhoneCall, Wrench, Settings, CreditCard, ShieldCheck, Waves, ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
        question: "How is Hello Water Filtration different from standard hardware store filters?",
        answer: "Unlike basic cartridge systems, Hello Water Filtration uses a multi-stage filtration process including sediment removal, advanced carbon filtration, heavy metal reduction media, & ion-exchange softening. This ensures comprehensive protection, not just chlorine & chloramine removal."
      },
      {
        question: "Will I still need to buy bottled water?",
        answer: "No. Most customers find the whole-home system provides excellent water quality throughout the house & so there’s no need to purchase bottled water."
      },
      {
        question: "Does your system remove fluoride, chlorine & chloramine?",
        answer: "Yes. Our carbon filtration stage significantly reduces fluoride, chlorine & chloramine, which improves taste, smell, & reduces skin & hair dryness and hair fall. Overall improving your health."
      },
      {
        question: "Does the system reduce hard water?",
        answer: "Yes. Our ion-exchange technology helps reduce hardness minerals like calcium & magnesium, preventing limescale buildup."
      },
      {
        question: "Does it remove heavy metals?",
        answer: "Yes. Our system includes advanced filtration media designed to completely remove heavy metals that are commonly found in municipal water supplies."
      },
      {
        question: "Does this remove bacteria & viruses?",
        answer: "Our 3-stage filtration system can reduce certain microorganisms to a degree through fine filtration & redox reactions. However, for complete protection against bacteria & viruses, we recommend adding our UV purification system."
      },
      {
        question: "Will I notice a difference immediately?",
        answer: "Yes. Most customers report softer skin, healthier hair, better-tasting water, & reduced chlorine smell immediately after installation."
      },
      {
        question: "Does it help protect appliances?",
        answer: "Yes. By reducing sediment & hardness minerals, the system helps extend the life of dishwashers, washing machines, & hot water systems."
      },
      {
        question: "Will the water pressure drop?",
        answer: "No. Our high-flow design is built to maintain strong water pressure throughout your home."
      }
    ]
  },
  {
    title: "Installation",
    icon: Wrench,
    items: [
      {
        question: "How long does installation take?",
        answer: "Most installations are completed within a few hours by licensed professionals."
      },
      {
        question: "Where is the system installed?",
        answer: "The system is installed externally at the main water line entry point, ensuring whole house coverage."
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
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="relative overflow-hidden w-full min-h-screen">
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
              Everything you need to know about Hello Water Filtration. If you can't find your answer here, reach out to our team.
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
                  const isOpen = activeId === id;

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
                      <div
                        className={cn(
                          "group rounded-3xl border transition-all duration-300",
                          isOpen 
                            ? "border-primary/40 bg-white/40 shadow-xl shadow-primary/5 backdrop-blur-xl dark:border-primary/20 dark:bg-white/10" 
                            : "border-white/35 bg-white/35 hover:border-primary/30 hover:bg-white/50 backdrop-blur-md shadow-sm dark:border-white/10 dark:bg-white/5"
                        )}
                      >
                        <button
                          onClick={() => toggleAccordion(id)}
                          className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                        >
                          <span className={cn(
                            "text-base md:text-lg font-semibold transition-colors pr-8",
                            isOpen ? "text-accent" : "text-foreground group-hover:text-primary/70"
                          )}>
                            {item.question}
                          </span>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className={cn(
                              "flex-shrink-0 p-1.5 rounded-full",
                              isOpen ? "bg-primary/20 text-primary" : "text-muted-foreground group-hover:text-primary/50"
                            )}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </motion.div>
                        </button>
                        
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 leading-relaxed text-sm md:text-base">
                                <div className="h-px w-full bg-linear-to-r from-primary/30 via-transparent to-transparent mb-4" />
                                {item.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
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
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/10 blur-[100px] -z-10" />
          <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-sky-400/10 blur-[100px] -z-10" />
          
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-6 shadow-inner ring-1 ring-white/50">
             <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Can't find the answer you're looking for?</h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Our water specialists are here to provide expert advice tailored to your home's unique needs. Reach out to us directly for a personalized solution
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 rounded-full bg-primary px-10 text-lg font-bold shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
              render={<a href="tel:0498588725" />}
              nativeButton={false}
            >
              <PhoneCall className="w-5 h-5 mr-2" />
              0498 588 725
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group relative w-full sm:w-auto h-14 overflow-hidden rounded-full px-10 text-lg font-bold border-white/40 bg-white/10 backdrop-blur-sm hover:bg-white/20 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10"
              render={<Link href="/contact" />}
              nativeButton={false}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Us
              <ArrowRightIcon className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </MotionWrapper>
      </section>
    </div>
  );
}
