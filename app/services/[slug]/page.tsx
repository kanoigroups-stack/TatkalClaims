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
import { motion } from "framer-motion";
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
      {/* Hero */}
      <section
        className={`py-16 md:py-24 px-4 ${service.color.split(" ")[0]} border-b ${service.color.split(" ")[2]}`}
      >
        <div className="container-main max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm opacity-70">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/services/" className="hover:underline">
                  Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold">
                {service.title}
              </li>
            </ol>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
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
              <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {service.stats}
              </span>
              <Link
                href="/#contact-form"
                className="btn-primary text-sm"
              >
                Get Free Evaluation
              </Link>
              <a
                href="tel:+917207382073"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-primary-700"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <SectionWrapper className="bg-white">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              What We Do For You
            </h2>
            <ul className="space-y-4">
              {service.features.map((feat, i) => (
                <motion.li
                  key={feat}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                  <span className="text-slate-700 font-medium">{feat}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-3xl p-8 text-white"
          >
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
          </motion.div>
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
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="font-bold text-slate-900 mb-2 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                {faq.q}
              </h3>
              <p className="text-slate-600 leading-relaxed pl-8">{faq.a}</p>
            </motion.div>
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

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-r from-primary-800 to-primary-900">
        <div className="container-main max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Resolve Your {service.title}?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Get a free case evaluation from our experts. No obligation, no hidden
            fees.
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
