import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content";
import { getLiveContentSource } from "@/lib/content/live";
import { getAllServiceSlugs } from "@/lib/services";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://tatkalclaims.com";

  // Static pages
  const staticPages = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/about/`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/services/`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/how-it-works/`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/why-us/`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/faqs/`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/partner-with-us/`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/privacy-policy/`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms-and-conditions/`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  // Service detail pages
  const servicePages = getAllServiceSlugs().map((slug) => ({
    url: `${baseUrl}/services/${slug}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Blog posts from the active content adapter source
  const posts = await getAllPosts(getLiveContentSource());
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...blogPages];
}
