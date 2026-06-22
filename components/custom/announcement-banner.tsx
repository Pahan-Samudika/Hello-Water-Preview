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

      <div className="max-w-7xl w-full flex items-center justify-center sm:justify-between px-4 sm:px-6 md:px-8 gap-x-4 sm:gap-x-0">
        {/* Left: Sparkle Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-primary/20 border border-primary/20 text-primary px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 animate-pulse text-primary" />
            Limited Offer
          </span>
        </div>

        {/* Center: Text message */}
        <div className="flex flex-col items-center sm:items-start md:items-center justify-center gap-1.5 sm:gap-2">
          {/* Title row */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="bg-gradient-to-r from-primary via-sky-500 to-cyan-500 bg-clip-text text-transparent font-extrabold text-sm sm:text-base md:text-lg tracking-wide uppercase whitespace-nowrap">
              EOFY Mega Sale:
            </span>
            <span className="font-extrabold text-foreground/90 text-sm sm:text-base md:text-lg leading-none whitespace-nowrap">
              Save over $700 off Whole-Home Filtration
            </span>
          </div>
          {/* Subtext row */}
          <p className="text-xs md:text-sm text-muted-foreground/80 font-medium leading-none whitespace-nowrap">
            <span className="hidden md:inline">Professionally installed + receive a premium replacement cartridge FREE every 12 months for life!</span>
            <span className="inline md:hidden">Get FREE replacement cartridges for life!</span>
          </p>
        </div>

        {/* Right: CTA button */}
        <div className="flex items-center">
          <span
            className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs sm:text-sm md:text-base font-bold px-5 py-2.5 rounded-full shadow-md shadow-primary/10 transition-all duration-200 group-hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            Claim Now
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
