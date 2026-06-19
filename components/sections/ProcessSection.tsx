"use client";

import { motion } from "framer-motion";
import { FileText, Upload, Search, Gavel, BadgeCheck } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const steps = [
  { icon: FileText, title: "Submit Case", description: "Share your claim details and policy information through our secure portal or WhatsApp." },
  { icon: Upload, title: "Share Documents", description: "Upload rejection letters, policy documents, and correspondence for expert review." },
  { icon: Search, title: "Expert Evaluation", description: "Our legal and insurance specialists analyze your case viability and strategy." },
  { icon: Gavel, title: "Case Filing", description: "We draft complaints, approach insurers, ombudsman, or courts on your behalf." },
  { icon: BadgeCheck, title: "Claim Resolution", description: "Receive your rightful settlement. Transparent fixed fees based on case complexity." },
];

export default function ProcessSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="process">
      <SectionHeader title="How Our Claim Resolution Works" subtitle="A transparent, 5-step process designed to maximize your chances of recovery" />
      <div className="relative">
        <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-accent-300" aria-hidden="true" />
        <div className="grid md:grid-cols-5 gap-8 md:gap-4 relative">
          {steps.map((step, index) => (
            <motion.div 
              key={step.title} 
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-card border-2 border-primary-100 flex items-center justify-center relative z-10">
                  <step.icon className="w-8 h-8 text-primary-700" aria-hidden="true" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg z-20" aria-hidden="true">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-[200px]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
