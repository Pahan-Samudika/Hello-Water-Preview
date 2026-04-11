"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  DropletsIcon,
  FilterIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { SmartImage } from "@/components/ui/smart-image";

const HIGHLIGHTS = [
  {
    icon: ShieldCheckIcon,
    title: "Certified Systems",
    description: "NSF & Watermark certified for your peace of mind.",
  },
  {
    icon: FilterIcon,
    title: "Complete Filtration",
    description: "Removes chlorine, heavy metals & contaminants.",
  },
  {
    icon: DropletsIcon,
    title: "Tailored Solutions",
    description: "Systems designed for your specific home needs.",
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

export const AboutSummary = () => {
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
							Our Story
						</div>
            </motion.div>
            <motion.div className="space-y-4" variants={fadeUp}>
              <h2 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
                The Hello Water{" "}
                <span className="bg-linear-to-r from-primary via-sky-500 to-cyan-400 bg-clip-text text-transparent">
                  Difference
                </span>
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                At Hello Water Filtration, we provide honest advice and
                professional installation for whole-home water filtration
                systems. We believe every home deserves clean, safe water from
                every tap.
              </p>
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            className="grid w-full grid-cols-1 gap-8 sm:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {HIGHLIGHTS.map((item, idx) => (
              <motion.div
                key={idx}
                variants={cardVariant}
                className="flex flex-col items-center gap-3 rounded-3xl border border-white/35 bg-white/35 px-6 py-7 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-white/40">
                  <item.icon className="size-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
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
              render={<Link href="/about-us" />}
              nativeButton={false}
            >
              Learn More About Us
              <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          </motion.div>

          {/* Image */}
          <motion.div
            className="relative w-full"
            variants={imageVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <SmartImage
              src="https://res.cloudinary.com/dnlb02zp9/image/upload/v1774936885/IMG_5179.JPG_hkxhpw.jpg"
              alt="About us illustration"
              className="w-full rounded-[1.75rem] border border-white/30 object-cover shadow-[0_20px_60px_rgba(15,23,42,0.14)]"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
