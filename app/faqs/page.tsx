"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  X,
  MessageSquare,
  Phone,
  HelpCircle,
} from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

const categories = [
  "All",
  "General",
  "Process",
  "Fees",
  "Health Insurance",
  "Motor Insurance",
  "Legal",
];

const faqs = [
  {
    category: "General",
    question: "How long does the claim resolution process take?",
    answer:
      "The timeline varies based on complexity. Company-level resolutions typically take 30-60 days. Ombudsman cases average 3-6 months. Legal proceedings may take 6-12 months. We provide realistic timelines upfront and push for the fastest possible resolution.",
  },
  {
    category: "General",
    question: "What documents are required to start my case?",
    answer:
      "Typically we need: (1) Policy document, (2) Claim rejection/demand letter, (3) Premium payment receipts, (4) Medical records (for health claims), (5) FIR/accident report (for motor claims), and (6) All correspondence with the insurer. Don't worry if you're missing some — we help you obtain them.",
  },
  {
    category: "Fees",
    question: "What are your fees? Do I pay upfront?",
    answer:
      "We operate on a transparent fixed fee model based on case complexity. You pay once we begin working on your case. No hidden charges or surprises. We also offer a free initial case evaluation.",
  },
  {
    category: "General",
    question: "Do you handle all insurance companies and types?",
    answer:
      "Yes. We handle disputes with all IRDAI-registered insurers including LIC, HDFC Life, ICICI Prudential, Star Health, ICICI Lombard, Bajaj Allianz, and 50+ others. We cover Life, Health, Motor, Home, Travel, and General Insurance.",
  },
  {
    category: "Legal",
    question: "What if my claim was rejected years ago?",
    answer:
      "You can approach the Insurance Ombudsman within 1 year of the insurer's final response. For consumer courts, the limitation is 2 years. Even if time has passed, we can explore condonation of delay or alternative remedies. Always worth a consultation.",
  },
  {
    category: "General",
    question: "Is my information secure and confidential?",
    answer:
      "Absolutely. We use bank-grade encryption for document transfer and storage. Your information is never shared with third parties without consent. Our claims team operates under strict professional confidentiality standards.",
  },
  {
    category: "Process",
    question: "How do I track the progress of my case?",
    answer:
      "Every client gets a dedicated case manager who provides regular updates via WhatsApp, email, or phone. You can also request status updates anytime. We believe in complete transparency throughout the process.",
  },
  {
    category: "Health Insurance",
    question: "My cashless claim was denied at the hospital. What should I do?",
    answer:
      "First, get the denial reason in writing from the TPA/insurer. Then file for reimbursement immediately to preserve your rights. Simultaneously, contact us to challenge the cashless denial — many are overturned on appeal.",
  },
  {
    category: "Health Insurance",
    question: "Can the insurer reject my claim for a pre-existing disease?",
    answer:
      "Only if the disease was existing before policy purchase AND you failed to disclose it. If the policy has completed the waiting period (typically 2-4 years), the claim must be honored. We challenge wrongful PED rejections regularly.",
  },
  {
    category: "Motor Insurance",
    question: "The insurer is offering much less than my car's IDV. Can I challenge this?",
    answer:
      "Absolutely. IDV should reflect the market value of your vehicle. We use independent valuation reports and IRDAI guidelines to challenge lowball IDV offers and secure fair settlements.",
  },
  {
    category: "Motor Insurance",
    question: "Can I choose my own garage for repairs?",
    answer:
      "For cashless claims, you must use a network garage. If none is satisfactory, you can opt for reimbursement and choose any garage. We help you navigate both options.",
  },
  {
    category: "Fees",
    question: "Do you charge for the initial consultation?",
    answer:
      "No. The initial case evaluation is completely free. We assess your case viability, explain your options, and provide a fee quote — all without any obligation.",
  },
  {
    category: "Legal",
    question: "Will I have to go to court?",
    answer:
      "In most cases, no. Over 70% of our cases are resolved at the insurer or Ombudsman level. We only recommend court proceedings if other avenues are exhausted and the claim amount justifies it.",
  },
  {
    category: "Process",
    question: "Can I handle the dispute myself without your help?",
    answer:
      "You can, but insurance disputes involve complex claims and regulatory nuances. Insurers have dedicated teams. Having professional representation significantly improves your chances of success and often results in higher settlements.",
  },
];

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // FIX: Scroll to top of FAQ section when category changes
  useEffect(() => {
    const faqSection = document.getElementById("faq-accordion");
    if (faqSection) {
      const offset = 100; // Account for sticky header
      const top = faqSection.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
    // Reset open accordion when switching categories
    setOpenIndex(0);
  }, [activeCategory]);

  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Hero — White background, homepage theme */}
      <section className="bg-white text-slate-900 py-16 md:py-24 px-4 border-b border-slate-200">
        <div className="container-main max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-slate-500">
              <li>
                <Link href="/" className="hover:text-blue-900 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-slate-900 font-medium">
                FAQs
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Frequently Asked{" "}
              <span className="text-blue-700">Questions</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl">
              Everything you need to know about our claim resolution process,
              fees, and how we can help you recover your rightful insurance
              settlement.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30">
        <div className="container-main px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-blue-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <SectionWrapper className="bg-slate-50/50" id="faq-accordion">
        <div className="max-w-3xl mx-auto">
          {filteredFaqs.length > 0 ? (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const globalIndex = faqs.indexOf(faq);
                const isOpen = openIndex === globalIndex;

                return (
                  <div
                    key={globalIndex}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setOpenIndex(isOpen ? null : globalIndex)
                      }
                      className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                        <span className="font-semibold text-slate-900 pr-4">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 pl-14">
                        <p className="text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <HelpCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No matching questions
              </h3>
              <p className="text-slate-500 mb-4">
                Try a different search term or category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="text-blue-700 font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* Still Have Questions — White background, homepage theme */}
      <section className="py-16 md:py-20 px-4 bg-white border-t border-slate-200">
        <div className="container-main max-w-4xl mx-auto">
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Still Have Questions?
            </h2>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto">
              Our experts are available to answer your specific questions. Reach
              out via WhatsApp or phone for a quick response.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/917207382073"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp Us
              </a>
              <a
                href="tel:+917207382073"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg border-2 border-blue-900 hover:bg-blue-900 hover:text-white transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
