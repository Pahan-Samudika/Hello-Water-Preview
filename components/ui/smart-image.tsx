"use client";

import { useState, type ImgHTMLAttributes } from "react";
import Image, { ImageProps, type StaticImageData } from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import placeholderImage from "@/assets/placeholders/image.webp";

interface SmartImageProps extends Omit<ImageProps, "onLoad" | "src"> {
  src: string | StaticImageData;
  alt: string;
  useNextImage?: boolean;
  containerClassName?: string;
  className?: string;
  onLoad?: () => void;
}

/**
 * A professional image component that shows a loading spinner until the image is fully loaded.
 * It also applies a smooth fade-in & blur-out transition once ready.
 */
export function SmartImage({
  src,
  alt,
  className,
  containerClassName,
  useNextImage = false, // Default to false to ease migration from <img>
  onLoad,
  ...props
}: SmartImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Determine the final source to use, ensuring we have a valid fallback
  const finalSrc = src || placeholderImage;
  const imageSrc = typeof finalSrc === "string" ? finalSrc : finalSrc.src;
  const fallbackSrc = placeholderImage.src;
  const handleImageRef = (node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0 && isLoading) {
      queueMicrotask(handleLoad);
    }
  };

  return (
    <div className={cn("relative overflow-hidden group/image w-full", containerClassName)}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-muted/5 backdrop-blur-[2px]"
          >
            <Spinner className="size-8 text-primary/60" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ 
          opacity: 1,
          scale: 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="h-full w-full"
      >
        {useNextImage ? (
          <Image
            src={finalSrc}
            alt={alt}
            className={className}
            onLoad={handleLoad}
            onError={() => {
              // Handle next/image errors by setting hasError
              setHasError(true);
              handleError();
            }}
            {...props}
          />
        ) : (
          <img
            ref={handleImageRef}
            src={imageSrc}
            alt={alt}
            className={cn("h-full w-full", className, hasError && "opacity-0")}
            onLoad={handleLoad}
            onError={(e) => {
              // Show placeholder on error
              const target = e.currentTarget;
              if (target.src !== fallbackSrc) {
                target.src = fallbackSrc;
                setHasError(false);
                setIsLoading(true);
              } else {
                handleError();
              }
            }}
            {...(props as ImgHTMLAttributes<HTMLImageElement>)}
          />
        )}
      </motion.div>
    </div>
  );
}
