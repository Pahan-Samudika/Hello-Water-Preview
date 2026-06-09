"use client";

import * as React from "react";
import Script from "next/script";

interface ReCAPTCHAProps {
  sitekey: string;
}

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export function ReCAPTCHA({ sitekey }: ReCAPTCHAProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !sitekey) return null;

  return (
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${sitekey}`}
      strategy="afterInteractive"
    />
  );
}
