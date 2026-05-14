"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  CpuIcon,
  FilterIcon,
  LayersIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { SmartImage } from "@/components/ui/smart-image";

const HIGHLIGHTS = [
  {
    icon: LayersIcon,
    title: "Multi-stage Ecosystem",
    description: "A multi-stage defense aggressively capturing dirt, chemicals, & impurities before they enter your home.",
  },
  {
    icon: FilterIcon,
    title: "3-Stage Filtration",
    description: "Advanced media precisely targeting & stripping out chlorine, heavy metals, & complex contaminants.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Targeting PFAS",
    description: "High-performance coconut-shell catalytic carbon and EnnoPure ePureFlo ACF technology engineered to reduce hazardous PFAS and contaminants by up to 99.99%.",
  },
  {
    icon: CpuIcon,
    title: "Cutting-Edge Purification",
    description: "Leveraging Pentair Diamond Flow, Gradient Density, and patented KDF technology to eliminate sediment, heavy metals, and odors while maintaining peak water pressure.",
  },
];

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

const imageVariant = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export const TechnologySummary = () => {
  return (
    <section className="relative overflow-hidden px-6 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 px-2 py-4 text-center sm:px-4 sm:py-6">

          {/* Header */}
          <motion.div
            className="flex flex-col gap-4 text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div className="flex justify-center" variants={fadeUp}>
              <div className="rounded-lg bg-primary/10 text-primary border-primary/20 border px-4 py-1.5 font-semibold text-sm tracking-wide">
                Our Technology
              </div>
            </motion.div>
            <motion.div className="space-y-4" variants={fadeUp}>
              <h2 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
                Engineered to {" "}
                <span className="bg-linear-to-r from-primary via-sky-500 to-cyan-400 bg-clip-text text-transparent">
                  Eliminate
                </span>
                {" "} Forever Chemicals
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground mx-auto">
                Protecting your home begins with ensuring your water is truly safe. Our advanced 5-level, 3-stage
                whole-home filtration system acts as a powerful barrier against unwanted contaminants throughout
                your entire property. Engineered to reduce municipally added chemicals like chlorine and
                chloramines, harmful PFAS “forever chemicals”, heavy metals including lead, and everyday
                pollutants such as micro plastics from environmental pollution it delivers cleaner, healthier water you
                can trust — giving your family complete peace of mind at every tap.
              </p>
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {HIGHLIGHTS.map((item, idx) => (
              <motion.div
                key={idx}
                variants={cardVariant}
                className="group relative h-full rounded-[2rem] bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-white/5 border border-white/50 dark:border-white/10 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className="relative z-10 flex flex-col items-start gap-5">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-white dark:bg-black/50 text-foreground shadow-md ring-1 ring-black/5 dark:ring-white/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:scale-110">
                    <item.icon className="size-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Number Watermark offset at bottom corner */}
                <div className="absolute -bottom-6 -right-4 text-[10rem] font-black text-black/5 dark:text-white/5 group-hover:scale-110 transition-transform duration-700 ease-out pointer-events-none select-none">
                  {idx + 1}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="pt-2"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <Button
              size="lg"
              className="group relative w-fit overflow-hidden rounded-full px-10 text-base before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] dark:before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)]"
              render={<Link href="/technology" />}
              nativeButton={false}
            >
              Discover Our Technology
              <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
