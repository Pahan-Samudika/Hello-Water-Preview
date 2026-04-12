"use client";

import type { ComponentType } from "react";
import { aboutHighlights } from "@/constants";
import { Target, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { MotionWrapper } from "@/components/custom/motion-wrapper";
import { SmartImage } from "@/components/ui/smart-image";

type StatItem = {
  icon: ComponentType;
  value: string;
  description: string;
}[];

const getIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("mission")) return Target;
  if (t.includes("team")) return Users;
  return ShieldCheck;
};

const AboutUs = ({ stats }: { stats: StatItem }) => {
  return (
    <section className="bg-background py-16">
      <MotionWrapper
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {aboutHighlights.map((item, index) => {
          const Icon = getIcon(item.title);
          return (
            <MotionWrapper
              key={item.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
              }}
            >
              <article className="group relative h-full overflow-hidden rounded-2xl border border-secondary bg-background/50 p-8 transition-all hover:bg-secondary/10 hover:shadow-lg">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Icon className="size-6" />
                  </div> </div>
                <h2 className="mb-4 text-2xl font-bold tracking-tight">{item.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </article>
            </MotionWrapper>
          );
        })}
      </MotionWrapper>

      {/* Video/Image and Stats Section */}
      <MotionWrapper
        className="relative mt-20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Main Visual Container */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <SmartImage
            src="https://res.cloudinary.com/dnlb02zp9/image/upload/v1771561659/nd1np6qyyfcetzpo0efv_yrbnyh.webp"
            alt="About Hello Water"
            className="aspect-video w-full object-cover sm:max-h-[600px]"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Stats Bar - Float over image on large screens, stack below on small */}
        <div className="bg-background/80 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-8 mt-[-4rem] mx-auto w-[calc(100%-2rem)] max-w-6xl relative z-10 lg:mt-[-5rem]">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-3"
              >
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-4 ring-primary/10">
                  <stat.icon />
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-extrabold tracking-tighter sm:text-5xl">{stat.value}</span>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 sm:text-xs">
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MotionWrapper>
    </section>
  );
};

export default AboutUs;
