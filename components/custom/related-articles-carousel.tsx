"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { DBBlogPost } from "@/lib/db-queries";

interface RelatedArticlesCarouselProps {
  posts: DBBlogPost[];
}

export function RelatedArticlesCarousel({ posts }: RelatedArticlesCarouselProps) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-20 pt-10 border-t border-border">
      <h3 className="text-2xl font-bold text-foreground mb-8">Other Articles You Might Like</h3>

      <Carousel
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 py-4">
          {posts.map((other) => (
            <CarouselItem key={other.slug} className="pl-4 basis-full sm:basis-1/2">
              <div className="h-full px-1">
                <Link
                  href={`/blogs/${other.slug}`}
                  className="flex flex-col group overflow-hidden rounded-xl border border-border bg-card/40 hover:border-primary/20 hover:shadow-xs transition-all duration-300 h-full"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image
                      src={other.coverImage}
                      alt={other.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 350px"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {other.title}
                      </h4>
                    </div>
                    <span className="text-xs text-muted-foreground mt-4 block">
                      {other.publishedAt}
                    </span>
                  </div>
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Navigation - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block">
          <CarouselPrevious className="-left-14 xl:-left-20 h-10 w-10" />
          <CarouselNext className="-right-14 xl:-right-20 h-10 w-10" />
        </div>
      </Carousel>
    </div>
  );
}
