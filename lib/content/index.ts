import { getSanityPostBySlug, getSanityPosts } from "./sanity";
import type { ContentPost } from "./types";

export type { ContentPost } from "./types";

export async function getAllPosts(): Promise<ContentPost[]> {
  return getSanityPosts();
}

export async function getPostBySlug(
  slug: string
): Promise<ContentPost | null> {
  return getSanityPostBySlug(slug);
}

export async function getLatestPosts(
  limit: number
): Promise<ContentPost[]> {
  const posts = await getAllPosts();
  return [...posts]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, Math.max(0, limit));
}

export async function getFeaturedPosts(): Promise<ContentPost[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.featured);
}

export async function getPostsByCategory(
  category: string
): Promise<ContentPost[]> {
  const posts = await getAllPosts();
  return posts.filter(
    (post) => post.category.toLowerCase() === category.toLowerCase()
  );
}

export async function getRelatedPosts(
  slug: string,
  limit = 3
): Promise<ContentPost[]> {
  const posts = await getAllPosts();
  const target = posts.find((post) => post.slug === slug);

  if (!target) return [];

  const bySlug = new Map(posts.map((post) => [post.slug, post]));
  const selected: ContentPost[] = [];
  const seen = new Set<string>([target.slug]);

  for (const relatedSlug of target.relatedSlugs) {
    const related = bySlug.get(relatedSlug);
    if (related && !seen.has(related.slug)) {
      selected.push(related);
      seen.add(related.slug);
    }
  }

  const scored = posts
    .filter((post) => !seen.has(post.slug))
    .map((post) => {
      const sharedTopics = post.topics.filter((topic) =>
        target.topics.includes(topic)
      ).length;

      const score =
        sharedTopics * 4 +
        (post.category === target.category ? 3 : 0) +
        (post.contentType && post.contentType === target.contentType ? 1 : 0);

      return { post, score };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.post.publishedAt.localeCompare(a.post.publishedAt)
    );

  for (const candidate of scored) {
    if (selected.length >= limit) break;
    selected.push(candidate.post);
  }

  return selected.slice(0, limit);
}
