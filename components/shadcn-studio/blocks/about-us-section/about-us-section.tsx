"use client";

import type { ComponentType } from "react";
import { aboutHighlights } from "@/constants";
import { CircleCheck } from "lucide-react";
import { MotionWrapper } from "@/components/custom/motion-wrapper";
import { SmartImage } from "@/components/ui/smart-image";

type StatItem = {
  icon: ComponentType;
  value: string;
  description: string;
}[];

const AboutUs = ({ stats }: { stats: StatItem }) => {
  return (
    <section className="bg-background">
      <MotionWrapper 
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {aboutHighlights.map((item) => (
            <MotionWrapper
              key={item.title}
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.98 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
              }}
            >
              <article className="h-full rounded-xl border border-secondary bg-background p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <CircleCheck className="size-6 text-primary" />
                  <h2 className="text-2xl font-semibold">{item.title}</h2>
                </div>
                <p className="max-w-sm text-muted-foreground">{item.description}</p>
              </article>
            </MotionWrapper>
          ))}
        </MotionWrapper>

        {/* Video player and stats */}
        <MotionWrapper
          className="relative py-8 h-full w-full max-lg:space-y-6 sm:mb-16 lg:mb-24 mt-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <SmartImage
            src="https://res.cloudinary.com/dnlb02zp9/image/upload/v1771561659/nd1np6qyyfcetzpo0efv_yrbnyh.webp"
            alt="About us illustration"
            className="max-h-[500px] w-full rounded-2xl object-cover shadow-xl"
          />

          {/* Stats card overlapping the video section */}
          <div className="bg-background/95 backdrop-blur-xl grid gap-10 rounded-[2rem] border shadow-2xl p-6 sm:p-8 sm:max-lg:grid-cols-2 lg:absolute lg:-bottom-25 lg:left-1/2 lg:w-3/4 lg:-translate-x-1/2 lg:grid-cols-4 lg:px-10 xl:w-max">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-2.5 text-center max-w-[250px]"
              >
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary [&>svg]:size-7">
                  <stat.icon />
                </div>
                <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-[0.1em]">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </MotionWrapper>
    </section>
  );
};

export default AboutUs;
