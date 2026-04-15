"use client";

import { useState, useRef, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface SmartImageProps extends Omit<ImageProps, "onLoad" | "src"> {
  src: string | any;
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
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  useEffect(() => {
    // Check if image is already cached/loaded
    if (imgRef.current?.complete) {
      handleLoad();
    }
  }, []);

  // Determine the actual src string
  const imageSrc = typeof src === "string" ? src : src?.src;

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
        initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
        animate={{ 
          opacity: isLoading ? 0 : 1,
          scale: isLoading ? 1.05 : 1,
          filter: isLoading ? "blur(10px)" : "blur(0px)"
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full"
      >
        {useNextImage ? (
          <Image
            src={src}
            alt={alt}
            className={className}
            onLoad={handleLoad}
            onError={handleError}
            {...(props as any)}
          />
        ) : (
          <img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            className={cn("h-full w-full", className, hasError && "opacity-0")}
            onLoad={handleLoad}
            onError={handleError}
            {...(props as any)}
          />
        )}
      </motion.div>
    </div>
  );
}
