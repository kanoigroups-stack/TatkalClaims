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
        a: "Common reasons include non-disclosure or misrepresentation of material facts, policy lapse or non-payment, exclusions, late claim intimation, and incomplete documentation. A delay in intimation is not a universal seven-day bar; the policy terms, applicable regulations, and reasons for delay matter, and some delayed claims may still need to be considered on their facts.",
      },
      {
        q: "Can I appeal a claim rejection after 1 year?",
        a: "You normally must first complain to the insurer. An Insurance Ombudsman complaint is generally filed within one year of the insurer's rejection or unsatisfactory decision, or after one month without a reply; the Ombudsman may condone delay in appropriate cases. A Consumer Commission complaint is generally filed within two years from when the cause of action arose, with delay condonation possible for sufficient cause.",
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
      "When insurers delay a claim beyond the IRDAI timeline applicable to that product and claim type, we step in with formal demand notices, regulatory complaints to IRDAI, and persistent follow-ups. Turnaround times differ across life, health, and general insurance; for example, current health-insurance TATs include one hour for cashless pre-authorisation, three hours for final discharge authorisation, and 15 days for settlement of claims other than cashless. Where the applicable rules provide penal interest for delay, we also pursue that amount.",
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
      "Claim applicable penal interest on delay",
      "Escalate to Ombudsman if needed",
      "Receive settlement + applicable interest",
    ],
    faqs: [
      {
        q: "How long should an insurer take to settle a claim?",
        a: "There is no single universal 30/45-day rule for every insurance claim. IRDAI timelines depend on the product and claim type. For health insurance, current TATs include 1 hour for cashless pre-authorisation, 3 hours for final discharge authorisation, and 15 days for settlement of claims other than cashless. We check the current rule that applies to your specific claim.",
      },
      {
        q: "Will I get interest on the delayed amount?",
        a: "Depending on the product and applicable regulation, delay beyond the prescribed TAT may attract penal interest. Where the rule provides it, the rate is commonly 2% above the applicable bank rate. We calculate and pursue only the amount legally applicable to your claim.",
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
        a: "An insurer may examine non-disclosure, policy terms, waiting periods, exclusions, and other claim conditions. Under current IRDAI health-insurance guidance, waiting periods including PED waiting periods cannot exceed 36 months. After the applicable waiting period is completed, coverage still depends on the policy terms, disclosure history, admissibility, and other applicable conditions.",
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
        a: "Cashless repairs are generally available through garages eligible under your insurer's cashless or network arrangements, subject to the policy and insurer process. You may choose another garage, but the claim may then be handled on a reimbursement basis rather than cashless. We help you check the applicable policy terms before repairs proceed.",
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
        a: "Possible remedies depend on the facts, policy, evidence, and forum. A complaint may result in correction, cancellation, refund, compensation, or other relief where justified, but there is no blanket IRDAI rule guaranteeing a full premium refund with interest in every proven mis-selling case. We assess the evidence and pursue the relief that is legally supportable.",
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
        a: "Yes. A surveyor's assessment can be challenged with policy terms, repair bills, valuations, expert evidence, and other records. Depending on the circumstances, you can ask the insurer to reconsider the assessment and escalate the dispute through its grievance process, IRDAI facilitation, the Ombudsman, or Consumer Commission as applicable. A fresh re-survey is not an automatic right in every case.",
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
