import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Upload,
  Search,
  Gavel,
  BadgeCheck,
  ArrowRight,
  Phone,
  MessageSquare,
  Clock,
  Shield,
  Users,
} from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "How It Works | Insurance Claim Resolution Process",
  description:
    "Our transparent 5-step process: Submit case, share documents, expert evaluation, case filing, and claim resolution. Free evaluation. 82% success rate.",
  alternates: { canonical: "/how-it-works/" },
  openGraph: {
    title: "How It Works | Tatkal Claims",
    description:
      "A transparent 5-step process designed to maximize your chances of insurance claim recovery.",
    url: "https://tatkalclaims.com/how-it-works/",
    type: "website",
  },
};

const steps = [
  {
    icon: FileText,
    title: "Submit Your Case",
    duration: "5 minutes",
    desc: "Share your claim details and policy information through our secure portal, WhatsApp, or a phone call. No paperwork needed to start.",
    details: [
      "Free initial consultation",
      "No obligation to proceed",
      "All insurance types accepted",
      "100% confidential",
    ],
  },
  {
    icon: Upload,
    title: "Share Documents",
    duration: "1-2 days",
    desc: "Upload rejection letters, policy documents, claim forms, and all correspondence with the insurer. We organize everything for maximum impact.",
    details: [
      "Secure document upload portal",
      "We help obtain missing documents",
      "Chronological case file preparation",
      "Evidence strength assessment",
    ],
  },
  {
    icon: Search,
    title: "Expert Evaluation",
    duration: "24-48 hours",
    desc: "Our claims specialists analyze your case viability, identify the strongest grounds, and devise a winning strategy.",
    details: [
      "Policy wording deep-dive",
      "Precedent case research",
      "Viability score & timeline estimate",
      "Transparent fee quote",
    ],
  },
  {
    icon: Gavel,
    title: "Case Filing & Follow-up",
    duration: "30-180 days",
    desc: "We draft complaints, approach insurers, escalate to IRDAI, file with the Insurance Ombudsman, or approach Consumer Court.",
    details: [
      "Formal claims representation",
      "IRDAI grievance filing",
      "Ombudsman complaint drafting",
      "Regular status updates",
    ],
  },
  {
    icon: BadgeCheck,
    title: "Claim Resolution",
    duration: "Final step",
    desc: "Receive your rightful settlement. Our fees are success-based — we win when you win. Transparent, fair, and fixed.",
    details: [
      "Settlement verification",
      "Interest on delayed payments",
      "Full documentation handover",
      "Post-resolution support",
    ],
  },
];

const timeline = [
  {
    phase: "Week 1",
    title: "Case Intake & Strategy",
    items: ["Free evaluation", "Document collection", "Strategy finalization"],
  },
  {
    phase: "Week 2-4",
    title: "Insurer Engagement",
    items: ["Formal appeal filed", "IRDAI grievance lodged", "Follow-up calls"],
  },
  {
    phase: "Month 2-3",
    title: "Regulatory Escalation",
    items: ["Ombudsman complaint", "Consumer notice", "Mediation attempts"],
  },
  {
    phase: "Month 3+",
    title: "Resolution or Litigation",
    items: ["Settlement received", "Or court proceedings", "Final closure"],
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-900 to-slate-900 text-white py-20 md:py-28 px-4">
        <div className="container-main max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-primary-200">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white font-medium">
                How It Works
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              How We Resolve Your{" "}
              <span className="text-accent-400">Insurance Dispute</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 leading-relaxed mb-8 max-w-2xl">
              A transparent, 5-step process designed to maximize your chances of
              recovery. From first contact to final settlement, you're in expert
              hands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/#contact-form" className="btn-accent text-center">
                Start Your Case
              </Link>
              <a
                href="tel:+917207382073"
                className="btn-secondary border-white/30 text-white hover:bg-white/10 text-center"
              >
                <Phone className="w-4 h-4 mr-2" />
                Speak to an Expert
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Steps */}
      <SectionWrapper className="bg-white">
        <SectionHeader
          title="Our 5-Step Resolution Process"
          subtitle="Every case follows a proven path from submission to settlement"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative bg-white rounded-2xl border-2 border-slate-100 p-6 md:p-8 hover:border-primary-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary-800 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                {index + 1}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-5 transition-transform group-hover:scale-110">
                <step.icon className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-slate-900">
                  {step.title}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full mb-4">
                <Clock className="w-3 h-3" />
                {step.duration}
              </span>
              <p className="text-slate-600 leading-relaxed mb-5 text-sm md:text-base">
                {step.desc}
              </p>
              <ul className="space-y-2">
                {step.details.map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Timeline */}
      <SectionWrapper className="bg-slate-50/50">
        <SectionHeader
          title="Typical Case Timeline"
          subtitle="Realistic expectations at every stage of your dispute"
        />
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((t) => (
              <div
                key={t.phase}
                className="bg-white rounded-2xl p-6 border border-slate-200"
              >
                <span className="inline-block bg-primary-800 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                  {t.phase}
                </span>
                <h4 className="font-bold text-slate-900 mb-3">{t.title}</h4>
                <ul className="space-y-2">
                  {t.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Trust Signals */}
      <SectionWrapper className="bg-white">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Our Process{" "}
              <span className="text-primary-700">Works</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              We've refined our process over 500+ cases. Every step is designed
              to build the strongest possible case while keeping you informed and
              in control.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: Shield,
                  title: "Claims-First Approach",
                  desc: "We approach every case as a claims dispute, not just an insurance complaint. This changes the power dynamic.",
                },
                {
                  icon: Users,
                  title: "Insider Expertise",
                  desc: "Our team includes former insurance professionals who know exactly how insurers think and operate.",
                },
                {
                  icon: Clock,
                  title: "Speed Without Compromise",
                  desc: "We push for the fastest resolution possible without cutting corners on case strength.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-slate-600 text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-6">Success Metrics</h3>
              <div className="space-y-5">
                {[
                  { label: "Cases Resolved", value: "500+" },
                  { label: "Average Resolution Time", value: "45 days" },
                  { label: "Success Rate", value: "82%" },
                  { label: "Client Satisfaction", value: "4.6/5" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between border-b border-white/10 pb-4"
                  >
                    <span className="text-primary-200">{stat.label}</span>
                    <span className="text-xl font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/services/"
                className="btn-accent w-full mt-8 text-center block"
              >
                Explore Our Services
              </Link>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-r from-primary-800 to-primary-900">
        <div className="container-main max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Case?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            The sooner you begin, the stronger your case. Get your free
            evaluation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact-form" className="btn-accent">
              Get Free Evaluation
            </Link>
            <a
              href="https://wa.me/917207382073"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary border-white/30 text-white hover:bg-white/10"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
