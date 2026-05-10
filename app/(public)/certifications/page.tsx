"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  ShieldCheck,
  Sparkles,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MotionWrapper } from "@/components/custom/motion-wrapper";
import { certifications } from "@/constants/certifications";

export default function CertificationsPage() {
  return (
    <div className="relative overflow-hidden w-full min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:py-16 sm:px-6 lg:px-8">
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
              Proven Quality. Trusted Standards.
            </h1>
          </MotionWrapper>
          <MotionWrapper
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
            }}
          >
            <p className="text-muted-foreground sm:text-lg text-justify">
              From material safety to filtration performance, our systems are verified against trusted standards to deliver consistent, high-quality water.
            </p>
          </MotionWrapper>
        </MotionWrapper>

        {/* Certifications Grid - One Column */}
        <MotionWrapper
          className="grid grid-cols-1 gap-8"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {certifications.map((cert) => (
            <MotionWrapper
              key={cert.title}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.98 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
                },
              }}
              whileHover={{
                y: -5,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="w-full"
            >
              <div className="p-8 md:p-0 md:py-12 rounded-[2rem] md:rounded-none border border-border/50 md:border-0 md:border-b border-border last:border-0 bg-card/60 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none transition-all duration-300">
                <div className="flex flex-col md:flex-row items-center md:gap-16">
                  {/* Refined Mobile Logo Size */}
                  <div className="shrink-0 size-32 md:size-48 flex items-center justify-center p-2">
                    <Image
                      src={cert.logo}
                      alt={cert.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 text-center md:text-left space-y-3 md:space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                      {cert.title}
                    </h3>
                    <p className="text-muted-foreground text-center md:text-justify leading-relaxed text-sm md:text-lg">
                      {cert.description}
                    </p>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </MotionWrapper>
      </section>

      {/* Trust Section (Inspired by About Us / How it Works style) */}
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:py-16 sm:px-6 lg:px-8">
        <MotionWrapper
          className="text-center mb-12 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-primary bg-primary/10 rounded-lg border border-primary/20">
            Guaranteed Quality
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
            <span className="bg-gradient-to-r from-primary via-sky-500 to-cyan-400 bg-clip-text text-transparent">
              Reliability
            </span>{" "}
            You Can Count On
          </h2>
          <p className="text-muted-foreground sm:text-lg max-w-3xl mx-auto">
            Our commitment to quality means every system we install is backed by world-class certifications and rigorous testing standards.
          </p>
        </MotionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { title: "Independently Verified", desc: "Rigorous testing by third-party laboratories ensures our claims are backed by data.", icon: ShieldCheck },
            { title: "Safe for Families", desc: "All materials are food-grade and certified non-toxic for your peace of mind.", icon: Sparkles },
            { title: "Performance Driven", desc: "Engineered to deliver high-flow filtration without compromising on safety.", icon: Zap },
          ].map((item, i) => (
            <MotionWrapper
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="h-full p-8 rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:bg-card dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 space-y-4">
                <div className="mx-auto size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform duration-500 group-hover:scale-110">
                  <item.icon className="size-7" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {item.desc}
                </p>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </section>
    </div>
  );
}
