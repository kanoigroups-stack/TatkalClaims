import { MetadataRoute } from "next";
import { getAllAuthors, getAllPosts } from "@/lib/content";
import { getAuthorPath } from "@/lib/content/seo";
import {
  KNOWLEDGE_TOPICS,
  getKnowledgeTopicPath,
} from "@/lib/content/topics";
import { getAllServiceSlugs } from "@/lib/services";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://tatkalclaims.com";

  // Do not emit a synthetic lastModified timestamp for static pages.
  // Search engines should only receive freshness dates we can substantiate.
  const staticPages = [
    { url: `${baseUrl}/`, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/about/`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/services/`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/blog/`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/how-it-works/`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/why-us/`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/faqs/`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/partner-with-us/`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/privacy-policy/`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms-and-conditions/`, changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  // Service pages are code-backed and do not currently expose a reliable
  // per-page modification date, so omit lastModified rather than invent one.
  const servicePages = getAllServiceSlugs().map((slug) => ({
    url: `${baseUrl}/services/${slug}/`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Topic landing pages are code-backed collections over the Sanity taxonomy.
  const topicPages = KNOWLEDGE_TOPICS.map((topic) => ({
    url: baseUrl + getKnowledgeTopicPath(topic),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Author profile pages are backed by published Sanity author records.
  const authors = await getAllAuthors();
  const authorPages = authors.map((author) => ({
    url: baseUrl + getAuthorPath(author),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Blog posts from the Sanity production adapter.
  // Use a real substantive updatedAt when present; otherwise preserve the
  // original publication date.
  const posts = await getAllPosts();
  const blogPages = posts
    .filter((post) => !post.seo?.noIndex)
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}/`,
      lastModified: new Date(post.updatedAt || post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [
    ...staticPages,
    ...servicePages,
    ...topicPages,
    ...authorPages,
    ...blogPages,
  ];
}
