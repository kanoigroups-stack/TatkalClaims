import type { Metadata } from "next";
import type { ContentPost } from "./types";

const SITE_URL = "https://tatkalclaims.com";

export function getPublicArticlePath(post: Pick<ContentPost, "slug">) {
  return `/blog/${post.slug}/`;
}

export function getPublicArticleUrl(post: Pick<ContentPost, "slug">) {
  return SITE_URL + getPublicArticlePath(post);
}

export function buildArticleMetadata(
  post: ContentPost,
  options: { noIndex?: boolean } = {}
): Metadata {
  const seo = post.seo;
  const title = seo?.metaTitle?.trim() || post.title;
  const description = seo?.metaDescription?.trim() || post.excerpt;
  const openGraphTitle = seo?.ogTitle?.trim() || title;
  const openGraphDescription = seo?.ogDescription?.trim() || description;
  const image = seo?.ogImageUrl || post.socialImage?.url || post.image.url;
  const modifiedTime = post.updatedAt || post.date;
  const canonical =
    seo?.canonicalOverride?.trim() || getPublicArticlePath(post);
  const noIndex = Boolean(options.noIndex || seo?.noIndex);
  const noFollow = Boolean(options.noIndex || seo?.noFollow);
  const hasRobotsOverride = noIndex || noFollow;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: hasRobotsOverride
      ? {
          index: !noIndex,
          follow: !noFollow,
          nocache: noIndex,
          googleBot: {
            index: !noIndex,
            follow: !noFollow,
            noimageindex: noIndex,
          },
        }
      : undefined,
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      images: [
        {
          url: image,
          width: 800,
          height: 400,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.date,
      modifiedTime,
      authors: [post.author],
      tags: [post.category, "insurance", "claim dispute", "india"],
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle,
      description: openGraphDescription,
      images: [image],
    },
  };
}

export function buildBreadcrumbSchema(post: ContentPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL + "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Knowledge Center",
        item: SITE_URL + "/blog/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: getPublicArticleUrl(post),
      },
    ],
  };
}

export function buildArticleSchema(post: ContentPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: {
      "@type": "ImageObject",
      url: post.image.url,
      width: 800,
      height: 400,
    },
    author: {
      "@type": "Organization",
      name: post.author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Tatkal Claims",
      logo: {
        "@type": "ImageObject",
        url: SITE_URL + "/logo.png",
        width: 512,
        height: 512,
      },
    },
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getPublicArticleUrl(post),
    },
    keywords: [post.category, "insurance claim", "dispute resolution", "india"],
    articleSection: post.category,
  };
}
