import {
  Ban,
  Clock,
  HeartPulse,
  Car,
  AlertTriangle,
  Scale,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  color: string;
  iconBg: string;
  icon: LucideIcon;
  stats: string;
  features: string[];
  process: string[];
  faqs: { q: string; a: string }[];
  relatedSlugs: string[];
}

export const services: Service[] = [
  {
    slug: "claim-rejection",
    title: "Claim Rejection",
    shortDesc:
      "Wrongfully denied claims reviewed and appealed by claims experts.",
    fullDesc:
      "Insurance companies often reject valid claims citing vague policy exclusions, procedural lapses, or incorrect interpretation of terms. Our claims team thoroughly reviews your denial letter, policy wording, and claim history to identify solid grounds for appeal. We draft strong representation letters, escalate to IRDAI, and if needed, file complaints with the Insurance Ombudsman or Consumer Court.",
    color: "bg-red-50 text-red-600 border-red-200",
    iconBg: "bg-red-100",
    icon: Ban,
    stats: "500+ rejections overturned",
    features: [
      "Policy wording deep-dive analysis",
      "Grounds identification & validation",
      "Legal appeal letter drafting",
      "Ombudsman representation",
      "Consumer Court litigation support",
      "IRDAI complaint filing",
    ],
    process: [
      "Review denial letter & policy documents",
      "Identify valid grounds for appeal",
      "Draft claims representation to insurer",
      "Escalate to IRDAI Grievance Cell",
      "File Ombudsman complaint if unresolved",
      "Litigate in Consumer Court if required",
    ],
    faqs: [
      {
        q: "What are the most common reasons for claim rejection?",
        a: "The most common reasons include: non-disclosure of pre-existing conditions, policy lapse due to non-payment, claim falling under exclusions, delayed intimation beyond 7 days, and insufficient documentation. Many of these are challengeable.",
      },
      {
        q: "Can I appeal a claim rejection after 1 year?",
        a: "You can approach the Insurance Ombudsman within 1 year of the insurer's final rejection letter. For Consumer Court, the limitation is 2 years. We can also explore condonation of delay in exceptional circumstances.",
      },
    ],
    relatedSlugs: ["claim-delay", "short-settlement"],
  },
  {
    slug: "claim-delay",
    title: "Claim Delay",
    shortDesc:
      "Expedite delayed settlements through regulatory pressure and expert negotiation.",
    fullDesc:
      "When insurers delay settlements beyond IRDAI-mandated timelines (30 days for non-investigated claims, 45 days for investigated), we step in with formal demand notices, regulatory complaints to IRDAI, and persistent follow-ups. Our relationships with insurer grievance cells ensure your case gets priority attention. We also claim interest on delayed payments as per IRDAI regulations.",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    iconBg: "bg-amber-100",
    icon: Clock,
    stats: "Avg. 45 days faster resolution",
    features: [
      "Timeline tracking & documentation",
      "Formal demand notice drafting",
      "IRDAI grievance escalation",
      "Interest on delayed payments",
      "Priority follow-up system",
      "Settlement negotiation",
    ],
    process: [
      "Document delay timeline & communications",
      "Send formal demand notice to insurer",
      "File IRDAI grievance if no response",
      "Claim statutory interest on delay",
      "Escalate to Ombudsman if needed",
      "Receive settlement + interest",
    ],
    faqs: [
      {
        q: "How long should an insurer take to settle a claim?",
        a: "As per IRDAI guidelines: 30 days for claims not requiring investigation, 45 days for claims requiring investigation. Beyond this, you're entitled to interest at 2% above bank rate.",
      },
      {
        q: "Will I get interest on the delayed amount?",
        a: "Yes. IRDAI mandates insurers pay interest at 2% above the bank rate for delays beyond the stipulated period. We ensure this is included in your final settlement.",
      },
    ],
    relatedSlugs: ["claim-rejection", "short-settlement"],
  },
  {
    slug: "health-insurance-disputes",
    title: "Health Insurance Disputes",
    shortDesc:
      "Cashless denials, pre-existing conditions & hospitalization disagreements.",
    fullDesc:
      "Health insurance disputes are emotionally draining. We handle cashless claim denials at network hospitals, disputes over pre-existing disease (PED) clauses, room rent capping issues, co-payment disputes, and claim rejections for pre & post-hospitalization expenses. Our medical experts review hospital records to build a strong, evidence-backed case.",
    color: "bg-rose-50 text-rose-600 border-rose-200",
    iconBg: "bg-rose-100",
    icon: HeartPulse,
    stats: "₹15+ Crores recovered",
    features: [
      "Cashless denial appeals",
      "PED clause analysis & challenge",
      "Hospital record review",
      "Medical expert consultation",
      "Room rent capping disputes",
      "Pre/post-hospitalization claims",
    ],
    process: [
      "Review hospital records & policy terms",
      "Analyze cashless denial reasons",
      "Consult medical experts if needed",
      "Challenge PED misinterpretation",
      "File appeal with insurer + IRDAI",
      "Recover full eligible amount",
    ],
    faqs: [
      {
        q: "My cashless claim was denied at the hospital. What should I do?",
        a: "First, get the denial reason in writing from the TPA/insurer. Then file for reimbursement immediately to preserve your rights. Simultaneously, contact us to challenge the cashless denial — many are overturned on appeal.",
      },
      {
        q: "Can the insurer reject my claim for a pre-existing disease?",
        a: "Only if the disease was existing before policy purchase AND you failed to disclose it. If the policy has completed the waiting period (typically 2-4 years), the claim must be honored. We challenge wrongful PED rejections regularly.",
      },
    ],
    relatedSlugs: ["claim-rejection", "mis-selling-complaints"],
  },
  {
    slug: "motor-insurance-claims",
    title: "Motor Insurance Claims",
    shortDesc:
      "Total loss, third-party & garage cashless problems handled expertly.",
    fullDesc:
      "Motor insurance claims involve complex calculations for total loss (IDV disputes), third-party liability assessments, garage cashless network issues, and surveyor report disputes. Our automotive and claims experts ensure you receive fair IDV settlements and proper repairs through authorized network garages. We also handle third-party injury and property damage claims.",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    iconBg: "bg-blue-100",
    icon: Car,
    stats: "98% garage approval rate",
    features: [
      "IDV dispute resolution",
      "Total loss fair assessment",
      "Third-party liability claims",
      "Surveyor report challenge",
      "Cashless garage network issues",
      "Theft & burglary claims",
    ],
    process: [
      "Assess damage & IDV calculation",
      "Review surveyor report for fairness",
      "Challenge undervaluation",
      "Negotiate with insurer/TPA",
      "Ensure cashless garage approval",
      "Finalize settlement or repairs",
    ],
    faqs: [
      {
        q: "The insurer is offering much less than my car's IDV. Can I challenge this?",
        a: "Absolutely. IDV should reflect the market value of your vehicle. We use independent valuation reports and IRDAI guidelines to challenge lowball IDV offers and secure fair settlements.",
      },
      {
        q: "Can I choose my own garage for repairs?",
        a: "For cashless claims, you must use a network garage. If none is satisfactory, you can opt for reimbursement and choose any garage. We help you navigate both options.",
      },
    ],
    relatedSlugs: ["claim-delay", "short-settlement"],
  },
  {
    slug: "mis-selling-complaints",
    title: "Mis-selling Complaints",
    shortDesc:
      "Policies sold under false pretenses, hidden terms, or pressure tactics.",
    fullDesc:
      "If your policy was sold through misrepresentation, false promises of returns, hidden exclusions, or high-pressure tactics, you have strong grounds for complaint. We help document the mis-selling evidence, file complaints with the insurer, IRDAI, and if necessary, pursue refund claims through the Ombudsman or Consumer Forum. We also help with free-look period disputes and policy surrender value issues.",
    color: "bg-orange-50 text-orange-600 border-orange-200",
    iconBg: "bg-orange-100",
    icon: AlertTriangle,
    stats: "Full refund in 68% cases",
    features: [
      "Sales call recording review",
      "Promise vs. reality analysis",
      "Refund claim filing",
      "Punitive damages pursuit",
      "Free-look period disputes",
      "Surrender value challenges",
    ],
    process: [
      "Gather sales evidence & recordings",
      "Compare promises vs. policy terms",
      "Document mis-selling instances",
      "File complaint with insurer + IRDAI",
      "Approach Ombudsman for refund",
      "Pursue Consumer Court if needed",
    ],
    faqs: [
      {
        q: "What counts as insurance mis-selling?",
        a: "Mis-selling includes: promising returns not in the policy, hiding exclusions, selling without explaining terms, forging signatures, selling to ineligible customers, and pressure tactics. All are violations of IRDAI norms.",
      },
      {
        q: "Can I get a full refund if my policy was mis-sold?",
        a: "Yes, if mis-selling is proven. IRDAI mandates insurers refund premiums with interest in confirmed mis-selling cases. We've secured full refunds even for policies held for several years.",
      },
    ],
    relatedSlugs: ["health-insurance-disputes", "claim-rejection"],
  },
  {
    slug: "short-settlement",
    title: "Short Settlement Issues",
    shortDesc:
      "Underpaid claims where insurers offer less than the rightful amount.",
    fullDesc:
      "Insurers often apply arbitrary depreciation, incorrect deductibles, or undervalue claims. We independently assess the rightful claim amount using industry-standard valuation methods, policy wording, and IRDAI guidelines. We then negotiate aggressively or litigate to recover the difference between what was offered and what you rightfully deserve.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    iconBg: "bg-emerald-100",
    icon: Scale,
    stats: "3.2x avg. settlement increase",
    features: [
      "Independent claim valuation",
      "Depreciation rate challenge",
      "Policy wording leverage",
      "Difference recovery calculation",
      "Expert negotiation",
      "Litigation for balance amount",
    ],
    process: [
      "Calculate rightful claim amount",
      "Compare with insurer's offer",
      "Identify unjust deductions",
      "Present independent valuation",
      "Negotiate revised settlement",
      "Litigate for balance if refused",
    ],
    faqs: [
      {
        q: "Why is my claim settlement lower than expected?",
        a: "Common reasons include: excessive depreciation applied, wrong deductible charged, non-admissible expenses wrongly excluded, and under-assessment of damage. We identify every unjust deduction.",
      },
      {
        q: "Can I challenge the surveyor's assessment?",
        a: "Yes. Surveyor reports are not final. You can request a re-survey, present an independent surveyor's report, or challenge the assessment through IRDAI/Ombudsman. We handle this regularly.",
      },
    ],
    relatedSlugs: ["claim-rejection", "claim-delay"],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}

export function getRelatedServices(slugs: string[]): Service[] {
  return services.filter((s) => slugs.includes(s.slug));
}
