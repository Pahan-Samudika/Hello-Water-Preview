"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";

export function TrustindexTestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const lightScriptSrc = process.env.NEXT_PUBLIC_TRUSTINDEX_TESTIMONIALS_LIGHT_SCRIPT_SRC;
  const darkScriptSrc = process.env.NEXT_PUBLIC_TRUSTINDEX_TESTIMONIALS_DARK_SCRIPT_SRC;

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !lightScriptSrc || !darkScriptSrc) {
      return;
    }

    const scriptSrc =
      resolvedTheme === "dark" ? darkScriptSrc : lightScriptSrc;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.defer = true;

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [darkScriptSrc, lightScriptSrc, resolvedTheme]);

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 px-6 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:px-6 lg:px-8 ">
        <motion.div
          className="flex flex-col gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
          }}
        >
          <motion.div
            className="space-y-3"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
            }}
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance text-left">
              What Customers Say <span className="bg-linear-to-r from-primary via-sky-500 to-cyan-400 bg-clip-text text-transparent">About Us</span>
            </h2>
            <p className='text-muted-foreground text-sm sm:text-lg'>
              See why thousands of Australians trust Hello Water for their daily hydration and pure water needs.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: 0.15 }}
        >
          {lightScriptSrc && darkScriptSrc ? (
            <div ref={containerRef} />
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Trustindex testimonials widget is not configured.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
