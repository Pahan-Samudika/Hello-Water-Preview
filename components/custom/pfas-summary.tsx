"use client";

import React from "react";
import { motion } from "motion/react";
import { PFASModel } from "./pfas-model";

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
    <section className="relative w-full overflow-hidden px-6 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 px-2 py-4 text-center sm:px-4 sm:py-6">
          
          <motion.div
            className="space-y-8 text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="space-y-4">
              <div className="inline-block rounded-lg bg-red-500/10 px-3 py-1 text-xs font-bold tracking-widest text-red-500 border border-red-500/20 uppercase">
                Critical Concern
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.1]">
                What are PFAS?{" "}
                <span className="bg-linear-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  The hidden threat in your water
                </span>
              </h2>
            </motion.div>

            <motion.div 
              variants={fadeUp} 
              className="space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg text-justify"
            >
              <p>
                PFAS (per- & polyfluoroalkyl substances) are known “forever chemicals” hiding in everyday products; 
                from non-stick cookware to food packaging, fire retardant forms & waterproof fabrics. 
                They seep into the environment through residential and industrial waste, landfills and as leachate, 
                eventually making their way into your drinking water. You can’t see them, taste them, or smell them; 
                but they can stay in your water & your body for years.
              </p>
              
              <p>
                Linked to immune system effects, hormonal disruption, high cholesterol & certain cancers, 
                PFAS are drawing growing global concern. The risk isn’t always immediate -but it builds over time, 
                making what you don’t see increasingly hard to ignore. Our 3-stage filtration system with 
                modified coconut granular activated carbon & redox technology can reduce PFAS significantly. 
                Providing clean drinking water, devoid of any harmful chemicals.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="pt-4 flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
                   <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-sm font-semibold">99% PFAS Reduction</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
                   <div className="size-2 rounded-full bg-blue-500 animate-pulse" />
                   <span className="text-sm font-semibold">Stage-3 Redox Filter</span>
                </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full mx-auto"
          >
            <div className="absolute inset-0 rounded-[3rem] border border-white/20 bg-white/5 backdrop-blur-sm shadow-2xl dark:border-white/10 dark:bg-white/5" />
            <PFASModel />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] font-medium tracking-wider uppercase text-muted-foreground/80 px-4 w-full">
                <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-[#404040]" /> Carbon</div>
                <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-[#a3e635]" /> Fluorine</div>
                <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-[#fbbf24]" /> Sulfur</div>
                <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-[#ef4444]" /> Oxygen</div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
