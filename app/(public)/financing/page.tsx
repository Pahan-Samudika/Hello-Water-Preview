"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { MotionWrapper } from "@/components/custom/motion-wrapper";
import { CheckCircle2, Globe, ArrowRightIcon, Laptop, Calculator, CreditCard, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactCTA } from "@/components/custom/contact-cta";

import { paymentOptions, howItWorksData, financingDisclaimers } from "@/constants/financing";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.05,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function RepaymentOptionsPage() {
  return (
    <main className="relative overflow-hidden w-full min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-0 sm:px-6 lg:px-8">
        <MotionWrapper
            className="mb-8 space-y-4"
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
                Zero Interest Repayment Options
              </h1>
            </MotionWrapper>
            <MotionWrapper
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
              }}
            >
              <p className="text-muted-foreground sm:text-lg text-justify">
                Enjoy better water throughout your home now, with flexible ways to pay over time.
                Choose the repayment option that works best for you and your family's budget.
              </p>
            </MotionWrapper>
          </MotionWrapper>
      </section>

      {/* Options Grid Section */}
      <section className="mx-auto w-full max-w-6xl px-6 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {paymentOptions.map((option) => (
            <motion.div key={option.id} variants={cardVariant} className="h-full">
              <article className={`group h-full flex flex-col rounded-[2rem] border-2 bg-card overflow-hidden shadow-2xl transition-all duration-300 relative ${option.cardClasses}`}>
                {/* Vibrant Top Gradient */}
                <div className={`absolute top-0 left-0 right-0 h-64 bg-gradient-to-b to-transparent pointer-events-none ${option.gradientClasses}`} />

                <div className="p-8 pb-0 relative z-10">
                  <div className="flex mb-8">
                    <div className="bg-white rounded-xl px-5 py-3 shadow-sm flex items-center justify-center">
                      <Image
                        src={option.logoSrc}
                        alt={option.logoAlt}
                        width={140}
                        height={45}
                        className="h-8 w-auto object-contain"
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className={`text-sm font-bold tracking-widest mb-2 uppercase ${option.textColor}`}>UP TO</p>
                    <div className="flex items-center gap-3">
                      <span className="text-6xl font-extrabold tracking-tight text-foreground leading-none drop-shadow-sm">{option.months}</span>
                      <div className="flex flex-col justify-center">
                        <span className="block text-xl font-bold text-foreground leading-tight tracking-wide">MONTHS</span>
                        <span className={`block text-xs font-semibold mt-0.5 tracking-wider ${option.textColor}`}>INTEREST FREE*</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {option.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-foreground text-sm font-medium">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 drop-shadow-sm ${option.textColor}`} />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto p-8 pt-0 relative z-10">
                  <div className={`rounded-2xl p-6 border shadow-inner ${option.pricingBg} ${option.pricingBorder}`}>
                    <div className={`text-sm text-foreground divide-y ${option.pricingDivide}`}>
                      {option.pricingItems.map((item, index) => (
                        <div key={index} className={`flex flex-row justify-between items-center gap-4 ${index === 0 ? "pb-3" : index === option.pricingItems.length - 1 ? "pt-3" : "py-3"}`}>
                          <span className={`font-bold shrink-0 ${item.isLargeLabel ? "text-lg" : ""}`}>{item.label}</span>
                          <span className="text-muted-foreground text-right max-w-[180px] leading-tight">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it Works Section - Timeline Style */}
      <section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-4 space-y-4 flex flex-col items-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp}>
            <span className="inline-block px-4 py-1.5 text-sm font-semibold tracking-wider text-primary bg-primary/10 rounded-lg border border-primary/20">
              Simple Process
            </span>
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6"
            variants={fadeUp}
          >
            How It Works
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground"
            variants={fadeUp}
          >
            A simple and seamless process to get your new Hello Water filtration system installed with flexible repayment options.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {howItWorksData.map((item, index) => (
            <motion.div key={item.timeframe} variants={cardVariant} className="h-full">
              <article className="group relative h-full flex flex-col p-8 rounded-3xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md shadow-2xl overflow-hidden transition-all duration-300 hover:border-white/20">
                {/* Large Background Number */}
                <div className="absolute -bottom-8 -right-4 text-[14rem] font-black leading-none text-white/[0.03] select-none pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:text-white/[0.05]">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1 flex flex-col text-left">
                  <h3 className="text-xl font-bold tracking-tight text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              </article>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-16 sm:px-6 lg:px-8">
        <ContactCTA
          title="Ready to get started?"
          description="Talk to our team about the repayment option available for your system and find the best fit for your home."
        />
      </section>
      {/* Disclaimers Section */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="text-[10px] sm:text-xs text-muted-foreground/60 space-y-4 text-justify leading-relaxed transition-opacity hover:text-muted-foreground">
          {financingDisclaimers.map((disclaimer, index) => (
            <p key={index}>{disclaimer}</p>
          ))}
        </div>
      </section>
    </main>
  );
}
