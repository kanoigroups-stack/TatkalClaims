"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const testimonials = [
  { name: "Ravi Anjania", location: "Mumbai, Maharashtra", claimType: "Health Insurance Rejection", rating: 5, text: "My daughter's cancer claim was rejected citing a pre-existing condition. Tatkal Claims team found a loophole in the insurer's reasoning and got us ₹8.5 lakhs within 3 months. Life-changing!" },
  { name: "Suryakant Sharma", location: "Ponda, Goa", claimType: "Motor Total Loss", rating: 5, text: "After my car accident, the insurance offered only 60% of the value. The Tatkal Claims experts negotiated and I received 95% of the insured amount. Professional, responsive, and truly caring." },
  { name: "Nidhi Bajaj", location: "Kolkata, West Bengal", claimType: "Mis-sold ULIP Policy", rating: 5, text: "I was sold a policy as a 'fixed deposit' by my bank. Tatkal Claims helped me file a complaint with IRDAI and recover my entire premium of ₹5 lakhs plus interest. Highly recommended!" },
  { name: "Dr. Rajeev Agarwal", location: "Thane, Maharashtra", claimType: "Claim Delay - 8 Months", rating: 4, text: "My home insurance claim was stuck for 8 months. Within 2 weeks of hiring Tatkal Claims, the insurer released ₹12 lakhs. Their regulatory pressure approach works wonders." },
];

const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Tatkal Claims Insurance Dispute Resolution",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.6",
    bestRating: "5",
    ratingCount: "250",
    reviewCount: "250",
  },
};

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(goNext, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goNext, isPaused]);

  return (
    <SectionWrapper id="testimonials" className="bg-slate-50/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <SectionHeader title="Success Stories From Real Clients" subtitle="Join thousands of policyholders who recovered their rightful claims" />
      <div 
        className="max-w-4xl mx-auto relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <button 
          onClick={goPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-50 transition-colors z-10"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6 text-primary-800" aria-hidden="true" />
        </button>
        <button 
          onClick={goNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-50 transition-colors z-10"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6 text-primary-800" aria-hidden="true" />
        </button>
        <div 
          className="relative bg-white rounded-3xl shadow-card p-8 md:p-12 min-h-[400px] flex items-center"
          aria-live="polite"
          aria-atomic="true"
        >
          <Quote className="absolute top-8 right-8 w-16 h-16 text-primary-100" aria-hidden="true" />
          <AnimatePresence mode="wait">
            <motion.div 
              key={current} 
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
              className="w-full"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary-800 flex items-center justify-center ring-4 ring-primary-100">
                    <span className="text-white text-2xl font-bold" aria-hidden="true">
                      {testimonials[current].name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    {testimonials[current].claimType}
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h4 className="text-xl font-bold text-slate-900">{testimonials[current].name}</h4>
                  <p className="text-slate-500 text-sm">{testimonials[current].location}</p>
                  <div role="img" aria-label={`Rating: ${testimonials[current].rating} out of 5 stars`} className="flex items-center gap-1 mt-2 justify-center md:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < testimonials[current].rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} 
                        aria-hidden="true" 
                      />
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="text-lg md:text-xl text-slate-700 leading-relaxed italic text-center md:text-left">
                "{testimonials[current].text}"
              </blockquote>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Testimonial navigation">
          {testimonials.map((_, index) => (
            <button 
              key={index} 
              onClick={() => setCurrent(index)} 
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === current ? "bg-primary-700 w-8" : "bg-slate-300 hover:bg-slate-400"}`}
              role="tab"
              aria-selected={index === current}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
