"use client";

import { motion } from "framer-motion";
import { Ban, Clock, HeartPulse, Car, AlertTriangle, Scale, ArrowRight } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import { scrollToForm } from "@/utils/scroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const services = [
  { icon: Ban, title: "Claim Rejection", description: "Wrongfully denied claims reviewed and appealed by legal experts. We identify valid grounds and fight for your rightful settlement.", color: "bg-red-50 text-red-600", borderColor: "hover:border-red-200" },
  { icon: Clock, title: "Claim Delay", description: "Expedite delayed settlements through regulatory pressure and expert negotiation. No more waiting months for your money.", color: "bg-amber-50 text-amber-600", borderColor: "hover:border-amber-200" },
  { icon: HeartPulse, title: "Health Insurance Disputes", description: "Cashless claim denials, pre-existing condition disputes, and hospitalization disagreements resolved efficiently.", color: "bg-rose-50 text-rose-600", borderColor: "hover:border-rose-200" },
  { icon: Car, title: "Motor Insurance Claims", description: "Total loss disputes, third-party claim issues, and garage cashless problems handled with automotive expertise.", color: "bg-blue-50 text-blue-600", borderColor: "hover:border-blue-200" },
  { icon: AlertTriangle, title: "Mis-selling Complaints", description: "Policies sold under false pretenses, hidden terms, or pressure tactics. We help you get justice and refunds.", color: "bg-orange-50 text-orange-600", borderColor: "hover:border-orange-200" },
  { icon: Scale, title: "Short Settlement Issues", description: "Underpaid claims where insurers offer less than policy value. We calculate rightful amounts and negotiate fair payouts.", color: "bg-emerald-50 text-emerald-600", borderColor: "hover:border-emerald-200" },
];

export default function ServicesSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="services" className="bg-slate-50/50">
      <SectionHeader title="Insurance Problems We Solve" subtitle="From rejection to recovery, our experts handle every type of insurance dispute with proven strategies" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {services.map((service, index) => (
          <motion.div 
            key={service.title} 
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.1 }}
            whileHover={prefersReducedMotion ? undefined : { y: -6 }}
            className={`card-premium group cursor-pointer ${service.borderColor}`}
          >
            <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-5 transition-transform group-hover:scale-110`}>
              <service.icon className="w-7 h-7" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-700 transition-colors">{service.title}</h3>
            <p className="text-slate-600 leading-relaxed mb-5 text-sm md:text-base">{service.description}</p>
            <button 
              onClick={scrollToForm} 
              className="flex items-center text-primary-700 font-semibold text-sm group-hover:gap-3 gap-2 transition-all bg-transparent border-none p-0 cursor-pointer"
              aria-label={`Get help for ${service.title}`}
            >
              Get Help <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
