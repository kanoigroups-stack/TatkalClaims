import { createClient } from "next-sanity";
import {
  apiVersion,
  productionDataset,
  projectId,
} from "@/sanity/env";
import type {
  ArticleImage,
  ArticleSeo,
  ContentAuthor,
  ContentPost,
} from "./types";

export type SanityImageProjection = {
  externalUrl?: string;
  assetUrl?: string;
  alt?: string;
  caption?: string;
  credit?: string;
  displaySize?: "normal" | "wide" | "full";
};

export type SanityAuthorProjection = {
  _id?: string;
  name?: string;
  slug?: string;
  entityType?: "Person" | "Organization";
  schemaName?: string;
  role?: string;
  linkedin?: string;
};

export type SanityPostProjection = {
  slug: string;
  title: string;
  excerpt: string;
  contentType?: string;
  category?: string;
  topics?: string[];
  author?: SanityAuthorProjection;
  featuredImage?: SanityImageProjection;
  socialImage?: SanityImageProjection;
  seo?: ArticleSeo;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes?: number;
  legacyOrder?: number;
  body?: unknown[];
  featured?: boolean;
  cornerstone?: boolean;
  monetization?: "none" | "light" | "standard";
  relatedSlugs?: string[];
};

const PUBLIC_REVALIDATE_SECONDS = 60;

const client = createClient({
  projectId,
  dataset: productionDataset,
  apiVersion,
  useCdn: true,
});

export const SANITY_ARTICLE_PROJECTION = [
  "{",
  "  title,",
  '  "slug": slug.current,',
  "  excerpt,",
  "  contentType,",
  '  "category": category->title,',
  '  "topics": topics[]->title,',
  '  "author": author->{',
  '    "_id": _id,',
  "    name,",
  '    "slug": slug.current,',
  "    entityType,",
  "    schemaName,",
  "    role,",
  "    linkedin",
  "  },",
  "  featuredImage {",
  "    externalUrl,",
  '    "assetUrl": image.asset->url,',
  "    alt,",
  "    caption,",
  "    credit,",
  "    displaySize",
  "  },",
  "  socialImage {",
  "    externalUrl,",
  '    "assetUrl": image.asset->url,',
  "    alt,",
  "    caption,",
  "    credit,",
  "    displaySize",
  "  },",
  "  seo {",
  "    metaTitle,",
  "    metaDescription,",
  "    canonicalOverride,",
  "    noIndex,",
  "    noFollow,",
  "    ogTitle,",
  "    ogDescription,",
  '    "ogImageUrl": ogImage.asset->url',
  "  },",
  "  publishedAt,",
  "  updatedAt,",
  "  readingTimeMinutes,",
  "  legacyOrder,",
  "  body,",
  "  featured,",
  "  cornerstone,",
  "  monetization,",
  '  "relatedSlugs": relatedArticles[]->slug.current',
  "}",
].join("\n");

const ANKIT_AUTHOR_SLUG = "ankit-l-kanoi-founder";
const ANKIT_PROFILE_URL = "https://tatkalclaims.com/about/#ankit-l-kanoi";
const ANKIT_LINKEDIN_URL =
  "https://www.linkedin.com/in/ankit-kanoi-9730b1403/";

function normalizeAuthor(
  author: SanityAuthorProjection | undefined
): ContentAuthor {
  const displayName = author?.name?.trim() || "Tatkal Claims";
  const slug = author?.slug?.trim() || undefined;
  const isKnownAnkit = slug === ANKIT_AUTHOR_SLUG;
  const entityType =
    author?.entityType || (isKnownAnkit ? "Person" : "Organization");
  const schemaName =
    author?.schemaName?.trim() ||
    (isKnownAnkit
      ? displayName.replace(/,\s*Founder$/i, "").trim()
      : displayName);
  const role = author?.role?.trim() || (isKnownAnkit ? "Founder" : undefined);
  const linkedin =
    author?.linkedin?.trim() || (isKnownAnkit ? ANKIT_LINKEDIN_URL : undefined);
  const profileUrl = isKnownAnkit ? ANKIT_PROFILE_URL : undefined;

  return {
    displayName,
    schemaName,
    entityType,
    slug,
    role,
    linkedin,
    profileUrl,
  };
}

function normalizeImage(
  image: SanityImageProjection | undefined,
  fallbackAlt: string
): ArticleImage | undefined {
  if (!image) return undefined;

  const url = image.externalUrl || image.assetUrl;
  if (!url) return undefined;

  return {
    url,
    alt: image.alt || fallbackAlt,
    caption: image.caption,
    credit: image.credit,
    displaySize: image.displaySize || "normal",
  };
}

export function mapSanityPost(post: SanityPostProjection): ContentPost {
  const image = normalizeImage(post.featuredImage, post.title);
  const authorEntity = normalizeAuthor(post.author);

  if (!image) {
    throw new Error('Sanity article "' + post.slug + '" has no usable featured image');
  }

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category || "Uncategorized",
    topics: post.topics || [],
    author: authorEntity.displayName,
    authorEntity,
    date: post.publishedAt.slice(0, 10),
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    readTime: post.readingTimeMinutes
      ? String(post.readingTimeMinutes) + " min read"
      : "Read time unavailable",
    readingTimeMinutes: post.readingTimeMinutes,
    legacyOrder: post.legacyOrder,
    image,
    socialImage: normalizeImage(post.socialImage, post.title),
    seo: post.seo,
    contentType: post.contentType,
    featured: Boolean(post.featured),
    cornerstone: Boolean(post.cornerstone),
    monetization: post.monetization || "none",
    relatedSlugs: post.relatedSlugs || [],
    body: post.body || [],
  };
}

export async function getSanityPosts(): Promise<ContentPost[]> {
  const query =
    '*[_type == "article"] | order(coalesce(legacyOrder, 999999) asc, publishedAt desc) ' +
    SANITY_ARTICLE_PROJECTION;
  const posts = await client.fetch<SanityPostProjection[]>(
    query,
    {},
    { next: { revalidate: PUBLIC_REVALIDATE_SECONDS } }
  );
  return posts.map(mapSanityPost);
}

export async function getSanityPostBySlug(
  slug: string
): Promise<ContentPost | null> {
  const query =
    '*[_type == "article" && slug.current == $slug][0] ' + SANITY_ARTICLE_PROJECTION;
  const post = await client.fetch<SanityPostProjection | null>(
    query,
    { slug },
    { next: { revalidate: PUBLIC_REVALIDATE_SECONDS } }
  );
  return post ? mapSanityPost(post) : null;
}
