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
  BookOpen,
} from "lucide-react";
import {
  getServiceBySlug,
  getAllServiceSlugs,
  getRelatedServices,
} from "@/lib/services";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import { getIssueIntentLinkByServiceSlug } from "@/lib/content/issue-intent-links";

export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
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
      type: "website",
    },
  };
}

type GeoAnswer = {
  question: string;
  answer: string;
};

const geoContent: Record<string, GeoAnswer[]> = {
  "claim-rejection": [
    {
      question: "What should I do if my insurance claim is rejected?",
      answer:
        "First, obtain the insurer's written rejection or repudiation reason and identify the policy clause relied upon. Compare that reason with your policy wording and claim documents. If you believe the decision is incorrect, submit a written representation with supporting evidence and use the insurer's grievance process before considering further escalation.",
    },
    {
      question: "Can I challenge a rejected insurance claim?",
      answer:
        "A rejected claim may be challengeable when the insurer has incorrectly applied the policy terms, overlooked relevant evidence, or relied on facts that can be disputed. The strength of a challenge depends on the policy wording, the rejection reason, and the documents supporting the claim.",
    },
    {
      question: "What documents should I keep after a claim rejection?",
      answer:
        "Keep the policy schedule and wording, claim form, rejection or repudiation letter, medical or repair records where relevant, bills and receipts, photographs, correspondence with the insurer or TPA, and any other evidence submitted with the claim. Keeping a dated record of communications can also help when escalating a dispute.",
    },
  ],
  "claim-delay": [
    {
      question: "What should I do if my insurance claim is delayed?",
      answer:
        "Start by recording the claim date, documents submitted, insurer communications, survey or investigation updates, and any outstanding requirements. Ask the insurer in writing for the current status and the specific reason for the delay. If the matter remains unresolved, use the insurer's formal grievance process and retain copies of every communication.",
    },
    {
      question: "Why can an insurance claim take longer to settle?",
      answer:
        "Delays can occur when documents are incomplete, additional information is requested, an investigation or survey is pending, liability is disputed, or the insurer is waiting for another party's records. A written explanation of what is still outstanding can help identify whether the delay is justified or needs escalation.",
    },
    {
      question: "How can I escalate a delayed insurance claim?",
      answer:
        "Begin with a written status request to the insurer or relevant claims team. If the response is unsatisfactory, use the insurer's grievance mechanism and keep the complaint reference number and supporting documents. Further escalation should depend on the type of policy, the insurer's response, and the applicable regulatory or dispute-resolution route.",
    },
  ],
  "health-insurance-disputes": [
    {
      question: "What should I do if my health insurance claim is rejected?",
      answer:
        "Ask the insurer or TPA for the rejection reason in writing and obtain the relevant policy clause. Review the hospitalization records, bills, discharge summary, claim form, and policy terms against that reason. If you believe the decision is incorrect, submit a documented representation through the insurer's grievance process and keep copies of all records.",
    },
    {
      question: "What should I do if a cashless health insurance claim is denied?",
      answer:
        "Ask the hospital or TPA for the reason for the cashless denial and request it in writing. Keep the medical records and policy documents, and ask the insurer what reimbursement or alternative claim process is available. A cashless denial does not by itself answer whether the underlying expenses are covered, so the policy terms and final claim decision should be reviewed separately.",
    },
    {
      question: "Can I dispute a health insurer's interpretation of a policy exclusion?",
      answer:
        "Yes, you can raise a dispute if you believe an exclusion has been applied incorrectly. Compare the exact exclusion wording with the medical records and circumstances of the treatment, then submit a written representation explaining why you believe the clause does not apply. The policy wording and evidence are central to the assessment.",
    },
  ],
  "motor-insurance-claims": [
    {
      question: "What should I do if my motor insurance claim is underpaid?",
      answer:
        "Ask the insurer for the settlement calculation and the surveyor's assessment, then compare the deductions with your policy terms and supporting repair or valuation documents. If you disagree with the assessment, document each disputed deduction and submit a written representation with evidence supporting the amount you believe is payable.",
    },
    {
      question: "Can I challenge a motor insurance surveyor's assessment?",
      answer:
        "You can raise concerns about an assessment with the insurer and provide supporting evidence such as repair estimates, photographs, invoices, valuation information, or other relevant records. Whether the assessment changes depends on the policy, the evidence, and the circumstances of the loss.",
    },
    {
      question: "What documents are useful in a motor insurance dispute?",
      answer:
        "Useful records can include the policy schedule, claim form, surveyor report, repair estimates and invoices, photographs of the damage, vehicle registration and other required documents, accident or police records where applicable, and all correspondence with the insurer or garage.",
    },
  ],
  "mis-selling-complaints": [
    {
      question: "What is insurance mis-selling?",
      answer:
        "Insurance mis-selling can involve material information being misrepresented or omitted during the sale, important policy terms not being properly explained, or a product being presented in a way that does not match its actual features or suitability. The specific facts and evidence matter when assessing a complaint.",
    },
    {
      question: "What evidence can support an insurance mis-selling complaint?",
      answer:
        "Keep sales messages, brochures, proposal forms, policy documents, recorded calls where lawfully available, emails or messages, payment records, and notes of promises or representations made during the sale. Compare those representations with the actual policy terms and identify the specific mismatch.",
    },
    {
      question: "What should I do if I believe an insurance policy was mis-sold?",
      answer:
        "Document what you were told, collect the policy and sales evidence, and identify the specific representation or omission you dispute. Raise the complaint with the insurer in writing and retain the complaint reference and response. Further escalation should depend on the facts, the insurer's response, and the applicable dispute-resolution process.",
    },
  ],
  "short-settlement": [
    {
      question: "What is an insurance claim short settlement?",
      answer:
        "A short settlement occurs when an insurer offers or pays less than the amount a policyholder believes is payable under the policy. The difference can arise from deductions, depreciation, exclusions, limits, valuation disagreements, or other policy terms. The settlement calculation should be reviewed against the actual policy wording and claim evidence.",
    },
    {
      question: "Can I challenge a low insurance claim settlement?",
      answer:
        "You can dispute a settlement when you believe the insurer has applied an incorrect deduction, valuation, exclusion, or other policy provision. Ask for the settlement calculation and supporting assessment, identify each disputed item, and submit evidence showing why the amount should be reconsidered.",
    },
    {
      question: "What documents should I collect for a short-settlement dispute?",
      answer:
        "Keep the policy wording and schedule, claim and settlement documents, surveyor or assessment reports, repair estimates or invoices, photographs, valuation evidence where relevant, and correspondence explaining the insurer's deductions. A clear item-by-item comparison can make the dispute easier to assess.",
    },
  ],
};

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = getRelatedServices(service.relatedSlugs);
  const Icon = service.icon;
  const answers = geoContent[service.slug] ?? [];
  const issueIntentLink = getIssueIntentLinkByServiceSlug(service.slug);

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

      {/* Answer-oriented guidance for search and AI users */}
      {answers.length > 0 && (
        <SectionWrapper className="bg-slate-50">
          <SectionHeader
            title={`Quick Answers About ${service.title}`}
            subtitle="Practical guidance for common insurance questions"
          />
          <div className="max-w-4xl mx-auto space-y-6">
            {answers.map((item) => (
              <article
                key={item.question}
                className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8"
              >
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
                  {item.question}
                </h2>
                <p className="text-slate-600 leading-relaxed">{item.answer}</p>
              </article>
            ))}
          </div>
        </SectionWrapper>
      )}

      {/* Informational guide link — separates education intent from service intent */}
      {issueIntentLink && (
        <SectionWrapper className="bg-white">
          <div className="mx-auto max-w-4xl rounded-3xl border border-primary-100 bg-primary-50/60 p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700">
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  Understand the issue first
                </p>
                <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
                  Want to review your options before asking for help?
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  {issueIntentLink.guideDescription}
                </p>
              </div>
              <Link
                href={`/blog/${issueIntentLink.guideSlug}/`}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-primary-800 bg-white px-5 py-3 font-semibold text-primary-800 transition-colors hover:bg-primary-800 hover:text-white"
              >
                Read: {issueIntentLink.guideTitle}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </SectionWrapper>
      )}

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
