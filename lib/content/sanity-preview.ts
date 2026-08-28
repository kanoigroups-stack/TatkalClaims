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

type PreviewSanityPostProjection = SanityPostProjection & {
  _id: string;
};

const PREVIEW_ARTICLE_PROJECTION = SANITY_ARTICLE_PROJECTION.replace(
  "{",
  "{\n  _id,"
);

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
    // This repo currently uses @sanity/client 6.15.x while the Content Lake
    // API version is 2026-08-27. Use the long-supported raw perspective and
    // explicitly prefer drafts below so preview correctness does not depend on
    // newer perspective aliases/client semantics.
    perspective: "raw",
  });
}

function isDraft(post: PreviewSanityPostProjection) {
  return post._id.startsWith("drafts.");
}

function isReleaseVersion(post: PreviewSanityPostProjection) {
  return post._id.startsWith("versions.");
}

function canonicalDocumentId(post: PreviewSanityPostProjection) {
  return isDraft(post) ? post._id.slice("drafts.".length) : post._id;
}

export function preferDraftArticleDocuments(
  posts: PreviewSanityPostProjection[]
): PreviewSanityPostProjection[] {
  const selected = new Map<string, PreviewSanityPostProjection>();

  for (const post of posts) {
    if (isReleaseVersion(post)) continue;

    const key = canonicalDocumentId(post);
    const current = selected.get(key);

    if (!current || isDraft(post)) {
      selected.set(key, post);
    }
  }

  return Array.from(selected.values()).sort((a, b) => {
    const orderDifference =
      (a.legacyOrder ?? 999999) - (b.legacyOrder ?? 999999);

    if (orderDifference !== 0) return orderDifference;
    return b.publishedAt.localeCompare(a.publishedAt);
  });
}

export async function getPreviewSanityPosts(): Promise<ContentPost[]> {
  const query =
    '*[_type == "article" && defined(slug.current) && defined(title) && defined(excerpt) && defined(publishedAt)] ' +
    PREVIEW_ARTICLE_PROJECTION;

  const posts =
    await getPreviewClient().fetch<PreviewSanityPostProjection[]>(query);

  return preferDraftArticleDocuments(posts).map(mapSanityPost);
}

export async function getPreviewSanityPostBySlug(
  slug: string
): Promise<ContentPost | null> {
  const query =
    '*[_type == "article" && slug.current == $slug] ' +
    PREVIEW_ARTICLE_PROJECTION;

  const posts =
    await getPreviewClient().fetch<PreviewSanityPostProjection[]>(query, {
      slug,
    });

  const post = preferDraftArticleDocuments(posts)[0];
  return post ? mapSanityPost(post) : null;
}
