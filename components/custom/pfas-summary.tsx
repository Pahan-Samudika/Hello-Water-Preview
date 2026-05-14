"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";

const PFASModel = dynamic(
  () => import("./pfas-model").then((mod) => mod.PFASModel),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[300px] w-full items-center justify-center rounded-3xl bg-muted/30">
        <span className="sr-only">Loading PFAS model</span>
      </div>
    ),
  }
);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export const PFASSummary = () => {
  return (
    <section className="relative w-full overflow-hidden px-6 pt-8 pb-20 sm:px-6 sm:pt-12 sm:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 px-2 text-center sm:px-4 lg:text-left">

          <motion.div
            className="grid w-full grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex flex-col space-y-6">
              <motion.div variants={fadeUp} className="space-y-4">
                <div className="inline-block rounded-lg bg-red-500/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-red-500 border border-red-500/20 w-fit mx-auto lg:mx-0">
                  What are PFAS?
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.1]">
                  The  {" "}
                  <span className="bg-linear-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                    Hidden Threat
                  </span>
                  {" "} in Your Water
                </h2>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg text-center lg:text-left"
              >
                <p className="text-justify">
                  PFAS (per- & polyfluoroalkyl substances) are known “forever chemicals” hiding in
                  everyday products; from non-stick cookware to food packaging, fire retardant forms &
                  waterproof fabrics. They seep into the environment through residential & industrial
                  waste, landfills & as leachate, eventually making their way into your drinking water. You
                  can’t see them, taste them, or smell them; but they can stay in your water & your body
                  for years.
                </p>

                <p className="text-justify">
                  Linked to immune system effects, hormonal disruption, high cholesterol & certain
                  cancers, PFAS are drawing growing global concern. The risk isn’t always immediate -but
                  it builds over time, making what you don’t see increasingly hard to ignore. Our 3-stage
                  filtration system with modified coconut granular activated carbon & redox technology
                  can reduce PFAS significantly.
                </p>

                <p className="text-justify">
                  The Gen 3 Hello Water Filtration System features the advanced EnnoPure EpureFlo ACF
                  (Activated Carbon Fibre) cartridge, engineered specifically for superior chemical
                  filtration performance. Using proprietary activated carbon fibre technology, the E
                  pureFlo cartridge can reduce up to 99.99% of PFAS contaminants while also targeting
                  other harmful chemicals commonly found in drinking water
                </p>
              </motion.div>
            </div>

            {/* 3. Model (Right on Desktop, Bottom on Mobile) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-full mx-auto"
            >
              <div className="relative aspect-video sm:aspect-video lg:aspect-square w-full">
                <PFASModel />
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-medium tracking-wider uppercase text-muted-foreground/80 px-4 w-full">
                  <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-[#404040]" /> Carbon</div>
                  <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-[#a3e635]" /> Fluorine</div>
                  <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-[#fbbf24]" /> Sulfur</div>
                  <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-[#ef4444]" /> Oxygen</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
