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
import watermarkLogo from "@/assets/logos/certifications/watermark.png";
import awqcLogo from "@/assets/logos/certifications/awqc.png";
import sensitiveChoiceLogo from "@/assets/logos/certifications/sensitive-choice.png";
import nsfLogo from "@/assets/logos/certifications/nsf.png";

const certifications = [
  {
    title: "WaterMark Certification",
    description: "This system is approved under Australia’s official WaterMark scheme, confirming it meets rigorous plumbing & safety regulations. Designed for compliant installation by licensed professionals, it delivers reliable performance you can trust in your home every day.",
    logo: watermarkLogo,
  },
  {
    title: "AS/NZS 4020 Tested (AWQC)",
    description: "Certified by the Australian Water Quality Centre (AWQC), a leading Australian laboratory & research facility specializing in water testing, analysis & certification to ensure safety & compliance with national drinking water standards. This certification confirms all materials in contact with your water are non-toxic & won’t leach harmful substances, protecting the taste, colour & overall quality of your water; so what flows through your home stays clean, pure & uncompromised.",
    logo: awqcLogo,
  },
  {
    title: "Sensitive Choice Program",
    description: "Approved by the National Asthma Council Australia, a national health organization that assesses products for asthma & allergy sensitivity, endorsing those better suited to improving indoor environmental quality. This certification highlights products designed to support a healthier indoor environment & indicates the system may help reduce potential irritants, making it a smart choice for households focused on asthma & allergy-friendly living.",
    logo: sensitiveChoiceLogo,
  },
  {
    title: "NSF/ANSI 42, 53 & 401 Certifications",
    description: "Certified by NSF International, an independent global public health & safety organization that develops & certifies standards for water filtration & treatment systems to ensure contaminant reduction & material safety. This system is proven to reduce chlorine, taste & odour (NSF 42), remove a wide range of harmful contaminants including heavy metals & chemicals (NSF 53), & target emerging pollutants such as pharmaceuticals & modern trace compounds (NSF 401). Together, these certifications deliver advanced multi-stage protection; giving you cleaner, safer & better-quality water in every part of your home.",
    logo: nsfLogo,
  }
];

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
              <div className="py-12 border-b border-border last:border-0">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                  {/* Large & Clean Logo */}
                  <div className="shrink-0 size-32 md:size-48 flex items-center justify-center p-2">
                    <Image
                      src={cert.logo}
                      alt={cert.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 text-center md:text-left space-y-4">
                    <h3 className="text-3xl md:text-2xl font-bold tracking-tight text-foreground">
                      {cert.title}
                    </h3>
                    <p className="text-muted-foreground text-justify leading-relaxed text-base md:text-lg md:text-left">
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
      <section className="mx-auto w-full max-w-6xl px-6 py-16 md:pb-36 sm:px-6 lg:px-8">
        <MotionWrapper
          className="text-center mb-16 space-y-4"
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
              Reliability {" "}
            </span>
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
              className="space-y-4"
            >
              <div className="mx-auto size-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <item.icon className="size-6" />
              </div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </MotionWrapper>
          ))}
        </div>
      </section>
    </div>
  );
}
