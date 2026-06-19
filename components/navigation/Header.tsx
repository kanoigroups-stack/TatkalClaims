"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollToForm } from "@/utils/scroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "How It Works" },
  { href: "#trust", label: "Why Us" },
  { href: "#testimonials", label: "Success Stories" },
  { href: "#faq", label: "FAQs" },
  { href: "/blog/", label: "Blog" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const isHomePage = pathname === "/" || pathname === "";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const handleNavClick = useCallback((href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("#") && isHomePage) {
      setTimeout(() => {
        const element = document.getElementById(href.replace("#", ""));
        if (element) {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }, 300);
    }
  }, [isHomePage]);

  const isActive = (href: string) => {
    if (href.startsWith("#")) return false;
    return pathname === href || pathname.startsWith(href.replace(/\/$/, ""));
  };

  const getHref = (href: string) => {
    if (href.startsWith("#")) {
      return isHomePage ? href : `/${href}`;
    }
    return href;
  };

  return (
    <>
      <motion.header
        initial={prefersReducedMotion ? { y: 0 } : { y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-100" 
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="container-main px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center group shrink-0" aria-label="Tatkal Claims Home">
              <img
                src="/logo.png"
                alt="Tatkal Claims"
                className="h-11 w-auto object-contain"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const href = getHref(link.href);
                return (
                  <Link
                    key={link.href}
                    href={href}
                    className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                      active ? "text-primary-700 font-semibold" : "text-slate-700"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <a 
                href="tel:+919321152524" 
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-primary-700 transition-colors"
                aria-label="Call us at +91 9321152524"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>Call Us</span>
              </a>
              <button 
                type="button" 
                onClick={() => {
                  if (!isHomePage) {
                    window.location.href = "/#contact-form";
                  } else {
                    scrollToForm();
                  }
                }} 
                className="btn-primary text-sm py-2.5 px-5"
                aria-label="Submit your case"
              >
                Submit Case
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors relative z-[10000]"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-slate-800" aria-hidden="true" /> : <Menu className="w-6 h-6 text-slate-800" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] bg-white pt-24 px-6 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const href = getHref(link.href);
                return (
                  <Link
                    key={link.href}
                    href={href}
                    onClick={() => handleNavClick(link.href)}
                    className={`text-lg font-medium py-3 border-b border-slate-100 ${
                      active ? "text-primary-700 font-semibold" : "text-slate-800"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <button 
                type="button" 
                onClick={() => { 
                  setIsMobileMenuOpen(false); 
                  if (!isHomePage) {
                    window.location.href = "/#contact-form";
                  } else {
                    scrollToForm();
                  }
                }} 
                className="btn-primary mt-4 text-center w-full"
                aria-label="Submit your case"
              >
                Submit Your Case
              </button>
              <a 
                href="tel:+919321152524" 
                className="flex items-center justify-center gap-2 text-primary-700 font-medium mt-2"
                aria-label="Call our experts"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call: +91 9321152524
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
