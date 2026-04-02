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
    <div className="relative mb-8 last:mb-0 md:mb-24 flex flex-col md:flex-row items-center justify-between w-full group">
      {/* Central Icon / Mobile Left */}
      <div className="absolute left-2 md:left-1/2 -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200, delay: 0.2 }}
          className="size-12 md:size-14 rounded-xl md:rounded-2xl bg-background border-2 border-primary flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.3)] group-hover:scale-110 transition-transform duration-300"
        >
          <Icon className="size-4 md:size-7 text-primary" />
        </motion.div>
      </div>

      {/* Content (Left for even, Right for odd on desktop) */}
      <div className={cn(
        "w-full md:w-[45%] pl-14 md:pl-0",
        isEven ? "md:text-right" : "md:order-last md:text-left"
      )}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur-md shadow-lg transition-all duration-500 hover:shadow-primary/5 hover:bg-card dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        >
          {/* Timeframe Badge */}
          <div className={cn(
            "mb-3 flex",
            isEven ? "md:justify-end" : "md:justify-start"
          )}>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold tracking-wider border border-primary/20">
              {timeframe}
            </span>
          </div>
          
          <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 tracking-tight group-hover:text-primary transition-colors duration-300 leading-tight">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-xs md:text-base">
            {description}
          </p>
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
    <div ref={containerRef} className="relative w-full max-w-5xl mx-auto py-8 md:py-24 px-4 overflow-hidden">
      {/* Vertical Line */}
      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 md:w-1 bg-border/30">
        <motion.div
          style={{ scaleY, originY: 0 }}
          className="absolute inset-0 bg-gradient-to-b from-primary via-primary/50 to-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.5)]"
        />
      </div>

      {/* Timeline Items */}
      <div className="relative space-y-8 md:space-y-0">
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
