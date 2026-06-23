"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Clock, Users, Award, ChevronRight, Languages } from "lucide-react";
import LeadCaptureForm from "../forms/LeadCaptureForm";
import { scrollToForm } from "@/utils/scroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useState, useEffect } from "react";

const trustBadges = [
  { icon: ShieldCheck, label: "100% Secure" },
  { icon: Clock, label: "24/7 Support" },
  { icon: Users, label: "500+ Helped" },
  { icon: Award, label: "Expert Team" },
];

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const [translateReady, setTranslateReady] = useState(false);

  useEffect(() => {
    const checkReady = () => {
      const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (select) {
        setTranslateReady(true);
        return true;
      }
      return false;
    };

    if (checkReady()) return;

    const interval = setInterval(() => {
      if (checkReady()) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleTranslateToHindi = () => {
    const tryTranslate = () => {
      const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (select) {
        select.value = "hi";
        select.dispatchEvent(new Event("change"));
        return true;
      }
      return false;
    };

    if (tryTranslate()) return;

    let attempts = 0;
    const retry = setInterval(() => {
      attempts++;
      if (tryTranslate() || attempts >= 30) {
        clearInterval(retry);
      }
    }, 100);
  };

  return (
    <section id="contact" className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50/30 -z-10" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 -z-10" />
      <div 
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxRTNBOEEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMzQgMzZoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-60 -z-10" 
        aria-hidden="true"
      />
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div 
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            {/* Translate to Hindi Button - Prominent */}
            <motion.button
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleTranslateToHindi}
              disabled={!translateReady}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 transition-all duration-200 ${
                translateReady
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
              aria-label="Translate this page to Hindi"
            >
              <Languages className="w-4 h-4" aria-hidden="true" />
              <span>हिंदी में पढ़ें</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Translate to Hindi</span>
            </motion.button>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-semibold mb-6">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              India's Most Trusted Insurance Dispute Resolution Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.1] mb-6 text-balance">
              Resolve Your Insurance Claim <span className="gradient-text">Disputes With Experts</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-xl">
              Helping policyholders recover their rightful insurance claims through professional dispute resolution. From rejection to recovery, we handle it all.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                type="button" 
                onClick={scrollToForm} 
                className="btn-primary text-base group"
                aria-label="Submit your insurance complaint"
              >
                Submit Your Complaint
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
              <a 
                href="#process" 
                className="btn-secondary text-base group"
                aria-label="Learn how our process works"
              >
                How It Works
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </a>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6">
              {trustBadges.map((badge, index) => (
                <motion.div 
                  key={badge.label} 
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: prefersReducedMotion ? 0 : 0.5 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600"
                >
                  <div className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center">
                    <badge.icon className="w-4 h-4 text-primary-700" aria-hidden="true" />
                  </div>
                  {badge.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
          <div id="contact-form" tabIndex={-1} className="lg:justify-self-end w-full max-w-md scroll-mt-24">
            <LeadCaptureForm />
          </div>
        </div>
      </div>
    </section>
  );
}
