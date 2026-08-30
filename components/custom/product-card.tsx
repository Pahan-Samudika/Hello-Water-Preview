"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/ui/smart-image";
import Link from "next/link";
import { useMemo } from "react";

type ProductCardProps = {
  name: string;
  description?: string;
  price: string;
  image: string;
  imageAlt: string;
  recent?: boolean;
  href?: string;
  className?: string;
  variants?: { id: string; label: string; name: string; price: string; shortDescription?: string; image?: string }[];
};

export function ProductCard({
  name,
  description,
  price,
  image,
  imageAlt,
  recent = false,
  href = "#",
  className,
  variants = [],
}: ProductCardProps) {
  // Check if variants exist to render multi-price stack
  const hasMultiplePrices = variants && variants.length > 0;

  const renderPriceContent = (align: "left" | "right" = "right") => {
    if (hasMultiplePrices) {
      const hasGst = variants.some((v) => v.price && /GST/i.test(v.price));
      
      return (
        <div
          className={cn(
            "flex flex-col gap-1 font-medium",
            align === "right" ? "items-end text-right" : "items-start text-left"
          )}
        >
          {variants.map((v) => {
            return (
              <div key={v.id} className="whitespace-nowrap leading-none py-0.5">
                {align === "left" ? (
                  <>
                    <span className="text-xs uppercase tracking-wider text-white/55 mr-1.5">{v.label}:</span>
                    <span className="font-extrabold text-base text-white">{v.price}</span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] uppercase tracking-wider text-white/55 mr-1.5">{v.label}</span>
                    <span className="font-extrabold text-sm">{v.price}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <span className={cn("font-medium", align === "left" ? "text-lg text-white" : "text-xl")}>
        {price}
      </span>
    );
  };

  return (
    <Card
      className={cn(
        "group relative mx-auto w-full max-w-sm gap-0 overflow-hidden rounded-[2rem] border-0 p-0 shadow-lg lg:shadow-none",
        className,
      )}
    >
      <SmartImage
        src={image}
        alt={imageAlt}
        useNextImage
        fill
        sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
        containerClassName="aspect-[4/5] w-full max-h-96"
        className="object-cover transition duration-500 ease-out lg:group-hover:scale-105 lg:group-hover:blur-[2px]"
      />

      {recent ? (
        <Badge className="bg-primary/70 text-primary-foreground pointer-events-none absolute left-3 top-3 z-50 h-auto rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-md">
          New
        </Badge>
      ) : null}

      {/* Floating Price (hidden on mobile, visible on desktop until hover) */}
      <div
        className={cn(
          "pointer-events-none absolute right-3 bottom-3 z-20 hidden bg-black/65 px-3.5 py-2 text-white backdrop-blur-sm transition-opacity duration-200 lg:block lg:group-hover:opacity-0",
          hasMultiplePrices ? "rounded-2xl" : "rounded-full"
        )}
      >
        {renderPriceContent("right")}
      </div>

      {/* Mobile full-card tap target (hidden on desktop) */}
      <Link href={href} className="absolute inset-0 z-40 block lg:hidden">
        <span className="sr-only">View {name} details</span>
      </Link>

      {/* Detail Overlay: Always visible gradient on mobile, hidden-until-hover on desktop */}
      <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/40 to-transparent p-5 lg:pointer-events-auto lg:bg-none lg:bg-black/80 lg:p-4 lg:opacity-0 lg:backdrop-blur-md lg:grayscale lg:transition lg:duration-300 lg:group-hover:opacity-100">
        <div className="w-full transform transition-transform duration-300 lg:translate-y-4 lg:rounded-xl lg:p-4 lg:shadow-xl lg:group-hover:translate-y-0">
          <h3 className="line-clamp-3 text-2xl font-semibold tracking-tight text-white lg:text-3xl">
            {name}
          </h3>
          
          <div
            className={cn(
              "pointer-events-none absolute right-3 top-3 z-20 bg-black/65 px-3.5 py-2 text-white backdrop-blur-sm transition-opacity duration-200 lg:hidden lg:group-hover:opacity-0",
              hasMultiplePrices ? "rounded-2xl" : "rounded-full"
            )}
          >
            {renderPriceContent("right")}
          </div>

          {description ? (
            <p className="mt-3 hidden line-clamp-3 text-sm leading-6 text-white/80 lg:block lg:group-hover:block">
              {description}
            </p>
          ) : null}

          {/* Desktop details */}
          <div className="mt-4 hidden w-full flex-col gap-3 lg:flex lg:group-hover:flex">
            <div className="w-full text-start">
              {renderPriceContent("left")}
            </div>
            <Button
              size="sm"
              className="w-full bg-white/95 text-black hover:bg-white"
              render={<Link href={href} />}
              nativeButton={false}
            >
              View Product
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
