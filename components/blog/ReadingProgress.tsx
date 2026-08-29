"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function ReadingProgress({
  targetId = "article-content",
}: {
  targetId?: string;
}) {
  const [width, setWidth] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const target = document.getElementById(targetId);
      if (!target) {
        setWidth(0);
        return;
      }

      const start =
        target.getBoundingClientRect().top + window.scrollY;
      const articleHeight = target.offsetHeight;
      const finish = Math.max(
        start + articleHeight - window.innerHeight,
        start + 1
      );
      const progress = ((window.scrollY - start) / (finish - start)) * 100;

      setWidth(Math.min(100, Math.max(0, progress)));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [targetId]);

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-20 z-[80] h-1 bg-primary-100"
      role="progressbar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Article reading progress"
    >
      <div
        className={
          "h-full bg-accent-500 " +
          (prefersReducedMotion ? "" : "transition-all duration-150")
        }
        style={{ width: width + "%" }}
      />
    </div>
  );
}
