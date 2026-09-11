"use client";

import React from "react";
import { type Product, type SystemStage } from "@/constants/products";
import { SmartImage } from "@/components/ui/smart-image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FiltrationStagesTimelineProps {
  stages: SystemStage[];
  activeSizeKey: string;
  allProducts: Product[];
}

export function FiltrationStagesTimeline({
  stages,
  activeSizeKey,
  allProducts,
}: FiltrationStagesTimelineProps) {
  return (
    <div className="relative border-l border-primary/20 space-y-10 py-2 ml-4 sm:ml-6">
      {stages.map((stage) => {
        const filteredCartridges = stage.cartridges.filter(
          (c) => !activeSizeKey || c.variantId === activeSizeKey || c.variantId === ""
        );

        return (
          <div key={stage.stageNumber} className="relative pl-8 sm:pl-12 group/stage">
            {/* Timeline Center Dot */}
            <div className="absolute left-0 -translate-x-1/2 top-1.5 flex size-8 sm:size-10 items-center justify-center rounded-full border-2 border-primary/30 bg-background text-primary text-sm font-black shadow-md shadow-primary/5 group-hover/stage:border-primary group-hover/stage:bg-primary group-hover/stage:text-primary-foreground group-hover/stage:shadow-primary/20 transition-all duration-300 z-10 select-none">
              {stage.stageNumber}
            </div>

            {/* Content Container */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-foreground group-hover/stage:text-primary transition-all duration-300">
                  {stage.stageName}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1">
                  Stage {stage.stageNumber} Filtration
                </p>
              </div>

              {filteredCartridges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCartridges.map((link) => {
                    const cartridge = allProducts.find((p) => p.slug === link.slug);
                    if (!cartridge) return null;

                    // Find specific size variant details
                    const variant = cartridge.variants?.find((v) => v.id === link.variantId);
                    const dispName = variant ? variant.name : cartridge.name;
                    const dispPrice = variant ? variant.price : cartridge.price;
                    const dispImage = variant?.image || cartridge.image;
                    const dispDesc = variant ? variant.shortDescription : cartridge.shortDescription;

                    return (
                      <Link
                        key={`${link.slug}-${link.variantId}`}
                        href={`/products/${cartridge.slug}${link.variantId ? `?variant=${link.variantId}` : ""}`}
                        className="group/cartridge flex items-center gap-3 p-3.5 rounded-2xl border border-primary/50 border-l-4 border-l-primary/50 bg-background/30 hover:bg-muted/30 hover:border-primary/30 transition-all duration-300 cursor-pointer w-full text-left animate-fadeIn"
                      >
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-white/5 dark:border-white/10 bg-muted/40 group-hover/cartridge:scale-[1.03] transition-all">
                          <SmartImage
                            src={dispImage}
                            alt={dispName}
                            useNextImage
                            fill
                            sizes="48px"
                            containerClassName="h-full w-full"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-foreground group-hover/cartridge:text-primary transition-all truncate">
                            {dispName}
                          </h4>
                          <span className="text-sm font-bold text-primary mt-1 block">
                            {dispPrice}
                          </span>
                        </div>
                        <ArrowRight className="size-3.5 group-hover/cartridge:translate-x-0.5 group-hover/cartridge:text-primary transition-all shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <span className="text-[10px] text-muted-foreground/60 italic block">
                  No compatible cartridges found for this variant size.
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
