import type { Metadata } from "next";
import type { AuthorProfile, ContentAuthor, ContentPost } from "./types";
import {
  getKnowledgeTopicByTitle,
  getKnowledgeTopicPath,
} from "./topics";

export const SITE_URL = "https://tatkalclaims.com";
export const ORGANIZATION_ID = SITE_URL + "/#organization";
export const WEBSITE_ID = SITE_URL + "/#website";

export function buildAuthorSchema(author: ContentAuthor) {
  if (author.entityType === "Person") {
    return {
      "@type": "Person",
      ...(author.profileUrl ? { "@id": author.profileUrl } : {}),
      name: author.schemaName,
      ...(author.profileUrl ? { url: author.profileUrl } : {}),
      ...(author.role ? { jobTitle: author.role } : {}),
      ...(author.linkedin ? { sameAs: [author.linkedin] } : {}),
      ...(author.bio ? { description: author.bio } : {}),
      ...(author.credentials?.length
        ? {
            hasCredential: author.credentials.map((credential) => ({
              "@type": "EducationalOccupationalCredential",
              name: credential,
            })),
          }
        : {}),
      worksFor: {
        "@id": ORGANIZATION_ID,
      },
    };
  }

  return {
    "@type": "Organization",
    ...(author.profileUrl ? { "@id": author.profileUrl } : {}),
    name: author.schemaName,
    ...(author.profileUrl ? { url: author.profileUrl } : {}),
    ...(author.bio ? { description: author.bio } : {}),
    parentOrganization: {
      "@id": ORGANIZATION_ID,
    },
  };
}

export function getPublicArticlePath(post: Pick<ContentPost, "slug">) {
  return `/blog/${post.slug}/`;
}

export function getPublicArticleUrl(post: Pick<ContentPost, "slug">) {
  return SITE_URL + getPublicArticlePath(post);
}

export function getAuthorPath(author: Pick<AuthorProfile, "slug">) {
  return "/author/" + author.slug + "/";
}

export function getAuthorUrl(author: Pick<AuthorProfile, "slug">) {
  return SITE_URL + getAuthorPath(author);
}

function getAuthorDescription(author: AuthorProfile) {
  return (
    author.bio ||
    (author.role
      ? author.schemaName + " — " + author.role + " at Tatkal Claims."
      : author.schemaName + " — author at Tatkal Claims.")
  );
}

export function buildAuthorProfileMetadata(author: AuthorProfile): Metadata {
  const description = getAuthorDescription(author);
  const path = getAuthorPath(author);

  return {
    title: author.schemaName,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: author.schemaName + " | Tatkal Claims",
      description,
      url: getAuthorUrl(author),
      type: "profile",
    },
  };
}

export function buildAuthorProfileSchema(
  author: AuthorProfile,
  posts: ContentPost[]
) {
  const url = getAuthorUrl(author);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": url + "#profilepage",
        url,
        name: author.schemaName,
        description: getAuthorDescription(author),
        mainEntity: {
          "@id": url,
        },
      },
      buildAuthorSchema({
        ...author,
        profileUrl: url,
      }),
      {
        "@type": "ItemList",
        name: "Articles by " + author.schemaName,
        numberOfItems: posts.length,
        itemListElement: posts.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: getPublicArticleUrl(post),
          name: post.title,
        })),
      },
    ],
  };
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
      tags: [
        post.category,
        ...post.topics,
        "insurance",
        "claim dispute",
        "india",
      ],
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
  const primaryTopic = post.topics[0]
    ? getKnowledgeTopicByTitle(post.topics[0])
    : undefined;

  const itemListElement = [
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
  ];

  if (primaryTopic) {
    itemListElement.push({
      "@type": "ListItem",
      position: 3,
      name: primaryTopic.title,
      item: SITE_URL + getKnowledgeTopicPath(primaryTopic),
    });
  }

  itemListElement.push({
    "@type": "ListItem",
    position: itemListElement.length + 1,
    name: post.title,
    item: getPublicArticleUrl(post),
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
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
    author: buildAuthorSchema(post.authorEntity),
    publisher: {
      "@id": ORGANIZATION_ID,
    },
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getPublicArticleUrl(post),
    },
    keywords: [
      post.category,
      ...post.topics,
      "insurance claim",
      "dispute resolution",
      "india",
    ],
    articleSection: post.topics[0] || post.category,
  };
}
