"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

import Autoplay from "embla-carousel-autoplay";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { motion } from "motion/react";
import { SmartImage } from "@/components/ui/smart-image";
import { certifications } from "@/constants/certifications";

export type MenuData = {
  id: number;
  img: string;
  imgAlt: string;
  userAvatar: string;
  userComment: string;
};

const HeroSection = ({ menudata }: { menudata: MenuData[] }) => {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 40, scale: 0.97 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 },
    },
  };

  return (
    <section className="relative flex min-h-[calc(100svh-4.375rem)] items-center overflow-hidden px-6 py-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[12%] h-40 w-40 rounded-full bg-primary/15 blur-3xl sm:h-56 sm:w-56" />
        <div className="absolute bottom-[10%] right-[6%] h-48 w-48 rounded-full bg-sky-400/20 blur-3xl sm:h-64 sm:w-64" />
      </div>
      <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Hero Header */}
        <div className="grid grid-cols-1 items-center gap-6 gap-y-10 md:gap-y-12 lg:min-h-[min(68vh,640px)] lg:grid-cols-5 lg:gap-x-10">
          <motion.div
            className="flex w-full flex-col justify-center gap-5 max-lg:items-center lg:col-span-3 lg:h-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-4xl md:leading-[1.29167] font-bold text-balance max-lg:text-center sm:text-5xl lg:text-6xl"
              variants={itemVariants}
            >
              Every Drop{" "}<br/>
              <span className="bg-linear-to-r from-primary via-sky-500 to-cyan-400 bg-clip-text text-transparent sm:text-6xl lg:text-7xl">
                Matters!
              </span>
            </motion.h1>

            <motion.p
              className="text-muted-foreground sm:max-w-xl text-sm sm:text-lg max-lg:text-center"
              variants={itemVariants}
            >
              Upgrade your home with Hello Water. Enjoy peace of mind with
              whole-house filtration that delivers safe, crystal-clean water to
              your family every single day.
            </motion.p>

            <motion.div
              className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
              variants={itemVariants}
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-full border-white/40 bg-white/10 text-base text-foreground backdrop-blur-sm hover:bg-white/20 sm:w-fit has-[>svg]:px-6 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10"
                render={<Link href="/products" />}
                nativeButton={false}
              >
                Explore Our Products
                <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
              <Button
                size="lg"
                className="group relative w-full overflow-hidden rounded-full px-4 text-base before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] sm:w-fit has-[>svg]:px-6 dark:before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)]"
                render={<Link href="/enquiry" />}
                nativeButton={false}
              >
                Get A Free Water Assessment

              </Button>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="mt-10 flex w-full max-w-3xl flex-col gap-6 max-lg:items-center"
            >
              <div className="shrink-0">
                <p className="text-[10px] font-black tracking-widest text-primary uppercase leading-tight">
                  Systems/Cartridges Certifications and Standards
                </p>
              </div>

              <div className="flex flex-nowrap items-start gap-x-3 md:gap-x-6 gap-y-4 max-lg:justify-center">
                {certifications.map((cert) => (
                  <div key={cert.title} className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-1.5 text-center transition-transform hover:scale-105">
                      <div className="relative h-8 md:h-12 w-auto flex items-center justify-center px-2">
                        <Image 
                          src={cert.logo} 
                          alt={cert.title} 
                          className="h-full w-auto object-contain"
                          width={100}
                          height={100}
                        />
                      </div>
                      <p className="hidden md:block md:text-[8px] leading-[1.1] text-zinc-500 font-medium max-w-[100px] line-clamp-2 uppercase">
                        {cert.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="w-full lg:col-span-2"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <Carousel
              className="w-full overflow-hidden rounded-[1.75rem] border border-white/30 bg-white/20 shadow-[0_20px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
              plugins={[plugin.current]}
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {menudata.map((item, index) => (
                  <CarouselItem
                    key={item.id}
                    className="flex w-full items-center justify-center"
                  >
                    <SmartImage
                      src={item.img}
                      alt={item.imgAlt}
                      useNextImage
                      fill
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 90vw, 100vw"
                      className="h-full w-full object-cover"
                      containerClassName="aspect-[5/3] w-full sm:aspect-auto sm:h-[420px] lg:h-[min(68vh,640px)] rounded-2xl"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
