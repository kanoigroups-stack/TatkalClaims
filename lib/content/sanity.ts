import { createClient } from "next-sanity";
import {
  apiVersion,
  productionDataset,
  projectId,
} from "@/sanity/env";
import type {
  ArticleImage,
  ArticleSeo,
  AuthorProfile,
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
  credentials?: string[];
  bio?: string;
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
  "    credentials,",
  "    bio,",
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

const SITE_URL = "https://tatkalclaims.com";
const ANKIT_AUTHOR_SLUG = "ankit-l-kanoi-founder";
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
  const profileUrl = slug ? SITE_URL + "/author/" + slug + "/" : undefined;

  return {
    displayName,
    schemaName,
    entityType,
    slug,
    role,
    linkedin,
    credentials: author?.credentials,
    bio: author?.bio?.trim() || undefined,
    profileUrl,
  };
}

function mapSanityAuthor(
  author: SanityAuthorProjection | undefined
): AuthorProfile | null {
  const normalized = normalizeAuthor(author);

  if (!normalized.slug) return null;

  return {
    ...normalized,
    slug: normalized.slug,
  };
}

const SANITY_AUTHOR_PROJECTION = [
  "{",
  '  "_id": _id,',
  "  name,",
  '  "slug": slug.current,',
  "  entityType,",
  "  schemaName,",
  "  role,",
  "  credentials,",
  "  bio,",
  "  linkedin",
  "}",
].join("\n");

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
    '*[_type == "article"] | order(publishedAt desc) ' +
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


export async function getSanityAuthors(): Promise<AuthorProfile[]> {
  const query =
    '*[_type == "author" && defined(slug.current)] | order(name asc) ' +
    SANITY_AUTHOR_PROJECTION;
  const authors = await client.fetch<SanityAuthorProjection[]>(
    query,
    {},
    { next: { revalidate: PUBLIC_REVALIDATE_SECONDS } }
  );

  return authors
    .map(mapSanityAuthor)
    .filter((author): author is AuthorProfile => Boolean(author));
}

export async function getSanityAuthorBySlug(
  slug: string
): Promise<AuthorProfile | null> {
  const query =
    '*[_type == "author" && slug.current == $slug][0] ' +
    SANITY_AUTHOR_PROJECTION;
  const author = await client.fetch<SanityAuthorProjection | null>(
    query,
    { slug },
    { next: { revalidate: PUBLIC_REVALIDATE_SECONDS } }
  );

  return author ? mapSanityAuthor(author) : null;
}
