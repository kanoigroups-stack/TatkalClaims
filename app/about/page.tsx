import { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  MessageSquare,
  Shield,
  Target,
  Heart,
  Award,
  Users,
  IndianRupee,
  Star,
  TrendingUp,
  MapPin,
  Mail,
  CheckCircle,
  Linkedin,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "About Us | India's Insurance Dispute Resolution Experts",
  description:
    "Learn about Tatkal Claims — India's trusted insurance dispute resolution platform founded by Ankit L Kanoi. 500+ cases, ₹20+ Crores recovered, 82% success rate.",
  alternates: { canonical: "/about/" },
  openGraph: {
    title: "About Tatkal Claims | Insurance Dispute Experts",
    description:
      "Meet Ankit L Kanoi and the team behind India's most trusted insurance claim dispute resolution platform.",
    url: "https://tatkalclaims.com/about/",
    type: "website",
  },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      name: "About Tatkal Claims",
      url: "https://tatkalclaims.com/about/",
      description:
        "India's most trusted insurance dispute resolution platform. 500+ cases assisted, ₹20+ Crores recovered.",
      mainEntity: {
        "@type": "Organization",
        name: "Tatkal Claims",
        url: "https://tatkalclaims.com",
        logo: "https://tatkalclaims.com/logo.png",
        sameAs: [
          "https://tatkalclaims.com/blog/",
          "https://tatkalclaims.com/partner-with-us/",
          "https://www.linkedin.com/in/ankit-kanoi-9730b1403/",
        ],
      },
    },
    {
      "@type": "Review",
      itemReviewed: {
        "@type": "Organization",
        name: "Tatkal Claims",
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: "4.6",
        bestRating: "5",
      },
      author: {
        "@type": "Organization",
        name: "Tatkal Claims Clients",
      },
      reviewCount: "500",
    },
  ],
};

const stats = [
  {
    icon: Users,
    value: "500+",
    suffix: "",
    label: "Cases Assisted",
    color: "text-blue-400",
  },
  {
    icon: IndianRupee,
    value: "₹20+",
    suffix: "Crores",
    label: "Claims Recovered",
    color: "text-amber-400",
  },
  {
    icon: Star,
    value: "4.6",
    suffix: "",
    label: "Client Rating",
    color: "text-amber-300",
  },
  {
    icon: TrendingUp,
    value: "82%",
    suffix: "",
    label: "Success Rate",
    color: "text-emerald-400",
  },
];

const values = [
  {
    icon: Shield,
    title: "Policyholder First",
    desc: "We exist solely to serve policyholders. Unlike TPAs or agents who serve insurers, our loyalty is 100% to you.",
  },
  {
    icon: Target,
    title: "Results-Driven",
    desc: "Every strategy, every document, every negotiation is designed to maximize your claim recovery. No fluff, just outcomes.",
  },
  {
    icon: Heart,
    title: "Empathy in Action",
    desc: "We understand the stress of a denied claim. Our team treats every case with the urgency and care it deserves.",
  },
  {
    icon: Award,
    title: "Uncompromising Integrity",
    desc: "Transparent fees, honest assessments, and no false promises. If we can't help, we'll tell you upfront.",
  },
];

const milestones = [
  {
    year: "2019",
    title: "Founded in Mumbai",
    desc: "Ankit L Kanoi started Tatkal Claims with a mission to help policyholders fight unfair claim denials.",
  },
  {
    year: "2021",
    title: "100+ Cases Resolved",
    desc: "Crossed 100 successful case resolutions across health, motor, and life insurance disputes.",
  },
  {
    year: "2022",
    title: "₹5 Crores Recovered",
    desc: "Helped clients recover over ₹5 Crores in rightful insurance claims.",
  },
  {
    year: "2024",
    title: "Pan-India Expansion",
    desc: "Now serving policyholders across all 28 states and 8 union territories in India.",
  },
  {
    year: "2025",
    title: "₹20+ Crores Recovered",
    desc: "Crossed ₹20 Crores in total claim recovery with an 82% success rate and 4.6/5 client rating.",
  },
];

