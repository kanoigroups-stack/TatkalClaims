import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  MessageSquare,
  Star,
} from "lucide-react";
import { services } from "@/lib/services";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Our Services | Insurance Claim Dispute Resolution",
  description:
    "Expert insurance dispute resolution services: claim rejection, claim delay, health insurance disputes, motor insurance claims, mis-selling complaints & short settlement issues. Free case evaluation.",
  alternates: { canonical: "/services/" },
  openGraph: {
    title: "Our Services | Tatkal Claims",
    description:
      "Professional insurance dispute resolution services across India. 82% success rate.",
    url: "https://tatkalclaims.com/services/",
    type: "website",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Insurance Dispute Resolution",
  provider: {
    "@type": "Organization",
    name: "Tatkal Claims",
    url: "https://tatkalclaims.com",
  },
  areaServed: { "@type": "Country", name: "India" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Insurance Dispute Services",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        description: s.shortDesc,
      },
    })),
  },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-20 md:py-28 px-4">
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
                Services
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Insurance Dispute Resolution{" "}
              <span className="text-accent-400">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 leading-relaxed mb-8 max-w-2xl">
              From claim rejection to recovery, our expert team handles every
              type of insurance dispute with proven strategies. Over ₹20
              Crores recovered for policyholders across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact-form"
                className="btn-accent text-center"
              >
                Get Free Evaluation
              </Link>
              <a
                href="tel:+917207382073"
                className="btn-secondary border-white/30 text-white hover:bg-white/10 text-center"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call +91 72073 82073
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <SectionWrapper className="bg-slate-50/50">
        <SectionHeader
          title="Insurance Problems We Solve"
          subtitle="Comprehensive dispute resolution services tailored to your specific insurance challenge"
        />

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.slug}
                className={`group bg-white rounded-2xl border-2 p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${service.color}`}
              >
                <div className="flex items-start gap-5">
                  <div
                    className={`w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900">
                        {service.title}
                      </h3>
                      <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {service.stats}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                      {service.fullDesc}
                    </p>

                    <ul className="grid sm:grid-cols-2 gap-2 mb-5">
                      {service.features.slice(0, 4).map((feat) => (
                        <li
                          key={feat}
                          className="flex items-center gap-2 text-sm text-slate-700"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/services/${service.slug}/`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors group-hover:gap-3"
                    >
                      Learn More{" "}
                      <ArrowRight className="w-4 h-4 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* CTA Banner */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-r from-primary-800 to-primary-900">
        <div className="container-main max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Facing an Insurance Claim Issue?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Don't let insurers deny what is rightfully yours. Get a free case
            evaluation from our experts today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact-form" className="btn-accent">
              Get Free Case Evaluation
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
