import type { ContentPost } from "./types";

const CORE_GUIDE_SLUGS = [
  "claim-rejection-guide",
  "claim-delay-tactics",
  "mis-selling-guide",
] as const;

function uniquePosts(posts: ContentPost[]) {
  const seen = new Set<string>();
  return posts.filter((post) => {
    if (seen.has(post.slug)) return false;
    seen.add(post.slug);
    return true;
  });
}

export function sortPostsNewestFirst(posts: ContentPost[]) {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function selectEssentialKnowledgePosts(
  posts: ContentPost[],
  limit = 3
) {
  const newest = sortPostsNewestFirst(posts);
  const cornerstone = newest.filter((post) => post.cornerstone);
  const protectedCore = CORE_GUIDE_SLUGS.map((slug) =>
    posts.find((post) => post.slug === slug)
  ).filter((post): post is ContentPost => Boolean(post));
  const featured = newest.filter((post) => post.featured);

  return uniquePosts([
    ...cornerstone,
    ...protectedCore,
    ...featured,
    ...newest,
  ]).slice(0, Math.max(0, limit));
}

export function selectHomepageKnowledgePosts(
  posts: ContentPost[],
  limit = 3
) {
  const newest = sortPostsNewestFirst(posts);
  const featured = newest.filter((post) => post.featured);
  const essential = selectEssentialKnowledgePosts(posts, limit);

  return uniquePosts([
    ...featured,
    ...essential,
    ...newest,
  ]).slice(0, Math.max(0, limit));
}
