"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeader from "../ui/SectionHeader";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const faqs = [
  { question: "How long does the claim resolution process take?", answer: "The timeline varies based on complexity. Company-level resolutions typically take 30-60 days. Ombudsman cases average 3-6 months. Legal proceedings may take 6-12 months. We provide realistic timelines upfront and push for the fastest possible resolution." },
  { question: "What documents are required to start my case?", answer: "Typically we need: (1) Policy document, (2) Claim rejection/demand letter, (3) Premium payment receipts, (4) Medical records (for health claims), (5) FIR/accident report (for motor claims), and (6) All correspondence with the insurer. Don't worry if you're missing some — we help you obtain them." },
  { question: "What are your fees? Do I pay upfront?", answer: "We operate on a transparent fixed fee model based on case complexity. You pay once we begin working on your case. No hidden charges or surprises. We also offer a free initial case evaluation." },
  { question: "Do you handle all insurance companies and types?", answer: "Yes. We handle disputes with all IRDAI-registered insurers including LIC, HDFC Life, ICICI Prudential, Star Health, ICICI Lombard, Bajaj Allianz, and 50+ others. We cover Life, Health, Motor, Home, Travel, and General Insurance." },
  { question: "What if my claim was rejected years ago?", answer: "You can approach the Insurance Ombudsman within 1 year of the insurer's final response. For consumer courts, the limitation is 2 years. Even if time has passed, we can explore condonation of delay or alternative remedies. Always worth a consultation." },
  { question: "Is my information secure and confidential?", answer: "Absolutely. We use bank-grade encryption for document transfer and storage. Your information is never shared with third parties without consent. Our legal team operates under strict attorney-client privilege standards." },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const prefersReducedMotion = useReducedMotion();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <SectionWrapper id="faq" className="bg-slate-50/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SectionHeader title="Frequently Asked Questions" subtitle="Everything you need to know about our claim resolution process" />
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : index * 0.08 }} 
            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            <button 
              onClick={() => setOpenIndex(openIndex === index ? null : index)} 
              className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-slate-50 transition-colors"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
              id={`faq-question-${index}`}
            >
              <div className="flex items-center gap-3 pr-4">
                <HelpCircle className="w-5 h-5 text-primary-600 flex-shrink-0" aria-hidden="true" />
                <span className="font-semibold text-slate-900">{faq.question}</span>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} 
                aria-hidden="true" 
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }} 
                  transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: "easeInOut" }}
                >
                  <div 
                    id={`faq-answer-${index}`} 
                    role="region" 
                    aria-labelledby={`faq-question-${index}`}
                    className="px-5 md:px-6 pb-5 md:pb-6 pl-14"
                  >
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
