import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  MessageSquare,
  ChevronRight,
  Star,
  HelpCircle,
} from "lucide-react";
import {
  getServiceBySlug,
  getAllServiceSlugs,
  getRelatedServices,
} from "@/lib/services";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service)
    return {
      title: "Service Not Found",
      robots: { index: false, follow: false },
    };

  return {
    title: `${service.title} | Insurance Dispute Resolution`,
    description: service.shortDesc,
    alternates: { canonical: `/services/${service.slug}/` },
    openGraph: {
      title: `${service.title} | Tatkal Claims`,
      description: service.fullDesc.slice(0, 160),
      url: `https://tatkalclaims.com/services/${service.slug}/`,
      type: "article",
    },
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const related = getRelatedServices(service.relatedSlugs);
  const Icon = service.icon;

  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Hero — White background, homepage theme */}
      <section className="py-16 md:py-24 px-4 bg-white border-b border-slate-200">
        <div className="container-main max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-slate-500">
              <li>
                <Link href="/" className="hover:text-blue-900 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/services/" className="hover:text-blue-900 transition-colors">
                  Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-slate-900">
                {service.title}
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div
              className={`w-16 h-16 rounded-2xl ${service.iconBg} flex items-center justify-center mb-6`}
            >
              <Icon className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              {service.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-6">
              {service.fullDesc}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 bg-slate-100 px-4 py-2 rounded-full text-sm font-semibold text-slate-700">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {service.stats}
              </span>
              <Link
                href="/#contact-form"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors text-sm"
              >
                Get Free Evaluation
              </Link>
              <a
                href="tel:+917207382073"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-900 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <SectionWrapper className="bg-white">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              What We Do For You
            </h2>
            <ul className="space-y-4">
              {service.features.map((feat) => (
                <li
                  key={feat}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                  <span className="text-slate-700 font-medium">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-accent-400" />
              Our Process
            </h3>
            <div className="space-y-0">
              {service.process.map((step, i) => (
                <div key={step} className="flex gap-4 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-accent-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </div>
                    {i < service.process.length - 1 && (
                      <div className="w-0.5 h-full bg-white/20 my-1" />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="text-primary-100 leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Service FAQs */}
      <SectionWrapper className="bg-slate-50/50">
        <SectionHeader
          title={`Frequently Asked Questions`}
          subtitle={`Common questions about ${service.title.toLowerCase()}`}
        />
        <div className="max-w-3xl mx-auto space-y-4">
          {service.faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="font-bold text-slate-900 mb-2 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                {faq.q}
              </h3>
              <p className="text-slate-600 leading-relaxed pl-8">{faq.a}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Related Services */}
      {related.length > 0 && (
        <SectionWrapper className="bg-white">
          <SectionHeader
            title="Related Services"
            subtitle="Other ways we can help you"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((rel) => {
              const RelIcon = rel.icon;
              return (
                <Link
                  key={rel.slug}
                  href={`/services/${rel.slug}/`}
                  className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${rel.color}`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${rel.iconBg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
                  >
                    <RelIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-700 transition-colors">
                    {rel.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-3">
                    {rel.shortDesc}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 group-hover:gap-2 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </SectionWrapper>
      )}

      {/* CTA — White background, homepage theme */}
      <section className="py-16 md:py-20 px-4 bg-white border-t border-slate-200">
        <div className="container-main max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to Resolve Your {service.title}?
          </h2>
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
            Get a free case evaluation from our experts. No obligation, no hidden
            fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact-form"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              Get Free Evaluation
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
