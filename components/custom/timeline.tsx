"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  timeframe: string;
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
}

const TimelineItem = ({ timeframe, title, description, icon: Icon, index }: TimelineItemProps) => {
  const isEven = index % 2 === 0;

  return (
    <div className="relative mb-12 last:mb-0 md:mb-24 flex flex-col md:flex-row items-center justify-between w-full">
      {/* Mobile-only timeframe */}
      <div className="md:hidden w-full mb-4 px-8">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide border border-primary/20">
          {timeframe}
        </span>
      </div>

      {/* Content (Left for even, Right for odd on desktop) */}
      <div className={cn(
        "w-full md:w-[45%] group px-4 md:px-0",
        isEven ? "md:text-right" : "md:order-last md:text-left"
      )}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="p-6 md:p-8 rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur-md shadow-lg transition-all duration-500 hover:shadow-primary/5 hover:bg-card dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        >
          {/* Desktop-only timeframe */}
          <div className={cn(
            "hidden md:block mb-4",
            isEven ? "md:justify-end" : "md:justify-start"
          )}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide border border-primary/20 uppercase">
              {timeframe}
            </span>
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            {description}
          </p>
        </motion.div>
      </div>

      {/* Central Icon */}
      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 top-0 md:top-1/2 -translate-y-0 md:-translate-y-1/2 z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200, delay: 0.3 }}
          className="size-10 md:size-14 rounded-2xl bg-background border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)] group-hover:scale-110 transition-transform duration-300"
        >
          <Icon className="size-5 md:size-7 text-primary" />
        </motion.div>
      </div>

      {/* Empty space for alternating layout */}
      <div className="hidden md:block w-[45%]" />
    </div>
  );
};

export interface TimelineData {
  timeframe: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function Timeline({ items }: { items: TimelineData[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={containerRef} className="relative w-full max-w-5xl mx-auto py-12 md:py-24 px-4 overflow-hidden">
      {/* Vertical Line */}
      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 top-24 bottom-24 w-0.5 bg-border/30">
        <motion.div
          style={{ scaleY, originY: 0 }}
          className="absolute inset-0 bg-gradient-to-b from-primary via-primary/50 to-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.5)]"
        />
      </div>

      {/* Timeline Items */}
      <div className="relative">
        {items.map((item, index) => (
          <TimelineItem 
            key={index} 
            {...item} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
}
