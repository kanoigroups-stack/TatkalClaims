import type { ContentAuthor } from "./types";

export const ARTICLE_WRITER_NAME = "Tatkal Claims, Claims Review Team";
export const ARTICLE_REVIEWER_NAME = "Ankit L Kanoi, Founder";

export const ARTICLE_WRITER_ENTITY: ContentAuthor = {
  displayName: ARTICLE_WRITER_NAME,
  schemaName: ARTICLE_WRITER_NAME,
  entityType: "Organization",
  role: "Claims Review Team",
  bio: "Tatkal Claims claims review team covering insurance judgments, regulatory updates, news, and explainers across health, motor, life, travel, and general insurance claims.",
};

export const ARTICLE_REVIEWER_ENTITY: ContentAuthor = {
  displayName: ARTICLE_REVIEWER_NAME,
  schemaName: "Ankit L Kanoi",
  entityType: "Person",
  slug: "ankit-l-kanoi-founder",
  role: "Founder",
  linkedin: "https://www.linkedin.com/in/ankit-kanoi-9730b1403/",
  bio: "Founder of Tatkal Claims. Ankit L Kanoi has 12+ years of experience in the insurance industry and holds an MSc. in Finance and Management from Essex University, UK.",
  profileUrl: "https://tatkalclaims.com/author/ankit-l-kanoi-founder/",
};
