"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function TawkMessenger() {
  const PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
  const WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;
  const pathname = usePathname();

  useEffect(() => {
    // If on admin routes, hide the widget and skip loading
    if (pathname.startsWith("/admin")) {
      const tawkApi = window.Tawk_API as any;
      if (tawkApi && typeof tawkApi.hideWidget === "function") {
        try {
          tawkApi.hideWidget();
        } catch (e) {
          console.error("Error hiding Tawk widget:", e);
        }
      }
      return;
    }

    // Restore widget visibility if returning to public routes
    const tawkApi = window.Tawk_API as any;
    if (tawkApi && typeof tawkApi.showWidget === "function") {
      try {
        tawkApi.showWidget();
      } catch (e) {
        console.error("Error showing Tawk widget:", e);
      }
    }

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
  }, [PROPERTY_ID, WIDGET_ID, pathname]);

  return null;
}
