"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GATracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", "G-M3ZBJ1B7V8", {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname]);

  return null;
}
