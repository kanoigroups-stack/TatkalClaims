import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import {
  SANITY_ARTICLE_SUMMARIES_TAG,
  SANITY_ARTICLES_FULL_TAG,
  SANITY_AUTHORS_TAG,
  getSanityArticleTag,
  getSanityAuthorTag,
} from "@/lib/content/cache";
import {
  getSanityArticleSlugsReferencingDocument,
  type SanityArticleReferenceKind,
} from "@/lib/content/sanity";
import {
  getKnowledgeTopicByTitle,
  getKnowledgeTopicPath,
} from "@/lib/content/topics";
import {
  productionDataset,
  projectId as expectedProjectId,
} from "@/sanity/env";

type SupportedDocumentType = "article" | "author" | "category" | "topic";

type WebhookSnapshot = {
  _id?: string;
  _type?: string;
  slug?: string;
  authorSlug?: string;
  topicTitles?: string[];
  title?: string;
};

type WebhookPayload = {
  projectId?: string;
  dataset?: string;
  before?: WebhookSnapshot | null;
  after?: WebhookSnapshot | null;
};

const SUPPORTED_DOCUMENT_TYPES = new Set<SupportedDocumentType>([
  "article",
  "author",
  "category",
  "topic",
]);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

function normalizeSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const slug = value.trim();
  return SLUG_PATTERN.test(slug) ? slug : null;
}

function normalizeStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isSupportedDocumentType(
  value: string
): value is SupportedDocumentType {
  return SUPPORTED_DOCUMENT_TYPES.has(value as SupportedDocumentType);
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { message: "Missing SANITY_REVALIDATE_SECRET" },
      { status: 500 }
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      secret,
      true
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    if (
      body?.projectId !== expectedProjectId ||
      body?.dataset !== productionDataset
    ) {
      return NextResponse.json(
        { message: "Unexpected Sanity project or dataset" },
        { status: 400 }
      );
    }

    const before = body.before || null;
    const after = body.after || null;
    const documentType = after?._type || before?._type;

    if (!documentType || !isSupportedDocumentType(documentType)) {
      return NextResponse.json(
        { message: "Unsupported or missing document type" },
        { status: 400 }
      );
    }

    const documentId = after?._id || before?._id || null;
    const currentSlug = normalizeSlug(after?.slug);
    const previousSlug = normalizeSlug(before?.slug);
    const paths = new Set<string>();

    const markPath = (path: string) => {
      revalidatePath(path);
      paths.add(path);
    };

    const invalidateArticle = (slug: string) => {
      revalidateTag(getSanityArticleTag(slug));
      markPath(`/blog/${slug}/`);
    };

    const markAuthor = (slug: string | null) => {
      if (!slug) return;
      revalidateTag(getSanityAuthorTag(slug));
      markPath(`/author/${slug}/`);
    };

    const markTopicTitles = (titles: string[]) => {
      for (const title of titles) {
        const topic = getKnowledgeTopicByTitle(title);
        if (topic) markPath(getKnowledgeTopicPath(topic));
      }
    };

    const getAffectedArticleSlugs = async (
      kind: SanityArticleReferenceKind
    ) => {
      if (!documentId) return [];
      return getSanityArticleSlugsReferencingDocument(documentId, kind);
    };

    if (documentType === "article") {
      revalidateTag(SANITY_ARTICLE_SUMMARIES_TAG);
      revalidateTag(SANITY_ARTICLES_FULL_TAG);

      if (currentSlug) invalidateArticle(currentSlug);
      if (previousSlug && previousSlug !== currentSlug) {
        invalidateArticle(previousSlug);
      }

      // If other articles explicitly feature this one in relatedArticles,
      // refresh only those source pages so their cards cannot retain stale
      // title/excerpt/image/read-time metadata.
      const inboundRelatedSlugs =
        await getAffectedArticleSlugs("relatedArticle");
      for (const slug of inboundRelatedSlugs) {
        if (slug !== currentSlug && slug !== previousSlug) {
          invalidateArticle(slug);
        }
      }

      markPath("/");
      markPath("/blog/");
      markPath("/sitemap.xml");

      const authorSlugs = new Set(
        [normalizeSlug(before?.authorSlug), normalizeSlug(after?.authorSlug)]
          .filter((slug): slug is string => Boolean(slug))
      );
      for (const slug of authorSlugs) markAuthor(slug);

      markTopicTitles([
        ...new Set([
          ...normalizeStrings(before?.topicTitles),
          ...normalizeStrings(after?.topicTitles),
        ]),
      ]);
    }

    if (documentType === "author") {
      revalidateTag(SANITY_AUTHORS_TAG);
      revalidateTag(SANITY_ARTICLE_SUMMARIES_TAG);
      revalidateTag(SANITY_ARTICLES_FULL_TAG);

      markAuthor(currentSlug);
      if (previousSlug && previousSlug !== currentSlug) {
        markAuthor(previousSlug);
      }

      const affectedArticleSlugs = await getAffectedArticleSlugs("author");
      for (const slug of affectedArticleSlugs) invalidateArticle(slug);

      markPath("/");
      markPath("/blog/");
      markPath("/sitemap.xml");
    }

    if (documentType === "category") {
      revalidateTag(SANITY_ARTICLE_SUMMARIES_TAG);
      revalidateTag(SANITY_ARTICLES_FULL_TAG);

      const affectedArticleSlugs = await getAffectedArticleSlugs("category");
      for (const slug of affectedArticleSlugs) invalidateArticle(slug);

      markPath("/");
      markPath("/blog/");
      markPath("/sitemap.xml");
    }

    if (documentType === "topic") {
      revalidateTag(SANITY_ARTICLE_SUMMARIES_TAG);
      revalidateTag(SANITY_ARTICLES_FULL_TAG);

      const affectedArticleSlugs = await getAffectedArticleSlugs("topic");
      for (const slug of affectedArticleSlugs) invalidateArticle(slug);

      markTopicTitles([
        ...new Set([
          ...normalizeStrings([before?.title]),
          ...normalizeStrings([after?.title]),
        ]),
      ]);

      markPath("/");
      markPath("/blog/");
      markPath("/sitemap.xml");
    }

    return NextResponse.json({
      revalidated: true,
      documentType,
      paths: [...paths],
    });
  } catch (error: unknown) {
    console.error("Sanity revalidation failed", error);
    return NextResponse.json(
      { message: "Revalidation failed" },
      { status: 500 }
    );
  }
}
