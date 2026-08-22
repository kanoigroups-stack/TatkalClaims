"use client";

import { ArrowRight, ShieldCheck, Clock, Users, Award, ChevronRight } from "lucide-react";
import LeadCaptureForm from "../forms/LeadCaptureForm";
import { scrollToForm } from "@/utils/scroll";

const trustBadges = [
  { icon: ShieldCheck, label: "100% Secure" },
  { icon: Clock, label: "24/7 Support" },
  { icon: Users, label: "500+ Helped" },
  { icon: Award, label: "Expert Team" },
];

export default function HeroSection() {
  return (
    <section id="contact" className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50/30 -z-10" />
      
      {/* Decorative blobs — hidden on mobile/tablet, shown on lg+ with reduced opacity */}
      <div className="hidden lg:block absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 -z-10 pointer-events-none" />
      <div className="hidden lg:block absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 -z-10 pointer-events-none" />
      
      {/* Dot pattern */}
      <div 
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxRTNBOEEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMzQgMzZoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-60 -z-10 pointer-events-none" 
        aria-hidden="true"
      />
      
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* 
            CRITICAL: Plain div instead of motion.div.
            Framer Motion leaves stale GPU layers after anchor navigation.
            CSS animation handles the entrance instead.
          */}
          <div className="max-w-2xl hero-enter">
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
              {trustBadges.map((badge) => (
                <div 
                  key={badge.label} 
                  className="flex items-center gap-2 text-sm font-medium text-slate-600"
                >
                  <div className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center">
                    <badge.icon className="w-4 h-4 text-primary-700" aria-hidden="true" />
                  </div>
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
          
          <div id="contact-form" tabIndex={-1} className="lg:justify-self-end w-full max-w-md scroll-mt-24">
            <LeadCaptureForm />
          </div>
        </div>
      </div>
    </section>
  );
}
