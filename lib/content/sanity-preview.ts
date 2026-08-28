import { createClient } from "next-sanity";
import {
  apiVersion,
  productionDataset,
  projectId,
} from "@/sanity/env";
import {
  mapSanityPost,
  SANITY_ARTICLE_PROJECTION,
  type SanityPostProjection,
} from "./sanity";
import type { ContentPost } from "./types";

function getPreviewClient() {
  const token = process.env.SANITY_PREVIEW_TOKEN;

  if (!token) {
    throw new Error(
      "SANITY_PREVIEW_TOKEN is required for authenticated Sanity draft previews"
    );
  }

  return createClient({
    projectId,
    dataset: productionDataset,
    apiVersion,
    useCdn: false,
    token,
    perspective: "previewDrafts",
  });
}

export async function getPreviewSanityPosts(): Promise<ContentPost[]> {
  const query =
    '*[_type == "article" && defined(slug.current) && defined(title) && defined(excerpt) && defined(publishedAt)] | ' +
    "order(coalesce(legacyOrder, 999999) asc, publishedAt desc) " +
    SANITY_ARTICLE_PROJECTION;

  const posts = await getPreviewClient().fetch<SanityPostProjection[]>(
    query,
    {},
    { cache: "no-store" }
  );

  return posts.map(mapSanityPost);
}

export async function getPreviewSanityPostBySlug(
  slug: string
): Promise<ContentPost | null> {
  const query =
    '*[_type == "article" && slug.current == $slug][0] ' +
    SANITY_ARTICLE_PROJECTION;

  const post = await getPreviewClient().fetch<SanityPostProjection | null>(
    query,
    { slug },
    { cache: "no-store" }
  );

  return post ? mapSanityPost(post) : null;
}
