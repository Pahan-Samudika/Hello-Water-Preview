"use client";

import Link from "next/link";
import { Phone, MessageCircle, ArrowRightIcon } from "lucide-react";
import { MotionWrapper } from "@/components/custom/motion-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContactCTAProps {
  title?: string;
  description?: string;
  className?: string;
}

export function ContactCTA({
  title = "Cannot find the answer you are looking for?",
  description = "Our water specialists are here to provide expert advice tailored to your home's unique needs. Reach out to us directly for a personalized solution",
  className = "",
}: ContactCTAProps) {
  return (
    <MotionWrapper
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative rounded-3xl p-8 md:p-12 overflow-hidden border border-white/35 bg-white/35 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-white/5 text-center flex flex-col items-center",
        className
      )}
    >
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-foreground">
        {title}
      </h2>
      <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
        {description}
      </p>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full md:w-auto">
        <Button
          size="lg"
          className="w-full md:w-auto group relative overflow-hidden rounded-full px-8 text-base before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] dark:before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)]"
          render={<a href="tel:1300515469" />}
          nativeButton={false}
        >
          <Phone className="w-4 h-4 mr-2" />
          1300 515 469
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full md:w-auto rounded-full px-8 text-base"
          render={<Link href="/contact" />}
          nativeButton={false}
        >
          <MessageCircle className="w-4 h-4 mr-2 text-muted-foreground" />
          Contact Us
          <ArrowRightIcon className="w-4 h-4 ml-1.5 transition-transform group-hover/button:translate-x-1 text-muted-foreground" />
        </Button>
      </div>
    </MotionWrapper>
  );
}
