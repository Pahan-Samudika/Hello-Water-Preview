"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface AnnouncementBannerProps {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const AnnouncementBanner = ({ onClick }: AnnouncementBannerProps) => {
  return (
    <div
      onClick={onClick}
      className="group relative w-full h-20 md:h-24 bg-primary/10 dark:bg-primary/10 backdrop-blur-md text-foreground cursor-pointer select-none border-b border-primary/10 flex items-center justify-center transition-all duration-300 hover:bg-primary/15"
    >
      {/* Subtle bottom gradient glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl w-full flex items-center justify-between px-4 sm:px-6 md:px-8 gap-3 md:gap-4">
        {/* Left: Sparkle Badge */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 bg-primary/20 border border-primary/20 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 animate-pulse text-primary" />
            Limited-Time Offer
          </span>
        </div>

        {/* Center: Text message */}
        <div className="flex flex-col items-start md:items-center justify-center flex-1 min-w-0 py-1">
          {/* Title row */}
          <div className="text-left md:text-center leading-snug md:leading-tight">
            <span className="bg-gradient-to-r from-primary via-sky-500 to-cyan-500 bg-clip-text text-transparent font-extrabold text-[12px] sm:text-sm md:text-lg tracking-wide uppercase mr-1.5 md:mr-2 block md:inline-block">
              Winter Sale
            </span>
            <span className="font-extrabold text-foreground/90 text-[12px] sm:text-sm md:text-lg">
              Save over $700 off Whole Home Filtration System
            </span>
          </div>
          {/* Subtext row */}
          <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground/80 font-medium leading-snug mt-0.5 md:mt-1">
            <span className="hidden md:inline">Professionally installed + receive a FREE Lifetime Supply of Premium Pentair Gradient Density Cartridge every 12 months!</span>
            <span className="inline md:hidden">Includes FREE Cartridges every 12 months for life!</span>
          </p>
        </div>

        {/* Right: CTA button */}
        <div className="flex items-center flex-shrink-0 pl-1">
          <span
            className="inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 font-bold rounded-full shadow-md shadow-primary/10 transition-all duration-200 group-hover:scale-105 active:scale-95 whitespace-nowrap p-2.5 md:px-5 md:py-2.5 text-[10px] md:text-base"
          >
            <span className="hidden md:inline">Claim Now</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
