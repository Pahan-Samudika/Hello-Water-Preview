import React from "react";
import Link from "next/link";
import { SmartImage } from "@/components/ui/smart-image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CompatibleSystemCardProps {
  name: string;
  image: string;
  imageAlt: string;
  href: string;
  stageLabel?: string;
}

export function CompatibleSystemCard({
  name,
  image,
  imageAlt,
  href,
  stageLabel,
}: CompatibleSystemCardProps) {
  return (
    <Card className="group relative mx-auto w-full max-w-[240px] gap-0 overflow-hidden rounded-[1.5rem] border-0 p-0 shadow-lg">
      {/* Product Image */}
      <SmartImage
        src={image}
        alt={imageAlt}
        useNextImage
        fill
        sizes="(min-width: 1024px) 240px, (min-width: 640px) 40vw, 80vw"
        containerClassName="aspect-[4/5] w-full max-h-64"
        className="object-cover transition duration-500 ease-out lg:group-hover:scale-105 lg:group-hover:blur-[2px]"
      />

      {/* Stage Badge (top-left) */}
      {stageLabel && (
        <span className="pointer-events-none absolute left-2.5 top-2.5 z-50 inline-flex items-center rounded-full bg-primary/80 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-primary-foreground shadow-md">
          {stageLabel}
        </span>
      )}

      {/* Mobile tap target */}
      <Link href={href} className="absolute inset-0 z-40 block lg:hidden">
        <span className="sr-only">View {name} details</span>
      </Link>

      {/* Detail Overlay */}
      <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 lg:pointer-events-auto lg:bg-none lg:bg-black/80 lg:p-3 lg:opacity-0 lg:backdrop-blur-md lg:grayscale lg:transition lg:duration-300 lg:group-hover:opacity-100">
        <div className="w-full transform transition-transform duration-300 lg:translate-y-3 lg:rounded-xl lg:p-3 lg:shadow-xl lg:group-hover:translate-y-0">
          <h3 className="line-clamp-2 text-sm font-semibold tracking-tight text-white">
            {name}
          </h3>

          {/* Desktop CTA */}
          <div className="mt-3 hidden w-full flex-col gap-2 lg:flex lg:group-hover:flex">
            <Button
              size="sm"
              className="w-full bg-white/95 text-black hover:bg-white text-xs py-1.5"
              render={<Link href={href} />}
              nativeButton={false}
            >
              View System
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
