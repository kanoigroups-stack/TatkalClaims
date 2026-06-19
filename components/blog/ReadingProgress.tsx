"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function ReadingProgress() {
  const [width, setWidth] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setWidth(Math.min(progress, 100));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-1 bg-primary-100 z-50" 
      role="progressbar" 
      aria-valuenow={Math.round(width)} 
      aria-valuemin={0} 
      aria-valuemax={100} 
      aria-label="Reading progress"
    >
      <div
        className={`h-full bg-accent-500 ${prefersReducedMotion ? "" : "transition-all duration-150"}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
