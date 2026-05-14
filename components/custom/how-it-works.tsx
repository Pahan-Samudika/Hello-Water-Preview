"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Book Your Free Appointment or call",
    description: "Schedule a complimentary on-site visit, including a field water analysis & in line pressure test, or a video call with one of our experts.",
  },
  {
    title: "Receive Your Quote Instantly",
    description: "Our team will provide a clear, competitive quote on the spot; no waiting around.",
  },
  {
    title: "Choose Your Installation Time",
    description: "Pick a date & time that works best for you, & we’ll handle the rest.",
  },
  {
    title: "Enjoy Clean, Filtered Water Everywhere",
    description: "Experience fresh, safe water flowing from every tap in your home-effortless & worry-free.",
  },
];

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const stepVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } 
  },
};

export const HowItWorks = () => {
  return (
    <section className="relative py-20 px-6 sm:px-10 lg:px-16 overflow-hidden">

      <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-primary bg-primary/10 rounded-lg border border-primary/20">
              Our Process
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              How We{" "}
              <span className="bg-linear-to-r from-primary via-sky-500 to-cyan-400 bg-clip-text text-transparent">
                Work
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Our Simple 4-Step Process
            </p>
          </motion.div>
        </div>

        {/* Timeline Grid */}
        <motion.div 
          className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[2px] -z-10 overflow-hidden">
            <motion.div 
               className="absolute inset-0 bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"
               initial={{ x: "-100%" }}
               whileInView={{ x: "0%" }}
               viewport={{ once: true }}
               transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            />
          </div>

          {STEPS.map((step, index) => (
            <motion.div 
              key={index}
              variants={stepVariant}
              className="group flex flex-col items-center text-center px-4"
            >
              {/* Number Container */}
              <div className="relative mb-8">
                <div className={cn(
                  "size-16 md:size-20 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
                  "bg-white dark:bg-black border-2 border-primary/40 dark:border-primary/40",
                  "group-hover:translate-y-[-8px] group-hover:shadow-primary/20 group-hover:border-primary/30"
                )}>
                  {/* Internal Glow on Hover */}
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <span className="text-3xl md:text-4xl font-black text-primary group-hover:scale-110 transition-transform duration-500">
                    {index + 1}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary leading-tight">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed balance">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
