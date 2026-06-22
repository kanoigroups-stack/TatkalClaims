"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Handshake, 
  ArrowRight, 
  Phone, 
  Mail, 
  CheckCircle2,
  Building2,
  Scale,
  HeartHandshake,
  Briefcase,
  IndianRupee,
  ShieldCheck,
  TrendingUp,
  Users
} from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const partnerTypes = [
  {
    icon: Scale,
    title: "Lawyers & Law Firms",
    description: "Refer clients facing insurance claim rejections, delays, or disputes. We handle the insurance-specific expertise while you retain the legal relationship.",
    benefits: ["Earn referral commissions on every successful case", "Expand your practice into insurance disputes", "No insurance expertise required — we handle it all"]
  },
  {
    icon: Building2,
    title: "Chartered Accountants (CAs)",
    description: "Your clients trust you with their finances. When they face insurance claim issues, refer them to us and earn while helping them recover their money.",
    benefits: ["Additional revenue stream for your practice", "Strengthen client relationships", "Transparent commission structure"]
  },
  {
    icon: HeartHandshake,
    title: "Financial Advisors",
    description: "Insurance claims are part of your clients' financial health. Partner with us to ensure they recover what's rightfully theirs.",
    benefits: ["Complement your advisory services", "Referral fees for every settled case", "Build deeper client trust"]
  },
  {
    icon: Briefcase,
    title: "Insurance Agents & Brokers",
    description: "Your clients may face claim disputes with other insurers. Refer them to us for expert resolution — no conflict with your existing business.",
    benefits: ["Help clients with claim disputes", "Earn referral income", "Enhance your professional reputation"]
  }
];

const stats = [
  { value: "₹20+", label: "Crores Recovered", icon: IndianRupee },
  { value: "500+", label: "Cases Resolved", icon: ShieldCheck },
  { value: "82%", label: "Success Rate", icon: TrendingUp },
  { value: "24h", label: "Response Time", icon: Users },
];

const whyPartner = [
  {
    title: "Generous Commission Structure",
    description: "Earn competitive referral fees on every successful case settlement. The more you refer, the more you earn."
  },
  {
    title: "Zero Investment Required",
    description: "No upfront costs, no membership fees, no hidden charges. Simply refer clients and start earning."
  },
  {
    title: "Dedicated Partner Support",
    description: "Get a dedicated partner manager, marketing materials, and regular updates on your referred cases."
  },
  {
    title: "Transparent Tracking",
    description: "Access your partner dashboard to track referrals, case status, and earnings in real time."
  },
  {
    title: "Professional Credibility",
    description: "Associate with India's most trusted insurance dispute resolution platform. Boost your professional image."
  },
  {
    title: "Quick Onboarding",
    description: "Sign up in minutes. Start referring clients the same day. We handle all the paperwork."
  }
];

const howItWorks = [
  { step: "01", title: "Sign Up", description: "Contact us via WhatsApp, phone, or email. We review and approve within 24 hours." },
  { step: "02", title: "Refer Clients", description: "Share your unique referral link or simply tell clients to mention your name when they contact us." },
  { step: "03", title: "We Handle Everything", description: "Our experts evaluate the case, file complaints, and fight for the client's rightful settlement." },
  { step: "04", title: "You Get Paid", description: "Once the case is successfully resolved, your commission is transferred directly to your account." },
];

export default function PartnerWithUsPage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50/30 -z-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 -z-10" />
        
        <div className="container-main max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 text-accent-800 rounded-full text-sm font-semibold mb-6"
            >
              <Handshake className="w-4 h-4" aria-hidden="true" />
              Partner Program
            </motion.div>
            
            <motion.h1
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6"
            >
              Partner With <span className="gradient-text">Tatkal Claims</span>
            </motion.h1>
            
            <motion.p
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8"
            >
              Join India's most trusted insurance dispute resolution network. Earn commissions by referring clients who need help with rejected, delayed, or disputed insurance claims.
            </motion.p>
            
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a 
                href="https://wa.me/919321152524?text=Hi%2C%20I%20am%20interested%20in%20partnering%20with%20Tatkal%20Claims" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-base group"
                aria-label="Contact us on WhatsApp to become a partner"
              >
                <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
                Contact Us on WhatsApp
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </a>
              <a 
                href="tel:+919321152524" 
                className="btn-secondary text-base"
                aria-label="Call us to discuss partnership"
              >
                <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
                Talk to Our Team
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-primary-900">
        <div className="container-main px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-accent-400 mx-auto mb-3" aria-hidden="true" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-primary-200 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Partner */}
      <section className="section-padding bg-slate-50/50">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Who Can Partner With Us?
            </h2>
            <p className="text-lg text-slate-600">
              Whether you are a legal professional, financial advisor, or insurance expert — there is a partnership opportunity for you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {partnerTypes.map((partner, index) => (
              <motion.div
                key={partner.title}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.1 }}
                className="card-premium group"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <partner.icon className="w-7 h-7 text-primary-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{partner.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{partner.description}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {partner.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="section-padding">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Why Partner With Tatkal Claims?
            </h2>
            <p className="text-lg text-slate-600">
              We have built a platform that makes partnering easy, profitable, and professional.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyPartner.map((item, index) => (
              <motion.div
                key={item.title}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : index * 0.08 }}
                className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 hover:border-primary-200 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-accent-700 font-bold text-lg">{index + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-slate-50/50">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600">
              Four simple steps to start earning with Tatkal Claims.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-accent-300" aria-hidden="true" />
            
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-card border-2 border-primary-100 flex items-center justify-center relative z-10">
                    <span className="text-2xl font-bold text-primary-700">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-[240px]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="section-padding">
        <div className="container-main">
          <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-3xl p-8 md:p-16 overflow-hidden text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Transparent Commission Structure
                </h2>
                <p className="text-lg text-primary-100 leading-relaxed mb-6">
                  We believe in fair and transparent partnerships. Our commission rates are competitive and paid promptly upon successful case resolution.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-accent-400 mb-1">10-15%</div>
                    <div className="text-sm text-primary-200">Standard Referral</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-accent-400 mb-1">15-20%</div>
                    <div className="text-sm text-primary-200">High-Volume Partner</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-accent-400 mb-1">Custom</div>
                    <div className="text-sm text-primary-200">Enterprise Deal</div>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <a 
                  href="https://wa.me/919321152524?text=Hi%2C%20I%20am%20interested%20in%20partnering%20with%20Tatkal%20Claims" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent text-base px-8 py-4 group inline-flex items-center"
                  aria-label="Contact us on WhatsApp to apply for partnership"
                >
                  Contact Us on WhatsApp
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="section-padding bg-slate-50/50">
        <div className="container-main text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to Partner With Us?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Get in touch with our partnership team today. We will guide you through the onboarding process and answer all your questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/919321152524?text=Hi%2C%20I%20am%20interested%20in%20partnering%20with%20Tatkal%20Claims" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary text-base group"
            >
              <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
              Chat on WhatsApp
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>
            <a 
              href="tel:+919321152524" 
              className="btn-secondary text-base"
            >
              <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
              Call Us Now
            </a>
          </div>
          <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-100 shadow-card">
            <p className="text-sm text-slate-500 mb-2">Prefer email?</p>
            <a 
              href="mailto:help@tatkalclaims.com" 
              className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-900 transition-colors"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
              help@tatkalclaims.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
