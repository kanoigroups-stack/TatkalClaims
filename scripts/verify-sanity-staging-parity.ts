import { readFile, mkdir, writeFile } from "node:fs/promises";
import { getAllPosts } from "../lib/content";
import { getLegacyPosts } from "../lib/content/legacy";
import type { ContentPost } from "../lib/content/types";

const EXPECTED_ARTICLES = 57;
const DEPRECATED_SLUG =
  "what-to-do-if-insurance-claim-is-rejected-complete-guide";
const PROTECTED_SLUGS = [
  "claim-rejection-guide",
  "irdai-30-day-claim-settlement-rule-health-insurance-rights",
  "mis-selling-guide",
];
const EXPECTED_WARNING_SLUGS = [
  "e20-ethanol-petrol-insurance-claim-rejection-india",
  "manipal-cigna-denied-brain-tumour-surgery-claim-shifting-grounds-delhi-consumer-commission-rs-2-33-lakh",
  "car-stolen-parked-under-tree-branches-insurer-denied-claim-consumer-commission-rs-2-26-lakh",
].sort();

const SUPPORTED_BODY_TYPES = new Set([
  "block",
  "articleImage",
  "articleTable",
  "articleChart",
  "keyTakeaway",
  "importantRule",
  "expertNote",
  "warningBlock",
  "faqBlock",
  "sourceCitation",
  "articleCta",
]);
const SUPPORTED_STYLES = new Set(["normal", "h2", "h3", "blockquote", "hr"]);
const SUPPORTED_LISTS = new Set(["bullet", "number"]);
const SUPPORTED_DECORATORS = new Set(["strong", "em"]);
const SUPPORTED_ANNOTATIONS = new Set(["link"]);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown) {
  return JSON.stringify(value, Object.keys(value as object).sort());
}

function seoContract(post: ContentPost) {
  return {
    title: post.title,
    description: post.excerpt,
    canonical: "/blog/" + post.slug + "/",
    openGraph: {
      title: post.title,
      description: post.excerpt,
      image: post.image.url,
      imageWidth: 800,
      imageHeight: 400,
      imageAlt: post.title,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author],
      tags: [post.category, "insurance", "claim dispute", "india"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      image: post.image.url,
    },
  };
}

function schemaContract(post: ContentPost) {
  const publicUrl = "https://tatkalclaims.com/blog/" + post.slug + "/";
  return {
    breadcrumb: {
      home: "https://tatkalclaims.com/",
      knowledgeCenter: "https://tatkalclaims.com/blog/",
      title: post.title,
      article: publicUrl,
    },
    article: {
      type: "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: post.image.url,
      imageWidth: 800,
      imageHeight: 400,
      authorType: "Organization",
      authorName: post.author,
      publisherName: "Tatkal Claims",
      publisherLogo: "https://tatkalclaims.com/logo.png",
      datePublished: post.date,
      dateModified: post.date,
      mainEntityOfPage: publicUrl,
      keywords: [post.category, "insurance claim", "dispute resolution", "india"],
      articleSection: post.category,
    },
  };
}

function sitemapContract(post: ContentPost) {
  return {
    url: "https://tatkalclaims.com/blog/" + post.slug + "/",
    lastModifiedDate: post.date,
    changeFrequency: "monthly",
    priority: 0.6,
  };
}

type RendererCoverage = {
  bodyTypes: Set<string>;
  styles: Set<string>;
  lists: Set<string>;
  decorators: Set<string>;
  annotations: Set<string>;
};

function inspectPortableBlocks(blocks: unknown[], coverage: RendererCoverage) {
  for (const raw of blocks) {
    if (!raw || typeof raw !== "object") continue;
    const block = raw as Record<string, any>;
    const type = String(block._type || "");
    if (type) coverage.bodyTypes.add(type);

    if (type === "block") {
      coverage.styles.add(String(block.style || "normal"));
      if (block.listItem) coverage.lists.add(String(block.listItem));

      const markDefs = Array.isArray(block.markDefs) ? block.markDefs : [];
      const annotationKeys = new Set<string>();
      for (const def of markDefs) {
        if (def?._key) annotationKeys.add(String(def._key));
        if (def?._type) coverage.annotations.add(String(def._type));
      }

      for (const child of Array.isArray(block.children) ? block.children : []) {
        for (const mark of Array.isArray(child?.marks) ? child.marks : []) {
          const value = String(mark);
          if (!annotationKeys.has(value)) coverage.decorators.add(value);
        }
      }
    }

    if (type === "faqBlock") {
      for (const item of Array.isArray(block.items) ? block.items : []) {
        if (Array.isArray(item?.answer)) {
          inspectPortableBlocks(item.answer, coverage);
        }
      }
    }
  }
}

