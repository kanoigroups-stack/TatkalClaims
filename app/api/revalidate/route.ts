import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import {
  SANITY_ARTICLE_DETAILS_TAG,
  SANITY_ARTICLE_SUMMARIES_TAG,
  SANITY_ARTICLES_FULL_TAG,
  SANITY_AUTHORS_TAG,
  getSanityArticleTag,
  getSanityAuthorTag,
} from "@/lib/content/cache";

type SupportedDocumentType = "article" | "author" | "category" | "topic";

type WebhookPayload = {
  _type?: string;
  slug?: string;
  previousSlug?: string;
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

function isSupportedDocumentType(value: string): value is SupportedDocumentType {
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

    if (!body?._type || !isSupportedDocumentType(body._type)) {
      return NextResponse.json(
        { message: "Unsupported or missing document type" },
        { status: 400 }
      );
    }

    const currentSlug = normalizeSlug(body.slug);
    const previousSlug = normalizeSlug(body.previousSlug);
    const paths = new Set<string>();
    const patterns = new Set<string>();

    const markPath = (path: string) => {
      revalidatePath(path);
      paths.add(path);
    };

    const markPattern = (path: string) => {
      revalidatePath(path, "page");
      patterns.add(path);
    };

    if (body._type === "article") {
      revalidateTag(SANITY_ARTICLE_SUMMARIES_TAG);
      revalidateTag(SANITY_ARTICLES_FULL_TAG);

      if (currentSlug) {
        revalidateTag(getSanityArticleTag(currentSlug));
        markPath(`/blog/${currentSlug}/`);
      }

      if (previousSlug && previousSlug !== currentSlug) {
        revalidateTag(getSanityArticleTag(previousSlug));
        markPath(`/blog/${previousSlug}/`);
      }

      markPath("/");
      markPath("/blog/");
      markPath("/sitemap.xml");
      markPattern("/blog/topic/[slug]");
      markPattern("/author/[slug]");
    }

    if (body._type === "author") {
      revalidateTag(SANITY_AUTHORS_TAG);
      revalidateTag(SANITY_ARTICLE_SUMMARIES_TAG);
      revalidateTag(SANITY_ARTICLE_DETAILS_TAG);
      revalidateTag(SANITY_ARTICLES_FULL_TAG);

      if (currentSlug) {
        revalidateTag(getSanityAuthorTag(currentSlug));
        markPath(`/author/${currentSlug}/`);
      }

      if (previousSlug && previousSlug !== currentSlug) {
        revalidateTag(getSanityAuthorTag(previousSlug));
        markPath(`/author/${previousSlug}/`);
      }

      markPath("/");
      markPath("/blog/");
      markPath("/sitemap.xml");
      markPattern("/blog/[slug]");
      markPattern("/blog/topic/[slug]");
    }

    if (body._type === "category" || body._type === "topic") {
      revalidateTag(SANITY_ARTICLE_SUMMARIES_TAG);
      revalidateTag(SANITY_ARTICLE_DETAILS_TAG);
      revalidateTag(SANITY_ARTICLES_FULL_TAG);

      markPath("/");
      markPath("/blog/");
      markPath("/sitemap.xml");
      markPattern("/blog/[slug]");
      markPattern("/blog/topic/[slug]");
    }

    return NextResponse.json({
      revalidated: true,
      documentType: body._type,
      paths: [...paths],
      patterns: [...patterns],
    });
  } catch (error: unknown) {
    console.error("Sanity revalidation failed", error);
    return NextResponse.json(
      { message: "Revalidation failed" },
      { status: 500 }
    );
  }
}
