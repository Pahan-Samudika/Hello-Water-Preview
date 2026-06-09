"use client";

import * as React from "react";
import Script from "next/script";
import { useTheme } from "next-themes";

export interface ReCAPTCHARef {
  reset: () => void;
  getValue: () => string;
}

interface ReCAPTCHAProps {
  sitekey: string;
  onChange: (token: string | null) => void;
}

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: string | HTMLElement,
        parameters: {
          sitekey: string;
          theme?: "light" | "dark";
          size?: "normal" | "compact";
          tabindex?: number;
          callback?: (response: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
    onRecaptchaLoad?: () => void;
  }
}

export const ReCAPTCHA = React.forwardRef<ReCAPTCHARef, ReCAPTCHAProps>(
  ({ sitekey, onChange }, ref) => {
    const { resolvedTheme } = useTheme();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const widgetIdRef = React.useRef<number | null>(null);
    const [mounted, setMounted] = React.useState(false);

    // Avoid Next.js hydration mismatches by rendering recaptcha elements only on the client side
    React.useEffect(() => {
      setMounted(true);
    }, []);

    const theme = resolvedTheme === "dark" ? "dark" : "light";

    React.useEffect(() => {
      if (!mounted) return;

      if (!sitekey) {
        console.warn("reCAPTCHA sitekey is missing. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your env.");
        return;
      }

      let active = true;

      const renderRecaptcha = () => {
        if (!containerRef.current || !window.grecaptcha) return;

        try {
          // Clear previous contents to prevent multiple rendering widgets
          containerRef.current.innerHTML = "";
          const div = document.createElement("div");
          containerRef.current.appendChild(div);

          const widgetId = window.grecaptcha.render(div, {
            sitekey,
            theme,
            callback: (token) => {
              if (active) onChange(token);
            },
            "expired-callback": () => {
              if (active) onChange(null);
            },
            "error-callback": () => {
              if (active) onChange(null);
            },
          });
          widgetIdRef.current = widgetId;
        } catch (error) {
          console.error("Error rendering reCAPTCHA:", error);
        }
      };

      if (window.grecaptcha) {
        renderRecaptcha();
      } else {
        if (!window.onRecaptchaLoad) {
          window.onRecaptchaLoad = () => {
            window.dispatchEvent(new Event("recaptcha-loaded"));
          };
        }

        const handleLoaded = () => {
          if (active) renderRecaptcha();
        };

        window.addEventListener("recaptcha-loaded", handleLoaded);

        const checkInterval = setInterval(() => {
          if (window.grecaptcha) {
            clearInterval(checkInterval);
            if (active) renderRecaptcha();
          }
        }, 150);

        return () => {
          active = false;
          window.removeEventListener("recaptcha-loaded", handleLoaded);
          clearInterval(checkInterval);
        };
      }

      return () => {
        active = false;
      };
    }, [mounted, sitekey, theme, onChange]);

    React.useImperativeHandle(ref, () => ({
      reset: () => {
        if (window.grecaptcha && widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current);
          onChange(null);
        }
      },
      getValue: () => {
        if (window.grecaptcha && widgetIdRef.current !== null) {
          return window.grecaptcha.getResponse(widgetIdRef.current);
        }
        return "";
      },
    }));

    if (!mounted) {
      return (
        <div className="flex justify-center my-3 min-h-[78px]">
          <div className="w-[304px] h-[78px] bg-muted/20 animate-pulse rounded-lg border border-border/10" />
        </div>
      );
    }

    return (
      <div className="flex justify-center my-3 min-h-[78px]">
        <div ref={containerRef} className="w-[304px] h-[78px]" />
        <Script
          src="https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
          strategy="afterInteractive"
        />
      </div>
    );
  }
);

ReCAPTCHA.displayName = "ReCAPTCHA";
