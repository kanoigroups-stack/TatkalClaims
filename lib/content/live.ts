import type { ContentSource } from "./types";

export function getLiveContentSource(): ContentSource {
  const configured = process.env.BLOG_CONTENT_SOURCE;

  if (configured && configured !== "legacy" && configured !== "sanity") {
    throw new Error(
      'BLOG_CONTENT_SOURCE must be either "sanity" or "legacy"'
    );
  }

  return configured === "legacy" ? "legacy" : "sanity";
}
