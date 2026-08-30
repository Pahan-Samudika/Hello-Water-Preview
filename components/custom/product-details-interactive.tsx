"use client";

import React, { useState, useEffect, useCallback } from "react";
import { type Product, type ProductVariant, type SystemStage } from "@/constants/products";
import { SmartImage } from "@/components/ui/smart-image";
import { MotionWrapper } from "@/components/custom/motion-wrapper";
import { FinancingOptionsPreview } from "@/components/custom/financing-options-preview";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FiltrationStagesTimeline } from "@/components/custom/filtration-stages-timeline";
import { Check } from "lucide-react";

interface ProductDetailsInteractiveProps {
  product: Product;
  allProducts: Product[];
}

export function ProductDetailsInteractive({ product, allProducts }: ProductDetailsInteractiveProps) {
  const hasVariants = !!(product.variants && product.variants.length > 0);
  
  // State for active variant
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  
  // Carousel API state
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sync selected variant with state
  const activeVariant = hasVariants && selectedVariantId
    ? product.variants!.find((v) => v.id === selectedVariantId) || null
    : null;

  const activeSizeKey = activeVariant?.sizeKey
    || product.sizeKey
    || (product.variants && product.variants.length > 0 ? product.variants[0].sizeKey : "")
    || "";

  const hasStages = !!(product.stages && product.stages.length > 0);

  // Active details to display
  const displayName = activeVariant ? activeVariant.name : product.name;
  const displayPrice = activeVariant ? activeVariant.price : product.price;
  const displayDescription = activeVariant ? activeVariant.shortDescription : product.shortDescription;

  // Generate carousel slides
  const slides = [
    {
      src: product.image,
      alt: product.imageAlt || product.name,
      label: "Overview",
    },
    ...(product.variants || []).map((v) => ({
      src: v.image || product.image,
      alt: `${v.name} View`,
      label: `${v.label} Size`,
      variantId: v.id,
    })),
  ];

  // Load variant from URL search params on mount
  useEffect(() => {
    if (typeof window !== "undefined" && hasVariants) {
      const params = new URLSearchParams(window.location.search);
      const variantParam = params.get("variant");
      if (variantParam && product.variants!.some((v) => v.id === variantParam)) {
        setSelectedVariantId(variantParam);
      }
    }
  }, [product.variants, hasVariants]);

  // Find slide index for variant
  const getVariantSlideIndex = useCallback(
    (variantId: string) => {
      const idx = (product.variants || []).findIndex((v) => v.id === variantId);
      return idx !== -1 ? idx + 1 : 0;
    },
    [product.variants]
  );

  // Handles variant select action
  const handleVariantSelect = (variantId: string) => {
    const isAlreadySelected = selectedVariantId === variantId;
    const nextVariantId = isAlreadySelected ? "" : variantId;
    setSelectedVariantId(nextVariantId);
    
    // Update URL parameter without reload
    if (typeof window !== "undefined") {
      const newUrl = nextVariantId
        ? `${window.location.pathname}?variant=${nextVariantId}`
        : window.location.pathname;
      window.history.replaceState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl
      );
    }

    // Scroll carousel to the variant's slide or overview (0)
    const slideIdx = nextVariantId ? getVariantSlideIndex(nextVariantId) : 0;
    if (carouselApi) {
      carouselApi.scrollTo(slideIdx);
    }
  };

  // Scroll to active variant slide when carousel API is ready
  useEffect(() => {
    if (!carouselApi) return;
    const slideIdx = selectedVariantId ? getVariantSlideIndex(selectedVariantId) : 0;
    
    if (carouselApi.selectedScrollSnap() !== slideIdx) {
      const timer = setTimeout(() => {
        carouselApi.scrollTo(slideIdx);
        setCurrentSlide(slideIdx);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [carouselApi, selectedVariantId, getVariantSlideIndex]);

  // Sync manual carousel scroll to variant select
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      const snapIndex = carouselApi.selectedScrollSnap();
      setCurrentSlide(snapIndex);

      if (product.variants) {
        if (snapIndex > 0) {
          // Slide index corresponds to a variant
          const variant = product.variants[snapIndex - 1];
          if (variant && variant.id !== selectedVariantId) {
            setSelectedVariantId(variant.id);
            
            // Update URL parameter
            if (typeof window !== "undefined") {
              const newUrl = `${window.location.pathname}?variant=${variant.id}`;
              window.history.replaceState(
                { ...window.history.state, as: newUrl, url: newUrl },
                "",
                newUrl
              );
            }
          }
        } else if (snapIndex === 0 && selectedVariantId !== "") {
          // Slide index is 0 (Overview) - clear selection and remove parameter
          setSelectedVariantId("");
          
          if (typeof window !== "undefined") {
            const newUrl = window.location.pathname;
            window.history.replaceState(
              { ...window.history.state, as: newUrl, url: newUrl },
              "",
              newUrl
            );
          }
        }
      }
    };

    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi, product.variants, selectedVariantId]);

  return (
    <div className="space-y-16">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        {/* LEFT COLUMN: Premium Image Carousel */}
        <MotionWrapper
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.5rem] border bg-muted/20 shadow-xl w-full"
        >
          <Carousel setApi={setCarouselApi} className="w-full h-full group/carousel">
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index} className="relative aspect-square w-full">
                  <SmartImage
                    src={slide.src}
                    alt={slide.alt}
                    useNextImage
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    containerClassName="h-full w-full"
                    className="object-cover"
                  />
                  
                  {/* Floating Overlay Size Indicator */}
                  <span className="absolute top-5 left-9 z-10 select-none pointer-events-none rounded-full bg-black/60 dark:bg-black/75 backdrop-blur-md px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white border border-white/10 shadow-lg">
                    {slide.label}
                  </span>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Carousel navigation controls */}
            {slides.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-full border border-white/10 bg-black/45 hover:bg-black/60 text-white hover:text-white backdrop-blur-xs transition-all opacity-0 group-hover/carousel:opacity-100 flex items-center justify-center cursor-pointer shadow-md hover:scale-105" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 size-10 rounded-full border border-white/10 bg-black/45 hover:bg-black/60 text-white hover:text-white backdrop-blur-xs transition-all opacity-0 group-hover/carousel:opacity-100 flex items-center justify-center cursor-pointer shadow-md hover:scale-105" />
              </>
            )}

            {/* Dot page indicators */}
            {slides.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-xs border border-white/5">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => carouselApi?.scrollTo(index)}
                    className={cn(
                      "size-2 rounded-full transition-all duration-300",
                      currentSlide === index ? "w-5 bg-primary" : "bg-white/40 hover:bg-white/70"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </Carousel>
        </MotionWrapper>

        {/* RIGHT COLUMN: Product details & Variant Select */}
        <MotionWrapper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="space-y-6 rounded-[2.5rem] border bg-background p-6 sm:p-8 lg:p-10 shadow-xl h-full flex flex-col justify-between"
        >
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
              {product.category}
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5.5xl text-balance transition-all duration-300">
              {displayName}
            </h1>

            <p className="text-3xl font-semibold bg-linear-to-r from-primary via-sky-500 to-cyan-400 bg-clip-text text-transparent w-fit transition-all duration-300">
              {displayPrice}
            </p>

            <p className="text-base leading-relaxed text-muted-foreground transition-all duration-300">
              {displayDescription}
            </p>

            {/* Size/Variant Selector Section */}
            {hasVariants && (
              <div className="pt-4 border-t border-border/50 space-y-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                  Select Option / Size
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.variants!.map((variant) => {
                    const isActive = variant.id === selectedVariantId;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => handleVariantSelect(variant.id)}
                        className={cn(
                          "relative flex flex-row items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-300 hover:scale-[1.01] cursor-pointer gap-4",
                          isActive
                            ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                            : "border-border bg-muted/10 hover:border-border/80 hover:bg-muted/20"
                        )}
                      >
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-sm font-bold tracking-wide truncate",
                              isActive ? "text-primary" : "text-foreground"
                            )}>
                              {variant.label}
                            </span>
                            {isActive && (
                              <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Check className="size-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-muted-foreground block">
                            {variant.price}
                          </span>
                        </div>
                        
                        {/* Variant Thumbnail Image */}
                        <div className="relative size-12 sm:size-14 shrink-0 overflow-hidden rounded-xl border border-white/10 dark:border-white/20 bg-muted/50">
                          <SmartImage
                            src={variant.image || product.image}
                            alt={`${variant.label} Thumbnail`}
                            useNextImage
                            fill
                            sizes="56px"
                            containerClassName="h-full w-full"
                            className="object-cover"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Financing Preview Footer */}
          {product.showFinancing === true && <FinancingOptionsPreview />}
        </MotionWrapper>
      </div>

      {/* COMPATIBILITY STAGES SECTION */}
      {hasStages && (
        <MotionWrapper
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-10 rounded-[2.5rem] border bg-card/50 backdrop-blur-xl p-6 sm:p-8 lg:p-12 shadow-2xl mt-12"
        >
          <div className="border-b border-border/60 pb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/80">
              Replacement Compatibility
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Filtration Stages
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Genuine replacement cartridges optimized for this configuration. 
              {activeSizeKey && (
                <span className="font-semibold text-primary">
                  {" "}Currently displaying compatible {activeSizeKey === "10" ? '10"' : '20"'} cartridges.
                </span>
              )}
            </p>
          </div>

          <FiltrationStagesTimeline
            stages={product.stages!}
            activeSizeKey={activeSizeKey}
            allProducts={allProducts}
          />
        </MotionWrapper>
      )}
    </div>
  );
}
