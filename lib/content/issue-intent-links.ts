export type IssueIntentLink = {
  serviceSlug: string;
  guideSlug: string;
  issueLabel: string;
  serviceTitle: string;
  guideTitle: string;
  guideDescription: string;
  serviceDescription: string;
};

const ISSUE_INTENT_LINKS: readonly IssueIntentLink[] = [
  {
    serviceSlug: "claim-rejection",
    guideSlug: "claim-rejection-guide",
    issueLabel: "claim rejection",
    serviceTitle: "Claim Rejection",
    guideTitle: "Insurance Claim Rejected? What to Do Next",
    guideDescription:
      "Understand rejection reasons, evidence, insurer grievance steps, Bima Bharosa and escalation options before deciding what help you need.",
    serviceDescription:
      "If your rejected claim needs a case-specific review, see how our Claim Rejection service approaches policy wording, evidence and escalation.",
  },
  {
    serviceSlug: "claim-delay",
    guideSlug: "claim-delay-tactics",
    issueLabel: "claim delay",
    serviceTitle: "Claim Delay",
    guideTitle: "What to Do If Your Insurer Delays Your Claim Settlement",
    guideDescription:
      "Review practical steps for documenting a delay, checking the applicable timeline and escalating through the insurer's grievance process.",
    serviceDescription:
      "If your delayed claim needs case-specific assistance, see how our Claim Delay service approaches timelines, documentation and escalation.",
  },
  {
    serviceSlug: "mis-selling-complaints",
    guideSlug: "mis-selling-guide",
    issueLabel: "insurance mis-selling",
    serviceTitle: "Mis-selling Complaints",
    guideTitle: "Mis-Sold an Insurance Policy? What to Do & How to Complain",
    guideDescription:
      "Learn how to identify possible mis-selling, preserve sales evidence, complain to the insurer and consider the appropriate escalation route.",
    serviceDescription:
      "If your mis-selling complaint needs a case-specific review, see how our Mis-selling Complaints service approaches evidence and escalation.",
  },
];

export function getIssueIntentLinkByServiceSlug(serviceSlug: string) {
  return ISSUE_INTENT_LINKS.find((item) => item.serviceSlug === serviceSlug);
}

export function getIssueIntentLinkByGuideSlug(guideSlug: string) {
  return ISSUE_INTENT_LINKS.find((item) => item.guideSlug === guideSlug);
}
