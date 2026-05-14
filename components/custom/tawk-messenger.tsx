"use client";

import { useEffect } from "react";

export default function TawkMessenger() {
  const PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
  const WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;

  useEffect(() => {
    if (!PROPERTY_ID || !WIDGET_ID || document.getElementById("tawk-script")) {
      return;
    }

    let loaded = false;

    const loadTawk = () => {
      if (loaded || document.getElementById("tawk-script")) {
        return;
      }

      loaded = true;
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      const script = document.createElement("script");
      script.id = "tawk-script";
      script.async = true;
      script.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");
      document.body.appendChild(script);
    };

    const timeout = window.setTimeout(loadTawk, 8000);
    const events = ["pointerdown", "keydown", "touchstart", "scroll"];

    events.forEach((event) => {
      window.addEventListener(event, loadTawk, { once: true, passive: true });
    });

    return () => {
      window.clearTimeout(timeout);
      events.forEach((event) => {
        window.removeEventListener(event, loadTawk);
      });
    };
  }, [PROPERTY_ID, WIDGET_ID]);

  return null;
}