async function main() {
  const [legacyPosts, sanityPosts, reportText, nextConfigText] = await Promise.all([
    Promise.resolve(getLegacyPosts()),
    getAllPosts("sanity"),
    readFile("migration/sanity/report.json", "utf8"),
    readFile("next.config.js", "utf8"),
  ]);

  assert(legacyPosts.length === EXPECTED_ARTICLES, "Legacy article count changed");
  assert(sanityPosts.length === EXPECTED_ARTICLES, "Sanity article count changed");

  const legacyBySlug = new Map(legacyPosts.map((post) => [post.slug, post]));
  const sanityBySlug = new Map(sanityPosts.map((post) => [post.slug, post]));

  const missingSlugs = legacyPosts
    .map((post) => post.slug)
    .filter((slug) => !sanityBySlug.has(slug));
  const unexpectedSlugs = sanityPosts
    .map((post) => post.slug)
    .filter((slug) => !legacyBySlug.has(slug));

  const metadataMismatches: string[] = [];
  const seoMismatches: string[] = [];
  const schemaMismatches: string[] = [];
  const sitemapMismatches: string[] = [];

  for (const legacy of legacyPosts) {
    const sanity = sanityBySlug.get(legacy.slug);
    if (!sanity) continue;

    const metadataFields: Array<keyof ContentPost> = [
      "slug",
      "title",
      "excerpt",
      "category",
      "author",
      "date",
      "readTime",
    ];

    for (const field of metadataFields) {
      if (legacy[field] !== sanity[field]) {
        metadataMismatches.push(legacy.slug + ":" + String(field));
      }
    }

    if (legacy.image.url !== sanity.image.url) {
      metadataMismatches.push(legacy.slug + ":image");
    }

    if (JSON.stringify(seoContract(legacy)) !== JSON.stringify(seoContract(sanity))) {
      seoMismatches.push(legacy.slug);
    }

    if (JSON.stringify(schemaContract(legacy)) !== JSON.stringify(schemaContract(sanity))) {
      schemaMismatches.push(legacy.slug);
    }

    if (JSON.stringify(sitemapContract(legacy)) !== JSON.stringify(sitemapContract(sanity))) {
      sitemapMismatches.push(legacy.slug);
    }
  }

  const legacyOrder = legacyPosts.map((post) => post.slug);
  const sanityOrder = sanityPosts.map((post) => post.slug);
  const archiveOrderParity =
    legacyOrder.length === sanityOrder.length &&
    legacyOrder.every((slug, index) => slug === sanityOrder[index]);

  const firstArchiveOrderMismatch = archiveOrderParity
    ? null
    : {
        index: legacyOrder.findIndex((slug, index) => slug !== sanityOrder[index]),
        legacy: legacyOrder.find((slug, index) => slug !== sanityOrder[index]) || null,
        sanity: sanityOrder.find((slug, index) => slug !== legacyOrder[index]) || null,
      };

  const moreArticlesMismatches: Array<{
    slug: string;
    legacy: string[];
    sanity: string[];
  }> = [];

  for (const slug of legacyOrder) {
    const legacyRelated = legacyPosts
      .filter((post) => post.slug !== slug)
      .slice(0, 2)
      .map((post) => post.slug);
    const sanityRelated = sanityPosts
      .filter((post) => post.slug !== slug)
      .slice(0, 2)
      .map((post) => post.slug);

    if (JSON.stringify(legacyRelated) !== JSON.stringify(sanityRelated)) {
      moreArticlesMismatches.push({ slug, legacy: legacyRelated, sanity: sanityRelated });
    }
  }

  const coverage: RendererCoverage = {
    bodyTypes: new Set(),
    styles: new Set(),
    lists: new Set(),
    decorators: new Set(),
    annotations: new Set(),
  };

  for (const post of sanityPosts) {
    inspectPortableBlocks(post.body, coverage);
  }

  const unsupportedBodyTypes = Array.from(coverage.bodyTypes)
    .filter((value) => !SUPPORTED_BODY_TYPES.has(value))
    .sort();
  const unsupportedStyles = Array.from(coverage.styles)
    .filter((value) => !SUPPORTED_STYLES.has(value))
    .sort();
  const unsupportedLists = Array.from(coverage.lists)
    .filter((value) => !SUPPORTED_LISTS.has(value))
    .sort();
  const unsupportedDecorators = Array.from(coverage.decorators)
    .filter((value) => !SUPPORTED_DECORATORS.has(value))
    .sort();
  const unsupportedAnnotations = Array.from(coverage.annotations)
    .filter((value) => !SUPPORTED_ANNOTATIONS.has(value))
    .sort();

  const migrationReport = JSON.parse(reportText);
  const warnings = Array.isArray(migrationReport.warnings)
    ? migrationReport.warnings
    : [];
  const warningSlugs = warnings
    .map((warning: any) => String(warning.slug))
    .sort();

  const parserWarningsMatchFrozenSet =
    warnings.length === 3 &&
    JSON.stringify(warningSlugs) === JSON.stringify(EXPECTED_WARNING_SLUGS) &&
    warnings.every((warning: any) => warning.code === "TABLE_CELL_MARKDOWN_PRESERVED");

  const protectedSlugsPresent = PROTECTED_SLUGS.every(
    (slug) => legacyBySlug.has(slug) && sanityBySlug.has(slug)
  );
  const deprecatedSlugPresent =
    legacyBySlug.has(DEPRECATED_SLUG) || sanityBySlug.has(DEPRECATED_SLUG);

  const redirectPreserved =
    nextConfigText.includes("source: '/blog/what-to-do-if-insurance-claim-is-rejected-complete-guide/'") &&
    nextConfigText.includes("destination: '/blog/claim-rejection-guide/'") &&
    nextConfigText.includes("permanent: true");

  const rendererCoverageExact =
    unsupportedBodyTypes.length === 0 &&
    unsupportedStyles.length === 0 &&
    unsupportedLists.length === 0 &&
    unsupportedDecorators.length === 0 &&
    unsupportedAnnotations.length === 0;

  const seoDataExact =
    missingSlugs.length === 0 &&
    unexpectedSlugs.length === 0 &&
    metadataMismatches.length === 0 &&
    seoMismatches.length === 0 &&
    schemaMismatches.length === 0 &&
    sitemapMismatches.length === 0 &&
    protectedSlugsPresent &&
    !deprecatedSlugPresent &&
    redirectPreserved;

  const cutoverBlockers: string[] = [];
  if (!seoDataExact) cutoverBlockers.push("SEO_OR_DATA_PARITY");
  if (!rendererCoverageExact) cutoverBlockers.push("UNSUPPORTED_PORTABLE_TEXT");
  if (!archiveOrderParity) cutoverBlockers.push("ARCHIVE_ORDER_DRIFT");
  if (moreArticlesMismatches.length > 0) cutoverBlockers.push("MORE_ARTICLES_ORDER_DRIFT");
  if (warnings.length > 0) cutoverBlockers.push("MANUAL_TABLE_REVIEW_REQUIRED");

  const result = {
    schemaVersion: 1,
    source: {
      legacyArticles: legacyPosts.length,
      sanityArticles: sanityPosts.length,
    },
    parity: {
      missingSlugs,
      unexpectedSlugs,
      metadataMismatches,
      seoMismatches,
      schemaMismatches,
      sitemapMismatches,
      protectedSlugsPresent,
      deprecatedSlugPresent,
      redirectPreserved,
      seoDataExact,
    },
    ordering: {
      archiveOrderParity,
      firstArchiveOrderMismatch,
      moreArticlesMismatchCount: moreArticlesMismatches.length,
      moreArticlesMismatchSample: moreArticlesMismatches.slice(0, 5),
      legacyFirstFive: legacyOrder.slice(0, 5),
      sanityFirstFive: sanityOrder.slice(0, 5),
    },
    renderer: {
      actualBodyTypes: Array.from(coverage.bodyTypes).sort(),
      actualStyles: Array.from(coverage.styles).sort(),
      actualLists: Array.from(coverage.lists).sort(),
      actualDecorators: Array.from(coverage.decorators).sort(),
      actualAnnotations: Array.from(coverage.annotations).sort(),
      unsupportedBodyTypes,
      unsupportedStyles,
      unsupportedLists,
      unsupportedDecorators,
      unsupportedAnnotations,
      rendererCoverageExact,
    },
    parserReview: {
      warningCount: warnings.length,
      parserWarningsMatchFrozenSet,
      warnings,
    },
    cutover: {
      ready: cutoverBlockers.length === 0,
      blockers: cutoverBlockers,
    },
  };

  await mkdir("migration/sanity", { recursive: true });
  await writeFile(
    "migration/sanity/staging-parity-report.json",
    JSON.stringify(result, null, 2) + "\n",
    "utf8"
  );

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
