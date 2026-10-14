import {
  getSanityAuthorBySlug,
  getSanityAuthors,
  getSanityPostBySlug,
  getSanityPosts,
  getSanityPostSummaries,
  getSanityRelatedPostsBySlug,
} from "./sanity";
import type { AuthorProfile, ContentPost } from "./types";

export type { AuthorProfile, ContentPost } from "./types";

/**
 * Lightweight collection/listing adapter. Portable Text body content is
 * intentionally omitted so list, sitemap, static-param, author, and topic
 * requests stay well below Next.js data-cache limits.
 */
export async function getAllPosts(): Promise<ContentPost[]> {
  return getSanityPostSummaries();
}

/**
 * Full article collection for migration/verification tooling only. Public
 * article pages should fetch one full document with getPostBySlug().
 */
export async function getAllPostsWithBody(): Promise<ContentPost[]> {
  return getSanityPosts();
}

export async function getPostBySlug(
  slug: string
): Promise<ContentPost | null> {
  return getSanityPostBySlug(slug);
}

export async function getAllAuthors(): Promise<AuthorProfile[]> {
  return getSanityAuthors();
}

export async function getAuthorBySlug(
  slug: string
): Promise<AuthorProfile | null> {
  return getSanityAuthorBySlug(slug);
}

export async function getPostsByAuthorSlug(
  slug: string
): Promise<ContentPost[]> {
  const posts = await getAllPosts();

  return posts
    .filter((post) => post.authorEntity.slug === slug)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getRelatedPosts(
  slug: string,
  limit = 3
): Promise<ContentPost[]> {
  // Article detail routes deliberately avoid getAllPosts() here. A global
  // summary-cache dependency would make every article route stale whenever
  // any article is published. The Sanity adapter instead caches a small,
  // source-article-specific related set.
  return getSanityRelatedPostsBySlug(slug, limit);
}
