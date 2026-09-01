import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { getAllPosts, getPostBySlug } from "../lib/content";
import {
  buildArticleMetadata,
  buildArticleSchema,
  buildBreadcrumbSchema,
  getPublicArticlePath,
} from "../lib/content/seo";

const EXPECTED_MIGRATED_ARTICLES = 56;
const RETIRED_DUPLICATE_LEGACY_ORDER = 30;
const EXPECTED_MIGRATED_ORDERS = Array.from({ length: 57 }, (_, index) => index).filter(
  (value) => value !== RETIRED_DUPLICATE_LEGACY_ORDER
);
const PROTECTED_SLUGS = [
  "claim-rejection-guide",
  "irdai-30-day-claim-settlement-rule-health-insurance-rights",
  "mis-selling-guide",
] as const;

const RETIRED_RUNTIME_PATHS = [
  "data/blogs.json",
  "lib/blogs-base.ts",
  "lib/blogs.ts",
  "lib/content/legacy.ts",
  "lib/content/live.ts",
  "components/blog/LegacyArticleBody.tsx",
] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function exists(path: string) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const retiredStillPresent: string[] = [];
  for (const path of RETIRED_RUNTIME_PATHS) {
    if (await exists(path)) retiredStillPresent.push(path);
  }
  assert(
    retiredStillPresent.length === 0,
    "Legacy runtime files are still present: " + retiredStillPresent.join(", ")
  );

  const [
    contentIndex,
    contentTypes,
    publicArticle,
    publicArchive,
    homepage,
    sitemap,
    sanityClient,
    sanityPreview,
    articleSchemaFile,
    envExample,
    nextConfig,
  ] = await Promise.all([
    readFile("lib/content/index.ts", "utf8"),
    readFile("lib/content/types.ts", "utf8"),
    readFile("app/blog/[slug]/page.tsx", "utf8"),
    readFile("app/blog/page.tsx", "utf8"),
    readFile("app/page.tsx", "utf8"),
    readFile("app/sitemap.ts", "utf8"),
    readFile("lib/content/sanity.ts", "utf8"),
    readFile("lib/content/sanity-preview.ts", "utf8"),
    readFile("sanity/schemaTypes/documents/article.ts", "utf8"),
    readFile(".env.example", "utf8"),
    readFile("next.config.js", "utf8"),
  ]);

  const publicRuntimeFiles = {
    "lib/content/index.ts": contentIndex,
    "app/blog/[slug]/page.tsx": publicArticle,
    "app/blog/page.tsx": publicArchive,
    "app/page.tsx": homepage,
    "app/sitemap.ts": sitemap,
  };

  for (const [path, source] of Object.entries(publicRuntimeFiles)) {
    assert(!source.includes("BLOG_CONTENT_SOURCE"), path + " still references BLOG_CONTENT_SOURCE");
    assert(!source.includes("getLiveContentSource"), path + " still references getLiveContentSource");
    assert(!source.includes("LegacyArticleBody"), path + " still references LegacyArticleBody");
    assert(!source.includes("@/lib/blogs"), path + " still imports legacy blog utilities");
    assert(!source.includes("@/data/blogs.json"), path + " still imports legacy blog data");
    assert(!source.includes("./legacy"), path + " still imports the legacy content adapter");
  }

  assert(!envExample.includes("BLOG_CONTENT_SOURCE"), ".env.example still exposes BLOG_CONTENT_SOURCE");
  assert(!contentTypes.includes("ContentSource"), "ContentSource legacy switching type still exists");
  assert(!contentTypes.includes("legacyContent"), "legacyContent still exists in ContentPost");
  assert(!contentTypes.includes("bodyFormat"), "bodyFormat still exists in ContentPost");
  assert(
    !sanityClient.includes('source: "sanity"') && !sanityClient.includes('bodyFormat: "portableText"'),
    "Sanity mapper still carries retired source/body-format compatibility fields"
  );
  assert(
    publicArticle.includes("<PortableArticleBody value={post.body} />"),
    "Public article route does not render Portable Text directly"
  );

  assert(
    sanityClient.includes('"  legacyOrder,"') &&
      articleSchemaFile.includes('name: "legacyOrder"'),
    "legacyOrder migration evidence is no longer retained in the Sanity projection/schema"
  );
  assert(
    sanityClient.includes("order(publishedAt desc)") &&
      !sanityClient.includes("order(coalesce(legacyOrder"),
    "Public Sanity ordering must use publishedAt rather than legacyOrder"
  );
  assert(
    sanityPreview.includes("order(publishedAt desc)") &&
      !sanityPreview.includes("order(coalesce(legacyOrder"),
    "Preview Sanity ordering must use publishedAt rather than legacyOrder"
  );

  assert(
    nextConfig.includes("what-to-do-if-insurance-claim-is-rejected-complete-guide") &&
      nextConfig.includes("claim-rejection-guide") &&
      nextConfig.includes("permanent: true"),
    "Protected permanent claim-rejection redirect is missing"
  );

  const posts = await getAllPosts();
  assert(
    posts.length >= EXPECTED_MIGRATED_ARTICLES,
    "Expected at least 56 published Sanity articles, found " + posts.length
  );

  const slugs = posts.map((post) => post.slug);
  assert(new Set(slugs).size === slugs.length, "Duplicate published Sanity slugs found");

  for (const slug of PROTECTED_SLUGS) {
    assert(slugs.includes(slug), "Protected slug missing from Sanity: " + slug);
    const post = await getPostBySlug(slug);
    assert(post?.slug === slug, "Protected slug lookup failed: " + slug);
  }

  const migratedOrders = posts
    .map((post) => post.legacyOrder)
    .filter((value): value is number => typeof value === "number")
    .sort((a, b) => a - b);

  assert(
    migratedOrders.length === EXPECTED_MIGRATED_ARTICLES,
    "Expected all 56 migrated articles to retain legacyOrder after duplicate retirement"
  );
  assert(
    migratedOrders.every(
      (value, index) => value === EXPECTED_MIGRATED_ORDERS[index]
    ),
    "legacyOrder no longer preserves the migrated sequence after retiring legacyOrder 30"
  );

  for (const post of posts) {
    assert(post.image.url.length > 0, "Missing featured image URL for " + post.slug);
    assert(post.image.alt.trim().length > 0, "Missing featured image alt text for " + post.slug);
    assert(Array.isArray(post.body), "Portable Text body missing for " + post.slug);

    const metadata = buildArticleMetadata(post);
    const canonical = metadata.alternates?.canonical;
    assert(Boolean(canonical), "Canonical missing for " + post.slug);

    if (!post.seo?.canonicalOverride?.trim()) {
      assert(
        canonical === getPublicArticlePath(post),
        "Default canonical changed for " + post.slug
      );
    }

    const articleSchema = buildArticleSchema(post);
    const breadcrumbSchema = buildBreadcrumbSchema(post);
    assert(articleSchema.headline === post.title, "Article schema headline mismatch for " + post.slug);
    assert(
      breadcrumbSchema.itemListElement[
        breadcrumbSchema.itemListElement.length - 1
      ]?.item.endsWith("/blog/" + post.slug + "/"),
      "Breadcrumb public URL mismatch for " + post.slug
    );
  }

  const report = {
    phase: "9B",
    mode: "legacy-runtime-retirement-dry-run",
    articleCount: posts.length,
    draftExpectation: "Published-only public adapter; draft checks remain in authenticated preview safeguards",
    protectedSlugs: PROTECTED_SLUGS,
    retiredRuntimePaths: RETIRED_RUNTIME_PATHS,
    legacyOrder: {
      retained: true,
      usedForEditorialOrdering: false,
      migratedCount: migratedOrders.length,
      min: migratedOrders[0],
      max: migratedOrders[migratedOrders.length - 1],
      retiredDuplicateOrder: RETIRED_DUPLICATE_LEGACY_ORDER,
    },
    seo: {
      protectedRedirectPresent: true,
      defaultCanonicalPatternPreserved: true,
      trailingSlashPatternPreserved: true,
    },
  };

  await mkdir("migration/verification", { recursive: true });
  await writeFile(
    "migration/verification/application-safety-verification.json",
    JSON.stringify(report, null, 2) + "\n",
    "utf8"
  );

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
