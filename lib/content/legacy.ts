import blogsData from "@/lib/blogs";
import type { ContentPost } from "./types";

export function getLegacyPosts(): ContentPost[] {
  return blogsData.posts.map((post) => ({
    source: "legacy",
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    topics: [],
    author: post.author,
    date: post.date,
    publishedAt: post.date + "T00:00:00.000Z",
    readTime: post.readTime,
    readingTimeMinutes: Number(post.readTime.match(/(\d+)/)?.[1] || 0) || undefined,
    image: {
      url: post.image,
      alt: post.title,
      displaySize: "normal",
    },
    featured: false,
    cornerstone: false,
    monetization: "none",
    relatedSlugs: [],
    bodyFormat: "legacy",
    body: [],
    legacyContent: post.content,
  }));
}