const team = [
  {
    role: "Insurance Claims Experts",
    desc: "Former insurance professionals with deep knowledge of internal claim assessment processes, policy wordings, and insurer tactics.",
  },
  {
    role: "Legal & Regulatory Specialists",
    desc: "Advocates and legal professionals experienced in IRDAI complaints, Insurance Ombudsman proceedings, and Consumer Court litigation.",
  },
  {
    role: "Documentation Specialists",
    desc: "Meticulous professionals who ensure every document, evidence, and filing is perfect for maximum impact.",
  },
  {
    role: "Client Success Managers",
    desc: "Dedicated case managers who keep you informed, answer your questions, and ensure a seamless experience.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      {/* Hero */}
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
                About Us
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Fighting for Policyholders{" "}
              <span className="text-blue-700">Since 2019</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl">
              Tatkal Claims was founded by <strong>Ankit L Kanoi</strong> with a
              simple belief: policyholders deserve a fair fight against powerful
              insurance companies. Today, we are India's most trusted name in
              insurance dispute resolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact-form"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors text-center"
              >
                Get Free Evaluation
              </Link>
              <a
                href="https://www.linkedin.com/in/ankit-kanoi-9730b1403/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg border-2 border-blue-900 hover:bg-blue-900 hover:text-white transition-all duration-300 text-center"
              >
                <Linkedin className="w-4 h-4" />
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <SectionWrapper className="bg-gradient-to-b from-blue-900 to-blue-950 text-white">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10"
            >
              <stat.icon className={`w-10 h-10 mx-auto mb-4 ${stat.color}`} />
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}
                {stat.suffix && (
                  <span className="text-xl ml-1 text-white/70">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <div className="text-white/70 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Founder */}
      <SectionWrapper className="bg-white">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Meet the <span className="text-blue-700">Founder</span>
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                <strong>Ankit L Kanoi</strong> founded Tatkal Claims in 2019 after
                witnessing countless policyholders struggle against unfair claim
                denials with no one in their corner.
              </p>
              <p>
                With <strong>12+ years of experience in the insurance industry</strong>,
                Ankit brings insider knowledge of how insurers operate, assess claims,
                and deny payouts. He holds an{" "}
                <strong>MSc. in Finance and Management from Essex University, UK</strong>,
                combining deep financial expertise with strategic management skills.
              </p>
              <p>
                Under his leadership, Tatkal Claims has grown from a Mumbai-based
                startup to a pan-India platform trusted by policyholders across
                every state and union territory. His mission remains unchanged:{" "}
                <strong>ensuring every policyholder gets the claim they rightfully deserve.</strong>
              </p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <a
                href="https://www.linkedin.com/in/ankit-kanoi-9730b1403/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-900 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                Connect with Ankit on LinkedIn
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 px-4 py-2 rounded-lg">
                <Briefcase className="w-4 h-4 text-blue-700" />
                <span>12+ Years Insurance Experience</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 px-4 py-2 rounded-lg">
                <GraduationCap className="w-4 h-4 text-blue-700" />
                <span>MSc. Finance & Management, Essex University, UK</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Our Journey</h3>
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-700" />
                    {i < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-blue-200 mt-1" />
                    )}
                  </div>
                  <div className="pb-6">
                    <span className="text-sm font-bold text-blue-700">{m.year}</span>
                    <h4 className="font-semibold text-slate-900 mt-0.5">{m.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Values */}
      <SectionWrapper className="bg-slate-50/50">
        <SectionHeader
          title="What We Stand For"
          subtitle="The principles that guide every case we take on"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val) => (
            <div
              key={val.title}
              className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <val.icon className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{val.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Team */}
      <SectionWrapper className="bg-white">
        <SectionHeader
          title="Meet Our Experts"
          subtitle="A multidisciplinary team built to win insurance disputes"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{member.role}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{member.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Contact Info */}
      <SectionWrapper className="bg-gradient-to-br from-blue-900 to-blue-950 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-white/80 text-lg mb-8">
            Have questions about your case? Our team is available 24/7 to help.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <a
              href="tel:+917207382073"
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors"
            >
              <Phone className="w-8 h-8 mx-auto mb-3 text-amber-400" />
              <div className="font-semibold">Call Us</div>
              <div className="text-white/70 text-sm mt-1">+91 7207382073</div>
            </a>
            <a
              href="mailto:help@tatkalclaims.com"
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors"
            >
              <Mail className="w-8 h-8 mx-auto mb-3 text-amber-400" />
              <div className="font-semibold">Email Us</div>
              <div className="text-white/70 text-sm mt-1">help@tatkalclaims.com</div>
            </a>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <MapPin className="w-8 h-8 mx-auto mb-3 text-amber-400" />
              <div className="font-semibold">Visit Us</div>
              <div className="text-white/70 text-sm mt-1">Mumbai, India</div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 bg-white border-t border-slate-200">
        <div className="container-main max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to Fight for Your Claim?
          </h2>
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
            Join 500+ policyholders who trusted us to recover their rightful
            insurance claims. Your fight is our fight.
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
