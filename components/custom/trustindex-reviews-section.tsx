"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function TrustindexReviewsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const lightScriptSrc = process.env.NEXT_PUBLIC_TRUSTINDEX_LIGHT_SCRIPT_SRC;
  const darkScriptSrc = process.env.NEXT_PUBLIC_TRUSTINDEX_DARK_SCRIPT_SRC;

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
    <section className="relative overflow-hidden px-6 py-16 sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-center">
          <div className="flex justify-center">
						<div className="rounded-lg border px-4 py-1">Ratings & Reviews</div>
					</div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Satisfaction in Every Drop
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
               Discover why our customers love Hello Water and how we deliver pure, refreshing hydration with every sip.
            </p>
          </div>
        </div>

        <div>
          {lightScriptSrc && darkScriptSrc ? (
            <div ref={containerRef} />
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Trustindex widget is not configured. Add
              `NEXT_PUBLIC_TRUSTINDEX_LIGHT_SCRIPT_SRC` and
              `NEXT_PUBLIC_TRUSTINDEX_DARK_SCRIPT_SRC` to your environment.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
