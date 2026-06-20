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
      className="group relative w-full h-11 md:h-12 bg-primary/10 dark:bg-primary/10 backdrop-blur-md text-foreground cursor-pointer select-none border-b border-primary/10 flex items-center justify-center transition-all duration-300 hover:bg-primary/15"
    >
      {/* Subtle bottom gradient glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl w-full flex items-center justify-center sm:justify-between px-4 sm:px-6 md:px-8 gap-x-3 sm:gap-x-0">
        {/* Left: Sparkle Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-primary/20 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 animate-pulse text-primary" />
            Limited Offer
          </span>
        </div>

        {/* Center: Text message */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <span className="bg-gradient-to-r from-primary via-sky-500 to-cyan-500 bg-clip-text text-transparent font-extrabold text-[10px] sm:text-xs md:text-sm tracking-wide uppercase whitespace-nowrap">
            EOFY Sale:
          </span>
          <span className="font-semibold text-foreground/90 text-[10px] sm:text-xs md:text-sm leading-none whitespace-nowrap">
            <span className="hidden sm:inline">Save over $700 + free lifetime filter cartridges</span>
            <span className="sm:hidden">Save $700+ & free cartridges</span>
          </span>
        </div>

        {/* Right: CTA button */}
        <div className="flex items-center">
          <span
            className="inline-flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/95 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-md shadow-primary/10 transition-all duration-200 group-hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            Claim Now
            <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
