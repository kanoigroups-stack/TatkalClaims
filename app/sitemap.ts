import { MetadataRoute } from "next";
import blogsData from "@/data/blogs.json";
import { getAllServiceSlugs } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tatkalclaims.com";
  const buildDate = new Date("2026-08-20");

  const staticPages = [
    { url: baseUrl, lastModified: buildDate, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/services/`, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 0.95 },
    { url: `${baseUrl}/how-it-works/`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/why-us/`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/faqs/`, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/blog/`, lastModified: buildDate, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/partner-with-us/`, lastModified: buildDate, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/privacy-policy/`, lastModified: buildDate, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms-and-conditions/`, lastModified: buildDate, changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const servicePages = getAllServiceSlugs().map((slug) => ({
    url: `${baseUrl}/services/${slug}/`,
    lastModified: buildDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogPosts = blogsData.posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages, ...blogPosts];
}
