"use client";

import React from "react";
import { products } from "@/constants/products";
import { ProductCard } from "./product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface MoreProductsProps {
  currentProductSlug: string;
}

export function MoreProducts({ currentProductSlug }: MoreProductsProps) {
  // Filter out the current product to show others
  const relatedProducts = products.filter(
    (product) => product.slug !== currentProductSlug
  );

  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-10 md:mt-20 space-y-5 md:space-y-10 pt-10 md:pt-20">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/70 pl-1">
          Explore Our Collection
        </p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Other Products
        </h2>
      </div>

      <Carousel
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 py-4">
          {relatedProducts.map((product) => (
            <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <div className="h-full px-1">
                <ProductCard
                  name={product.name}
                  description={product.shortDescription}
                  price={product.price}
                  image={product.image}
                  imageAlt={product.imageAlt}
                  recent={product.recent}
                  href={`/products/${product.slug}`}
                  className="shadow-md hover:shadow-xl transition-all duration-300 lg:shadow-md h-full"
                />
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
    </section>
  );
}
