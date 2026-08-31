"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "";

  useEffect(() => { 
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const footer = document.querySelector("footer");
      const isMobileViewport = window.matchMedia("(max-width: 1023px)").matches;
      const articleAdsActive =
        document.body.dataset.articleAdsActive === "true";

      if (!isMobileViewport) {
        setIsVisible(false);
        document.body.classList.remove("pb-24");
        return;
      }

      if (articleAdsActive) {
        setIsVisible(false);
        document.body.classList.remove("pb-24");
        return;
      }

      // Hide CTA when near footer (within 200px of footer)
      let nearFooter = false;
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        nearFooter = footerRect.top < window.innerHeight + 200;
      }

      // Show CTA when scrolled past 600px and not near footer
      const shouldShow = scrollY > 600 && !nearFooter;
      setIsVisible(shouldShow);

      // Add/remove padding to body to prevent footer content from being hidden
      if (shouldShow) {
        document.body.classList.add("pb-24");
      } else {
        document.body.classList.remove("pb-24");
      }
    }; 

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      document.body.classList.remove("pb-24");
    }; 
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={prefersReducedMotion ? { opacity: 1 } : { y: 100 }}
          animate={{ y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }} 
          className="tc-sticky-mobile-cta fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-200 p-4 shadow-lg lg:hidden"
        >
          <Link 
            href={isHomePage ? "#contact-form" : "/#contact-form"}
            className="btn-primary w-full text-base py-3.5 group flex items-center justify-center"
            aria-label="Get Free Case Evaluation"
            onClick={(e) => {
              if (isHomePage) {
                e.preventDefault();
                const formContainer = document.getElementById("contact-form");
                if (formContainer) {
                  // Scroll with 100px offset to account for sticky header
                  const headerOffset = 100;
                  const elementPosition = formContainer.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.scrollY - headerOffset;
                  window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                  setTimeout(() => {
                    const nameInput = formContainer.querySelector('input[type="text"]') as HTMLInputElement | null;
                    nameInput?.focus();
                  }, 800);
                }
              }
            }}
          >
            Get Free Case Evaluation
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
