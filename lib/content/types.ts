export type ContentSource = "legacy" | "sanity";

export type ArticleBodyFormat = "legacy" | "portableText";

export type ArticleImage = {
  url: string;
  alt: string;
  caption?: string;
  credit?: string;
  displaySize?: "normal" | "wide" | "full";
};

export type ArticleSeo = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalOverride?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
};

export type ContentPost = {
  source: ContentSource;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  topics: string[];
  author: string;
  date: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  readingTimeMinutes?: number;
  legacyOrder?: number;
  image: ArticleImage;
  socialImage?: ArticleImage;
  seo?: ArticleSeo;
  contentType?: string;
  featured: boolean;
  cornerstone: boolean;
  monetization: "none" | "light" | "standard";
  relatedSlugs: string[];
  bodyFormat: ArticleBodyFormat;
  body: unknown[];
  legacyContent?: string;
};
