"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { scrollToForm } from "@/utils/scroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function CTABannerSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
        className="container-main"
      >
        <div className="relative bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 rounded-3xl p-8 md:p-16 overflow-hidden text-center md:text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-500/10 rounded-full translate-y-1/2 -translate-x-1/4" aria-hidden="true" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Facing an Insurance Claim Issue?</h2>
              <p className="text-lg md:text-xl text-primary-100 leading-relaxed">Don't let insurers deny what is rightfully yours. Our experts have recovered ₹20+ Crores for policyholders just like you.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <button 
                type="button" 
                onClick={scrollToForm} 
                className="btn-accent text-base px-8 py-4 group"
                aria-label="Submit your case for evaluation"
              >
                Submit Your Case Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
              <a 
                href="tel:+919321152524" 
                className="inline-flex items-center justify-center px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20"
                aria-label="Call our insurance experts"
              >
                <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
                Call Experts
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
