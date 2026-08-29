export type KnowledgeTopic = {
  title: string;
  slug: string;
  description: string;
  landingDescription: string;
};

export const KNOWLEDGE_TOPICS: readonly KnowledgeTopic[] = [
  {
    title: "Health Insurance Claims",
    slug: "health-insurance-claims",
    description:
      "Cashless treatment, reimbursement, hospitalisation, IRDAI rules and health-claim disputes.",
    landingDescription:
      "Guides, regulatory updates, judgments and practical reporting on health insurance claims in India.",
  },
  {
    title: "Motor Insurance Claims",
    slug: "motor-insurance-claims",
    description:
      "Accident claims, own-damage disputes, surveyor issues and motor-claim decisions.",
    landingDescription:
      "Guides, judgments and practical updates on motor insurance claim disputes in India.",
  },
  {
    title: "Life Insurance Claims",
    slug: "life-insurance-claims",
    description:
      "Death claims, disclosure disputes, nominee issues and life-insurance claim decisions.",
    landingDescription:
      "Guides, judgments and practical updates on life insurance claim disputes in India.",
  },
];

export function getKnowledgeTopicBySlug(slug: string) {
  return KNOWLEDGE_TOPICS.find((topic) => topic.slug === slug);
}

export function getKnowledgeTopicByTitle(title: string) {
  return KNOWLEDGE_TOPICS.find((topic) => topic.title === title);
}

export function getKnowledgeTopicPath(topic: Pick<KnowledgeTopic, "slug">) {
  return `/blog/topic/${topic.slug}/`;
}
