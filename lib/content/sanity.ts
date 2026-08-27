import { createClient } from "next-sanity";
import {
  apiVersion,
  productionDataset,
  projectId,
} from "@/sanity/env";
import type { ArticleImage, ContentPost } from "./types";

type SanityImageProjection = {
  externalUrl?: string;
  assetUrl?: string;
  alt?: string;
  caption?: string;
  credit?: string;
  displaySize?: "normal" | "wide" | "full";
};

type SanityPostProjection = {
  slug: string;
  title: string;
  excerpt: string;
  contentType?: string;
  category?: string;
  topics?: string[];
  author?: string;
  featuredImage?: SanityImageProjection;
  socialImage?: SanityImageProjection;
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

const articleProjection = [
  "{",
  "  title,",
  '  "slug": slug.current,',
  "  excerpt,",
  "  contentType,",
  '  "category": category->title,',
  '  "topics": topics[]->title,',
  '  "author": author->name,',
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

function mapSanityPost(post: SanityPostProjection): ContentPost {
  const image = normalizeImage(post.featuredImage, post.title);

  if (!image) {
    throw new Error('Sanity article "' + post.slug + '" has no usable featured image');
  }

  return {
    source: "sanity",
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category || "Uncategorized",
    topics: post.topics || [],
    author: post.author || "Tatkal Claims",
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
    contentType: post.contentType,
    featured: Boolean(post.featured),
    cornerstone: Boolean(post.cornerstone),
    monetization: post.monetization || "none",
    relatedSlugs: post.relatedSlugs || [],
    bodyFormat: "portableText",
    body: post.body || [],
  };
}

export async function getSanityPosts(): Promise<ContentPost[]> {
  const query =
    '*[_type == "article"] | order(coalesce(legacyOrder, 999999) asc, publishedAt desc) ' +
    articleProjection;
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
    '*[_type == "article" && slug.current == $slug][0] ' + articleProjection;
  const post = await client.fetch<SanityPostProjection | null>(
    query,
    { slug },
    { next: { revalidate: PUBLIC_REVALIDATE_SECONDS } }
  );
  return post ? mapSanityPost(post) : null;
}
