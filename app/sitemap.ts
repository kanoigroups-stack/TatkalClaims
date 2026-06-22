import { MetadataRoute } from "next";
import blogsData from "@/data/blogs.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.tatkalclaims.com";
  const buildDate = new Date("2026-06-22");

  const staticPages = [
    { url: baseUrl, lastModified: buildDate, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/blog/`, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/privacy-policy/`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/terms-and-conditions/`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/partner-with-us/`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const blogPosts = blogsData.posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPosts];
}
