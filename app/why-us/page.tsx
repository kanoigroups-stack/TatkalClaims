import { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  IndianRupee,
  Star,
  Shield,
  GraduationCap,
  TrendingUp,
  Scale,
  FileCheck,
  MessageSquare,
  Phone,
} from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Why Us | India's Trusted Insurance Dispute Experts",
  description:
    "82% success rate, ₹20+ Crores recovered, 500+ cases assisted. Team of claims experts, retired ombudsmen & former insurance professionals. Dedicated case managers.",
  alternates: { canonical: "/why-us/" },
  openGraph: {
    title: "Why Choose Tatkal Claims | Insurance Dispute Experts",
    description:
      "A track record built on expertise, transparency, and relentless advocacy for policyholders across India.",
    url: "https://tatkalclaims.com/why-us/",
    type: "website",
  },
};

const stats = [
  {
    icon: Users,
    value: "500+",
    suffix: "",
    label: "Cases Assisted",
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    icon: IndianRupee,
    value: "₹20+",
    suffix: "Crores",
    label: "Claims Recovered",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Star,
    value: "4.6",
    suffix: "",
    label: "Client Rating",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: TrendingUp,
    value: "82%",
    suffix: "",
    label: "Success Rate",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const credentials = [
  {
    icon: GraduationCap,
    title: "Claims Experts",
    desc: "Advocates with decades of experience in consumer protection law.",
  },
  {
    icon: Shield,
    title: "Insurance Specialists",
    desc: "Former insurance company professionals who understand internal claim assessment processes.",
  },
  {
    icon: TrendingUp,
    title: "82% Success Rate",
    desc: "Cases resolved in the client's favor through negotiation, ombudsman, or court proceedings.",
  },
  {
    icon: Scale,
    title: "Regulatory Knowledge",
    desc: "Deep expertise in IRDAI regulations, Ombudsman procedures, and Consumer Court litigation.",
  },
  {
    icon: FileCheck,
    title: "Documentation Pros",
    desc: "Perfect paperwork and evidence presentation for maximum impact at every stage.",
  },
  {
    icon: Users,
    title: "Dedicated Team",
    desc: "Personal case manager assigned to every client for seamless communication and updates.",
  },
];

const differentiators = [
  {
    icon: Shield,
    title: "We Work for Policyholders",
    desc: "Unlike TPAs or agents who serve insurers, we are 100% on your side. Our only goal is your maximum recovery.",
  },
  {
    icon: Star,
    title: "Transparent Fixed Fee Model",
    desc: "We operate on a transparent fixed fee model based on case complexity. You pay once we begin working on your case. No hidden charges or surprises. We also offer a free initial case evaluation.",
  },
  {
    icon: FileCheck,
    title: "End-to-End Handling",
    desc: "From document collection to court representation, we handle everything. You focus on recovery; we handle the fight.",
  },
  {
    icon: Users,
    title: "Pan-India Coverage",
    desc: "We handle disputes with all IRDAI-registered insurers across every state and union territory in India.",
  },
];

const testimonials = [
  {
    name: "Ravi Anjania",
    location: "Mumbai, Maharashtra",
    service: "Health Insurance Rejection",
    quote:
      "My daughter's cancer claim was rejected citing a pre-existing condition. Tatkal Claims team found a loophole in the insurer's reasoning and got us ₹8.5 lakhs within 3 months. Life-changing!",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    location: "Bangalore, Karnataka",
    service: "Motor Insurance Dispute",
    quote:
      "The insurer offered ₹3.2 lakhs for my total loss car. Tatkal Claims proved the IDV was undervalued and got me ₹5.8 lakhs. Professional, persistent, and worth every rupee.",
    rating: 5,
  },
  {
    name: "Amit Patel",
    location: "Ahmedabad, Gujarat",
    service: "Claim Delay",
    quote:
      "My father's health claim was pending for 8 months. Within 45 days of engaging Tatkal Claims, the full amount was credited with interest. Their regulatory connections clearly work.",
    rating: 5,
  },
  {
    name: "Suryakant Sharma",
    location: "Ponda, Goa",
    service: "Motor Total Loss",
    quote:
      "After my car accident, the insurance offered only 60% of the value. The Tatkal Claims experts negotiated and I received 95% of the insured amount. Professional, responsive, and truly caring.",
    rating: 5,
  },
  {
    name: "Nidhi Bajaj",
    location: "Kolkata, West Bengal",
    service: "Mis-sold ULIP Policy",
    quote:
      "I was sold a policy as a 'fixed deposit' by my bank. Tatkal Claims helped me file a complaint with IRDAI and recover my entire premium of ₹5 lakhs plus interest. Highly recommended!",
    rating: 5,
  },
  {
    name: "Dr. Rajeev Agarwal",
    location: "Thane, Maharashtra",
    service: "Claim Delay - 8 Months",
    quote:
      "My home insurance claim was stuck for 8 months. Within 2 weeks of hiring Tatkal Claims, the insurer released ₹12 lakhs. Their regulatory pressure approach works wonders.",
    rating: 4,
  },
];

export default function WhyUsPage() {
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
                Why Us
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Why Thousands of Policyholders{" "}
              <span className="text-blue-700">Trust Us</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl">
              A track record built on deep expertise, transparent processes, and
              relentless advocacy for policyholders across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact-form"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors text-center"
              >
                Get Free Evaluation
              </Link>
              <Link
                href="/services/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg border-2 border-blue-900 hover:bg-blue-900 hover:text-white transition-all duration-300 text-center"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — White/light background */}
      <SectionWrapper className="bg-slate-50/50">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                {stat.value}
                {stat.suffix && (
                  <span className="text-xl ml-1 text-slate-500">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Credentials */}
      <SectionWrapper className="bg-white">
        <SectionHeader
          title="Our Expertise"
          subtitle="A multidisciplinary team built to win insurance disputes"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map((cred) => (
            <div
              key={cred.title}
              className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg hover:border-blue-100 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <cred.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">{cred.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {cred.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Differentiators + Testimonials */}
      <SectionWrapper className="bg-slate-50/50">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Makes Us{" "}
              <span className="text-blue-700">Different</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Most "claim helpers" are former agents with limited claims knowledge.
              We are a professional dispute resolution firm with the expertise
              to take on any insurer.
            </p>
            <div className="space-y-5">
              {differentiators.map((diff) => (
                <div key={diff.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <diff.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{diff.title}</h4>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                      {diff.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FIXED: Client Success Stories */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Client Success Stories
            </h3>
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {t.service}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3.5 h-3.5 ${
                            starIdx < t.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm italic leading-relaxed mb-3">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                      {t.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {t.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA — White background, homepage theme */}
      <section className="py-16 md:py-20 px-4 bg-white border-t border-slate-200">
        <div className="container-main max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Join Thousands of Satisfied Policyholders
          </h2>
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
            Don't fight the insurance company alone. Our experts have the
            experience, knowledge, and determination to win your case.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact-form"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              Get Free Case Evaluation
            </Link>
            <a
              href="https://wa.me/917207382073"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg border-2 border-blue-900 hover:bg-blue-900 hover:text-white transition-all duration-300"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
