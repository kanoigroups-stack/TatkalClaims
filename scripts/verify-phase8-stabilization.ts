import { mkdir, readFile, writeFile } from "node:fs/promises";
import { buildArticleMetadata } from "../lib/content/seo";
import type { ContentPost } from "../lib/content/types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const [
    previewClient,
    publicSanityClient,
    previewIndex,
    previewArticle,
    stagingIndex,
    articleSchema,
    imageSchema,
    envExample,
    middleware,
    sitemap,
  ] = await Promise.all([
    readFile("lib/content/sanity-preview.ts", "utf8"),
    readFile("lib/content/sanity.ts", "utf8"),
    readFile("app/cms-preview/blog/page.tsx", "utf8"),
    readFile("app/cms-preview/blog/[slug]/page.tsx", "utf8"),
    readFile("app/cms-staging/blog/page.tsx", "utf8"),
    readFile("sanity/schemaTypes/documents/article.ts", "utf8"),
    readFile("sanity/schemaTypes/objects/articleImage.ts", "utf8"),
    readFile(".env.example", "utf8"),
    readFile("middleware.ts", "utf8"),
    readFile("app/sitemap.ts", "utf8"),
  ]);

  assert(
    previewClient.includes("process.env.SANITY_PREVIEW_TOKEN"),
    "Draft preview does not use the server-only preview token"
  );
  assert(
    previewClient.includes('perspective: "previewDrafts"'),
    "Draft preview is not using the Sanity previewDrafts perspective"
  );
  assert(
    (previewClient.match(/cache: "no-store"/g) || []).length >= 2,
    "Draft preview fetches must bypass Next.js caching"
  );
  assert(
    !previewClient.includes('perspective: "raw"'),
    "Draft preview must not use raw perspective for editorial rendering"
  );
  assert(
    previewClient.includes("useCdn: false"),
    "Draft preview must bypass the Sanity CDN"
  );
  assert(
    previewClient.includes("dataset: productionDataset"),
    "Draft preview is not locked to the production dataset"
  );
  assert(
    !previewClient.includes("SANITY_WRITE_TOKEN"),
    "Draft preview must not reuse the write token"
  );
  assert(
    !previewClient.includes("NEXT_PUBLIC_SANITY_PREVIEW_TOKEN"),
    "Draft preview token must never be public"
  );

  assert(
    publicSanityClient.includes("useCdn: true"),
    "Public Sanity reads must remain CDN-backed"
  );
  assert(
    publicSanityClient.includes("revalidate: PUBLIC_REVALIDATE_SECONDS"),
    "Public Sanity reads lost 60-second revalidation"
  );
  assert(
    !publicSanityClient.includes("SANITY_PREVIEW_TOKEN"),
    "Public Sanity client must not depend on the preview token"
  );

  assert(
    previewIndex.includes("getPreviewSanityPosts") &&
      previewArticle.includes("getPreviewSanityPostBySlug"),
    "CMS preview routes are not using authenticated draft readers"
  );
  assert(
    previewArticle.includes("generateMetadata") &&
      previewArticle.includes("buildArticleMetadata(post, { noIndex: true })"),
    "Draft article preview does not render protected draft SEO metadata"
  );
  assert(
    !previewIndex.includes('getAllPosts("sanity")'),
    "CMS preview index still uses the published-only adapter"
  );
  assert(
    stagingIndex.includes('getAllPosts("sanity")') &&
      stagingIndex.includes("CMS published parity"),
    "CMS staging route is not clearly identified as published parity"
  );

  assert(
    articleSchema.includes(
      'readOnly: ({ document }) => typeof document?.legacyOrder === "number"'
    ),
    "Migrated slugs are not locked"
  );
  assert(
    imageSchema.includes("hasUploadedImage") &&
      imageSchema.includes("hasExternalUrl") &&
      imageSchema.includes("Rule.required()"),
    "Article image validation is incomplete"
  );
  assert(
    articleSchema.includes(
      "Optional. Used for Open Graph and Twitter sharing. If left blank, the featured image is used."
    ) &&
      !articleSchema.includes("generated Tatkal Claims social card"),
    "Social-image editor guidance does not match frontend fallback behavior"
  );
  assert(
    imageSchema.includes(
      "Used only for images inserted inside the article body. Featured and social image placement ignores this setting."
    ),
    "Image display-size editor guidance does not explain its body-only scope"
  );

  assert(
    envExample.includes("SANITY_PREVIEW_TOKEN=") &&
      !envExample.includes("NEXT_PUBLIC_SANITY_PREVIEW_TOKEN"),
    "Preview-token environment example is unsafe"
  );
  assert(
    envExample.includes("CMS_PREVIEW_USERNAME=") &&
      envExample.includes("CMS_PREVIEW_PASSWORD="),
    "CMS preview route-auth environment variables are missing"
  );
  assert(
    middleware.includes('matcher: ["/cms-preview/:path*"]') &&
      middleware.includes("CMS_PREVIEW_USERNAME") &&
      middleware.includes("CMS_PREVIEW_PASSWORD") &&
      middleware.includes('"WWW-Authenticate"'),
    "CMS draft preview route is not protected by authentication"
  );

  assert(
    sitemap.includes(".filter((post) => !post.seo?.noIndex)"),
    "Noindex articles are not excluded from the sitemap"
  );

  const mock: ContentPost = {
    source: "sanity",
    slug: "phase8-test",
    title: "Default title",
    excerpt: "Default description",
    category: "Claim Rejection",
    topics: [],
    author: "Tatkal Claims",
    date: "2026-08-27",
    publishedAt: "2026-08-27T00:00:00.000Z",
    readTime: "5 min read",
    image: {
      url: "https://example.com/featured.jpg",
      alt: "Featured",
    },
    featured: false,
    cornerstone: false,
    monetization: "none",
    relatedSlugs: [],
    bodyFormat: "portableText",
    body: [],
  };

  const defaultMetadata: any = buildArticleMetadata(mock);
  assert(defaultMetadata.title === mock.title, "Default SEO title parity changed");
  assert(
    defaultMetadata.description === mock.excerpt,
    "Default SEO description parity changed"
  );
  assert(
    defaultMetadata.alternates?.canonical === "/blog/phase8-test/",
    "Default canonical parity changed"
  );
  assert(
    defaultMetadata.robots === undefined,
    "Default migrated-style metadata unexpectedly adds robots directives"
  );

  const overridden: ContentPost = {
    ...mock,
    seo: {
      metaTitle: "Editorial title",
      metaDescription: "Editorial description",
      canonicalOverride: "https://tatkalclaims.com/blog/editorial-canonical/",
      noIndex: true,
      noFollow: true,
      ogTitle: "Social title",
      ogDescription: "Social description",
      ogImageUrl: "https://example.com/social.jpg",
    },
  };

  const overrideMetadata: any = buildArticleMetadata(overridden);
  assert(overrideMetadata.title === "Editorial title", "SEO title override failed");
  assert(
    overrideMetadata.description === "Editorial description",
    "SEO description override failed"
  );
  assert(
    overrideMetadata.alternates?.canonical ===
      "https://tatkalclaims.com/blog/editorial-canonical/",
    "Canonical override failed"
  );
  assert(
    overrideMetadata.openGraph?.title === "Social title" &&
      overrideMetadata.openGraph?.description === "Social description" &&
      overrideMetadata.openGraph?.images?.[0]?.url ===
        "https://example.com/social.jpg",
    "Open Graph overrides failed"
  );
  assert(
    overrideMetadata.robots?.index === false &&
      overrideMetadata.robots?.follow === false,
    "SEO robots overrides failed"
  );

  const rollbackFiles = [
    "data/blogs.json",
    "lib/blogs-base.ts",
    "lib/blogs.ts",
    "components/blog/LegacyArticleBody.tsx",
    "migration/baseline/manifest.json",
  ];

  await Promise.all(rollbackFiles.map((path) => readFile(path, "utf8")));

  const report = {
    schemaVersion: 1,
    phase: "8A-stabilization",
    summary: {
      previewUsesProductionDataset: true,
      previewUsesAuthenticatedDraftNoStore: true,
      previewTokenServerOnly: true,
      previewRouteAuthenticationRequired: true,
      draftSeoMetadataPreview: true,
      publicSanityCachingPreserved: true,
      migratedSlugLockPresent: true,
      usableImageValidationPresent: true,
      mediaEditorGuidanceMatchesFrontend: true,
      seoDefaultParity: true,
      seoOverridesActive: true,
      noIndexSitemapExclusion: true,
      legacyRollbackFilesPresent: rollbackFiles.length,
      exactStaticChecks: true,
    },
  };

  await mkdir("migration/phase8", { recursive: true });
  await writeFile(
    "migration/phase8/stabilization-verification.json",
    JSON.stringify(report, null, 2) + "\n",
    "utf8"
  );

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
