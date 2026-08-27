import { mkdir, readFile, writeFile } from "node:fs/promises";
import { getAllPosts } from "../lib/content";
import {
  buildArticleMetadata,
  buildArticleSchema,
  buildBreadcrumbSchema,
  getPublicArticleUrl,
} from "../lib/content/seo";
import { PORTABLE_TEXT_RENDERER_COVERAGE } from "../components/blog/PortableArticleBody";

const EXPECTED_ARTICLES = 57;
const EXPECTED_DOCUMENTS = 65;
const PROTECTED_SLUGS = [
  "claim-rejection-guide",
  "irdai-30-day-claim-settlement-rule-health-insurance-rights",
  "mis-selling-guide",
];
const WARNING_SLUGS = [
  "e20-ethanol-petrol-insurance-claim-rejection-india",
  "manipal-cigna-denied-brain-tumour-surgery-claim-shifting-grounds-delhi-consumer-commission-rs-2-33-lakh",
  "car-stolen-parked-under-tree-branches-insurer-denied-claim-consumer-commission-rs-2-26-lakh",
];
const REPRESENTATIVE_SLUGS = [
  "claim-rejection-guide",
  "mis-selling-guide",
  "irdai-30-day-claim-settlement-rule-health-insurance-rights",
  "borrowed-car-accident-insurance-claim-delhi-hc",
  "e20-ethanol-petrol-insurance-claim-rejection-india",
  "manipal-cigna-denied-brain-tumour-surgery-claim-shifting-grounds-delhi-consumer-commission-rs-2-33-lakh",
  "car-stolen-parked-under-tree-branches-insurer-denied-claim-consumer-commission-rs-2-26-lakh",
  "best-online-car-insurance-companies-india-claim-settlement-ratio",
];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const baseline = JSON.parse(
    await readFile("migration/baseline/manifest.json", "utf8")
  );
  const migrationReport = JSON.parse(
    await readFile("migration/sanity/report.json", "utf8")
  );
  const nextConfig = await readFile("next.config.js", "utf8");
  const stagingLayout = await readFile("app/cms-staging/layout.tsx", "utf8");

  const [legacyPosts, sanityPosts] = await Promise.all([
    getAllPosts("legacy"),
    getAllPosts("sanity"),
  ]);

  assert(legacyPosts.length === EXPECTED_ARTICLES, "Legacy count changed");
  assert(sanityPosts.length === EXPECTED_ARTICLES, "Sanity count changed");
  assert(migrationReport.summary.documents === EXPECTED_DOCUMENTS, "Migration document count changed");

  const legacySlugs = legacyPosts.map((post) => post.slug);
  const sanitySlugs = sanityPosts.map((post) => post.slug);

  assert(
    legacySlugs.every((slug, index) => slug === sanitySlugs[index]),
    "Sanity archive order does not match legacy order"
  );

  sanityPosts.forEach((post, index) => {
    assert(
      post.legacyOrder === index,
      "legacyOrder mismatch for " + post.slug + ": " + String(post.legacyOrder)
    );
  });

  const baselineBySlug = new Map(
    baseline.articles.map((article: any) => [article.slug, article])
  );

  const metadataFailures: string[] = [];
  const schemaFailures: string[] = [];
  const sitemapFailures: string[] = [];

  for (const post of sanityPosts) {
    const frozen: any = baselineBySlug.get(post.slug);
    assert(frozen, "Baseline record missing for " + post.slug);

    assert(post.title === frozen.title, "Title mismatch for " + post.slug);
    assert(post.excerpt === frozen.excerpt, "Excerpt mismatch for " + post.slug);
    assert(post.category === frozen.category, "Category mismatch for " + post.slug);
    assert(post.author === frozen.author, "Author mismatch for " + post.slug);
    assert(post.date === frozen.publishedDate, "Date mismatch for " + post.slug);
    assert(post.readTime === frozen.readTime, "Read time mismatch for " + post.slug);
    assert(post.image.url === frozen.image, "Image mismatch for " + post.slug);
    assert(getPublicArticleUrl(post) === frozen.canonical, "Canonical mismatch for " + post.slug);

    const metadata: any = buildArticleMetadata(post);
    const expectedImage = frozen.image;

    if (
      metadata.title !== frozen.title ||
      metadata.description !== frozen.excerpt ||
      metadata.alternates?.canonical !== "/blog/" + post.slug + "/" ||
      metadata.openGraph?.title !== frozen.title ||
      metadata.openGraph?.description !== frozen.excerpt ||
      metadata.openGraph?.publishedTime !== frozen.publishedDate ||
      metadata.openGraph?.modifiedTime !== frozen.publishedDate ||
      metadata.openGraph?.images?.[0]?.url !== expectedImage ||
      metadata.openGraph?.images?.[0]?.width !== 800 ||
      metadata.openGraph?.images?.[0]?.height !== 400 ||
      metadata.openGraph?.images?.[0]?.alt !== frozen.title ||
      metadata.twitter?.title !== frozen.title ||
      metadata.twitter?.description !== frozen.excerpt ||
      metadata.twitter?.images?.[0] !== expectedImage
    ) {
      metadataFailures.push(post.slug);
    }

    const articleSchema: any = buildArticleSchema(post);
    const breadcrumb: any = buildBreadcrumbSchema(post);

    if (
      articleSchema.headline !== frozen.title ||
      articleSchema.description !== frozen.excerpt ||
      articleSchema.image?.url !== frozen.image ||
      articleSchema.datePublished !== frozen.publishedDate ||
      articleSchema.dateModified !== frozen.publishedDate ||
      articleSchema.mainEntityOfPage?.["@id"] !== frozen.canonical ||
      articleSchema.articleSection !== frozen.category ||
      breadcrumb.itemListElement?.[2]?.item !== frozen.canonical ||
      breadcrumb.itemListElement?.[2]?.name !== frozen.title
    ) {
      schemaFailures.push(post.slug);
    }

    if (
      getPublicArticleUrl(post) !== frozen.publicUrl ||
      post.date !== frozen.publishedDate
    ) {
      sitemapFailures.push(post.slug);
    }
  }

  assert(metadataFailures.length === 0, "Metadata parity failed: " + metadataFailures.join(", "));
  assert(schemaFailures.length === 0, "Schema parity failed: " + schemaFailures.join(", "));
  assert(sitemapFailures.length === 0, "Sitemap parity failed: " + sitemapFailures.join(", "));

  for (const slug of PROTECTED_SLUGS) {
    assert(sanitySlugs.includes(slug), "Protected slug missing: " + slug);
  }

  const warnings = migrationReport.warnings || [];
  const warningSlugs = warnings.map((warning: any) => warning.slug).sort();

  assert(warnings.length === 3, "Expected exactly three migration warnings");
  assert(
    WARNING_SLUGS.slice().sort().every((slug, index) => slug === warningSlugs[index]),
    "Known warning set changed"
  );
  assert(
    warnings.every((warning: any) => warning.code === "TABLE_CELL_MARKDOWN_PRESERVED"),
    "Unexpected warning type present"
  );

  const observedTypes = new Set<string>();
  const observedStyles = new Set<string>();
  const observedListItems = new Set<string>();
  const observedMarks = new Set<string>();

  for (const post of sanityPosts) {
    for (const block of post.body as any[]) {
      observedTypes.add(block?._type);
      if (block?._type === "block") {
        observedStyles.add(block?.style || "normal");
        if (block?.listItem) observedListItems.add(block.listItem);
        for (const child of block?.children || []) {
          for (const mark of child?.marks || []) {
            if (mark === "strong" || mark === "em") {
              observedMarks.add(mark);
            } else if ((block?.markDefs || []).some((def: any) => def?._key === mark && def?._type === "link")) {
              observedMarks.add("link");
            }
          }
        }
      }
    }
  }

  const coverage = PORTABLE_TEXT_RENDERER_COVERAGE;
  const missingTypes = Array.from(observedTypes).filter(
    (type) => type !== "block" && !coverage.customTypes.includes(type as any)
  );
  const missingStyles = Array.from(observedStyles).filter(
    (style) => !coverage.blockStyles.includes(style as any)
  );
  const missingListItems = Array.from(observedListItems).filter(
    (item) => !coverage.listItems.includes(item as any)
  );
  const missingMarks = Array.from(observedMarks).filter(
    (mark) => !coverage.marks.includes(mark as any)
  );

  assert(missingTypes.length === 0, "Renderer missing block types: " + missingTypes.join(", "));
  assert(missingStyles.length === 0, "Renderer missing styles: " + missingStyles.join(", "));
  assert(missingListItems.length === 0, "Renderer missing list items: " + missingListItems.join(", "));
  assert(missingMarks.length === 0, "Renderer missing marks: " + missingMarks.join(", "));

  assert(
    nextConfig.includes("what-to-do-if-insurance-claim-is-rejected-complete-guide") &&
      nextConfig.includes("destination: '/blog/claim-rejection-guide/'") &&
      nextConfig.includes("permanent: true"),
    "Protected redirect changed"
  );

  assert(
    stagingLayout.includes("index: false") &&
      stagingLayout.includes("follow: false"),
    "CMS staging route is not explicitly noindex"
  );

  const representative = REPRESENTATIVE_SLUGS.map((slug) => {
    const post = sanityPosts.find((candidate) => candidate.slug === slug);
    const articleReport = migrationReport.articles.find(
      (article: any) => article.slug === slug
    );

    assert(post, "Representative Sanity article missing: " + slug);
    assert(articleReport, "Representative migration report missing: " + slug);

    return {
      slug,
      title: post.title,
      date: post.date,
      category: post.category,
      legacyOrder: post.legacyOrder,
      bodyBlocks: post.body.length,
      tables: articleReport.tables,
      warnings: articleReport.warnings,
      stagingPath: "/cms-staging/blog/" + slug + "/",
      publicPath: "/blog/" + slug + "/",
    };
  });

  const report = {
    schemaVersion: 1,
    sourceMainCommit: "b98fa7cdb493686d6102dfdf54692bfd0562a7ec",
    summary: {
      legacyArticles: legacyPosts.length,
      sanityArticles: sanityPosts.length,
      archiveOrderParity: true,
      metadataParity: true,
      structuredDataParity: true,
      sitemapParity: true,
      redirectParity: true,
      rendererCoverage: true,
      protectedArticles: PROTECTED_SLUGS.length,
      knownWarnings: warnings.length,
      manualReviewRequired: warnings.length,
      automatedGate: "PASS",
    },
    observedPortableText: {
      types: Array.from(observedTypes).sort(),
      styles: Array.from(observedStyles).sort(),
      listItems: Array.from(observedListItems).sort(),
      marks: Array.from(observedMarks).sort(),
      missingTypes,
      missingStyles,
      missingListItems,
      missingMarks,
    },
    knownWarnings: warnings,
    representativeReview: representative,
  };

  await mkdir("migration/phase6", { recursive: true });
  await writeFile(
    "migration/phase6/staging-parity-report.json",
    JSON.stringify(report, null, 2) + "\n",
    "utf8"
  );

  console.log(JSON.stringify(report.summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
