"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_MEASUREMENT_ID = "G-M3ZBJ1B7V8";
const GA_READY_TIMEOUT_MS = 5000;
const GA_RETRY_INTERVAL_MS = 50;

export default function GATracker() {
  const pathname = usePathname();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const trackPageView = () => {
      if (!window.gtag) return false;

      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });

      return true;
    };

    if (trackPageView()) return;

    intervalId = setInterval(() => {
      if (trackPageView()) {
        if (intervalId) clearInterval(intervalId);
        if (timeoutId) clearTimeout(timeoutId);
      }
    }, GA_RETRY_INTERVAL_MS);

    timeoutId = setTimeout(() => {
      if (intervalId) clearInterval(intervalId);
    }, GA_READY_TIMEOUT_MS);

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
}
