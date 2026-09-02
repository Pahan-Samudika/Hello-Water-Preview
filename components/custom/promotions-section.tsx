"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, GiftIcon, PercentIcon, SparklesIcon, PhoneCall as PhoneCallIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
// import Countdown from "react-countdown";

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

export const PromotionsSection = () => {
  return (
    <section id="offers" className="relative scroll-mt-20 overflow-hidden px-6 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 px-2 py-4 sm:px-4 sm:py-6">

          {/* Header */}
          <motion.div
            className="flex flex-col gap-4 text-center max-w-3xl"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div className="flex justify-center" variants={fadeUp}>
              <div className="rounded-lg bg-primary/10 text-primary border-primary/20 border px-4 py-1.5 font-semibold text-sm tracking-wide">
                Special Offers
              </div>
            </motion.div>
            <motion.div className="space-y-4" variants={fadeUp}>
              <h2 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
                Limited Time{" "}
                <span className="bg-linear-to-r from-primary via-sky-500 to-cyan-400 bg-clip-text text-transparent">
                  Promotions
                </span>
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                Don't miss our exclusive deals. Get premium water filtration systems professionally installed in your home with special seasonal savings.
              </p>
            </motion.div>
            {/* 
            <motion.div className="flex items-center justify-center gap-3" variants={fadeUp}>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Ends in:
              </span>
              <Countdown
                date={new Date("2026-06-30T23:59:59+10:00")}
                renderer={({ days, hours, minutes, seconds }) => (
                  <div className="flex items-center gap-1">
                    {[
                      { value: days, label: "d" },
                      { value: hours, label: "h" },
                      { value: minutes, label: "m" },
                      { value: seconds, label: "s" },
                    ].map((unit, i) => (
                      <div key={unit.label} className="flex items-center gap-1">
                        {i > 0 && (
                          <span className="text-sm font-bold text-muted-foreground/40">:</span>
                        )}
                        <div className="flex items-baseline gap-0.5 rounded-md bg-muted px-2 py-1 font-mono">
                          <span className="text-sm font-bold tabular-nums text-foreground sm:text-base">
                            {String(unit.value).padStart(2, "0")}
                          </span>
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {unit.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              />
            </motion.div>
            */}
          </motion.div>

          {/* Spring Bloom Sale Promo Poster Card */}
          <motion.div
            className="w-full"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="group relative mx-auto w-full overflow-hidden rounded-[2rem] border border-white/30 bg-white/20 shadow-[0_20px_50px_rgba(15,23,42,0.1)] backdrop-blur-md dark:border-white/10 dark:bg-white/5">

              {/* Full-width responsive Auto-height Image */}
              <Link href="/enquiry" className="block w-full lg:pointer-events-none">
                <Image
                  src="https://res.cloudinary.com/dnlb02zp9/image/upload/v1788333238/spring-sale_qtaxkm.webp"
                  alt="Spring Bloom Sale Banner"
                  width={2128}
                  height={788}
                  priority
                  className="w-full h-auto object-cover transition duration-500 ease-out lg:group-hover:scale-[1.02] lg:group-hover:blur-[2px]"
                />
              </Link>

              {/* Detail Overlay: Flows below on mobile, overlays absolute on hover on desktop */}
              <div className="relative z-30 flex flex-col justify-end bg-black/90 dark:bg-zinc-950/95 p-6 sm:p-8 lg:absolute lg:inset-0 lg:bg-black/85 lg:p-8 xl:p-12 lg:opacity-0 lg:backdrop-blur-md lg:transition lg:duration-300 lg:group-hover:opacity-100 lg:pointer-events-none lg:group-hover:pointer-events-auto">
                <div className="w-full transform transition-transform duration-300 lg:translate-y-6 lg:group-hover:translate-y-0 flex flex-col lg:max-w-3xl">

                  <div className="flex w-fit items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/20 px-3 py-1 text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2 lg:mb-3">
                    <PercentIcon className="size-3" />
                    Active Offer
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-3xl xl:text-4xl">
                    Spring Bloom Sale
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 sm:text-base lg:text-white/95">
                    This Spring Bloom Sale, upgrade your home with a premium Pentair USA-designed Hellowater Whole Home Water Filtration System & save over $700 off the installed price— plus receive an industry-leading Gradient Density Sediment Cartridge FREE every 12 months for life!
                  </p>


                  {/* CTAs */}
                  <div className="mt-4 xl:mt-6 flex flex-col gap-3 sm:flex-row pointer-events-auto z-40">
                    <Button
                      size="lg"
                      className="group relative overflow-hidden rounded-full px-10 text-base before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] dark:before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)]"
                      render={<Link href="/enquiry" />}
                      nativeButton={false}
                    >
                      Claim Offer Now
                      <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full border-white/40 px-10 bg-white/10 text-base text-white backdrop-blur-sm hover:bg-white/20 g:px-10"
                      render={<a href="tel:1300515469" />}
                      nativeButton={false}
                    >
                      <PhoneCallIcon className="size-4 mr-2" />
                      Call Us
                    </Button>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
