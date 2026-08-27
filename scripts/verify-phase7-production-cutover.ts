import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createClient } from "@sanity/client";
import { getAllPosts } from "../lib/content";
import { getLiveContentSource } from "../lib/content/live";
import {
  buildArticleMetadata,
  buildArticleSchema,
  buildBreadcrumbSchema,
  getPublicArticleUrl,
} from "../lib/content/seo";
import { apiVersion, productionDataset, projectId } from "../sanity/env";

type SanityDocument = {
  _id: string;
  _type: string;
  [key: string]: unknown;
};

const EXPECTED_ARTICLES = 57;
const EXPECTED_DOCUMENTS = 65;
const DEPRECATED_SLUG =
  "what-to-do-if-insurance-claim-is-rejected-complete-guide";
const PROTECTED_SLUGS = [
  "claim-rejection-guide",
  "irdai-30-day-claim-settlement-rule-health-insurance-rights",
  "mis-selling-guide",
];
const ALLOWED_TYPES = ["article", "author", "category", "topic"];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => !["_rev", "_createdAt", "_updatedAt"].includes(key))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, canonicalize(child)])
    );
  }

  return value;
}

function digest(value: unknown) {
  return createHash("sha256")
    .update(JSON.stringify(canonicalize(value)), "utf8")
    .digest("hex");
}

async function main() {
  assert(productionDataset === "production", "Live Sanity dataset must be production");

  const expectedDocuments = (
    await readFile("migration/sanity/dry-run.ndjson", "utf8")
  )
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as SanityDocument);

  const expectedArticles = expectedDocuments.filter(
    (document) => document._type === "article"
  );

  assert(expectedDocuments.length === EXPECTED_DOCUMENTS, "Frozen payload count changed");
  assert(expectedArticles.length === EXPECTED_ARTICLES, "Frozen article count changed");
  assert(
    expectedDocuments.every((document) => !document._id.includes(".")),
    "Frozen payload contains private-path IDs"
  );

  const client = createClient({
    projectId,
    dataset: productionDataset,
    apiVersion,
    useCdn: false,
    perspective: "published",
  });

  const expectedIds = expectedDocuments.map((document) => document._id);
  const actualDocuments = await client.getDocuments(expectedIds);

  const documentMismatches: string[] = [];
  const missingDocuments: string[] = [];

  for (let index = 0; index < expectedDocuments.length; index += 1) {
    const actual = actualDocuments[index];

    if (!actual) {
      missingDocuments.push(expectedDocuments[index]._id);
      continue;
    }

    if (digest(actual) !== digest(expectedDocuments[index])) {
      documentMismatches.push(expectedDocuments[index]._id);
    }
  }

  const [managedIds, anonymousArticles, legacyPosts, sanityPosts] =
    await Promise.all([
      client.fetch<string[]>('*[_type in $types]._id', { types: ALLOWED_TYPES }),
      client.fetch<number>('count(*[_type == "article"])'),
      getAllPosts("legacy"),
      getAllPosts("sanity"),
    ]);

  assert(managedIds.length === EXPECTED_DOCUMENTS, "Production managed document count changed");
  assert(anonymousArticles === EXPECTED_ARTICLES, "Production article count changed");
  assert(missingDocuments.length === 0, "Production is missing frozen documents");
  assert(documentMismatches.length === 0, "Production document payload differs from frozen migration");
  assert(legacyPosts.length === EXPECTED_ARTICLES, "Legacy rollback count changed");
  assert(sanityPosts.length === EXPECTED_ARTICLES, "Sanity live count changed");

  const legacyOrder = legacyPosts.map((post) => post.slug);
  const sanityOrder = sanityPosts.map((post) => post.slug);

  assert(
    legacyOrder.every((slug, index) => slug === sanityOrder[index]),
    "Live Sanity archive order differs from legacy"
  );

  const legacyBySlug = new Map(legacyPosts.map((post) => [post.slug, post]));
  const sanityBySlug = new Map(sanityPosts.map((post) => [post.slug, post]));

  const metadataMismatches: string[] = [];
  const schemaMismatches: string[] = [];

  for (const legacy of legacyPosts) {
    const sanity = sanityBySlug.get(legacy.slug);
    assert(sanity, "Sanity post missing: " + legacy.slug);

    if (
      legacy.title !== sanity.title ||
      legacy.excerpt !== sanity.excerpt ||
      legacy.category !== sanity.category ||
      legacy.author !== sanity.author ||
      legacy.date !== sanity.date ||
      legacy.readTime !== sanity.readTime ||
      legacy.image.url !== sanity.image.url
    ) {
      metadataMismatches.push(legacy.slug);
    }

    const metadata: any = buildArticleMetadata(sanity);
    const articleSchema: any = buildArticleSchema(sanity);
    const breadcrumbSchema: any = buildBreadcrumbSchema(sanity);

    if (
      metadata.title !== legacy.title ||
      metadata.description !== legacy.excerpt ||
      metadata.alternates?.canonical !== "/blog/" + legacy.slug + "/" ||
      metadata.openGraph?.publishedTime !== legacy.date ||
      metadata.openGraph?.images?.[0]?.url !== legacy.image.url ||
      metadata.twitter?.images?.[0] !== legacy.image.url
    ) {
      metadataMismatches.push(legacy.slug + ":seo");
    }

    const publicUrl = getPublicArticleUrl(sanity);

    if (
      articleSchema.headline !== legacy.title ||
      articleSchema.description !== legacy.excerpt ||
      articleSchema.image?.url !== legacy.image.url ||
      articleSchema.datePublished !== legacy.date ||
      articleSchema.mainEntityOfPage?.["@id"] !== publicUrl ||
      breadcrumbSchema.itemListElement?.[2]?.item !== publicUrl
    ) {
      schemaMismatches.push(legacy.slug);
    }
  }

  assert(metadataMismatches.length === 0, "Metadata/SEO parity failed");
  assert(schemaMismatches.length === 0, "Structured-data parity failed");

  const sanitySlugs = new Set(sanityOrder);
  assert(
    PROTECTED_SLUGS.every((slug) => sanitySlugs.has(slug)),
    "Protected article missing from live Sanity"
  );
  assert(!sanitySlugs.has(DEPRECATED_SLUG), "Deprecated article leaked into live Sanity");

  const publicFiles = {
    archive: await readFile("app/blog/page.tsx", "utf8"),
    article: await readFile("app/blog/[slug]/page.tsx", "utf8"),
    sitemap: await readFile("app/sitemap.ts", "utf8"),
    home: await readFile("app/page.tsx", "utf8"),
    knowledge: await readFile("components/sections/KnowledgeSection.tsx", "utf8"),
    nextConfig: await readFile("next.config.js", "utf8"),
    sanityClient: await readFile("lib/content/sanity.ts", "utf8"),
    sanityConfig: await readFile("sanity.config.ts", "utf8"),
  };

  for (const [name, content] of Object.entries(publicFiles)) {
    if (["archive", "article", "sitemap", "home", "knowledge"].includes(name)) {
      assert(!content.includes("@/lib/blogs"), name + " still imports @/lib/blogs");
      assert(!content.includes("@/data/blogs.json"), name + " still imports raw blogs.json");
    }
  }

  assert(publicFiles.archive.includes("getLiveContentSource"), "Archive does not use live source selector");
  assert(publicFiles.article.includes("getLiveContentSource"), "Article page does not use live source selector");
  assert(publicFiles.article.includes("PortableArticleBody"), "Article page does not render Portable Text");
  assert(publicFiles.article.includes("LegacyArticleBody"), "Article page lost rollback renderer");
  assert(publicFiles.sitemap.includes("getLiveContentSource"), "Sitemap does not use live source selector");
  assert(publicFiles.home.includes("getLiveContentSource"), "Homepage does not use live source selector");
  assert(!publicFiles.knowledge.includes("blogs.json"), "Homepage Knowledge section still bypasses adapter");
  assert(publicFiles.sanityClient.includes("dataset: productionDataset"), "Public Sanity client is not locked to production");
  assert(publicFiles.sanityClient.includes("useCdn: true"), "Public Sanity client should use CDN");
  assert(publicFiles.sanityClient.includes("revalidate: PUBLIC_REVALIDATE_SECONDS"), "Public Sanity fetch lacks revalidation");
  assert(publicFiles.sanityConfig.includes("dataset: productionDataset"), "Studio is not locked to production");
  assert(publicFiles.nextConfig.includes("hostname: 'cdn.sanity.io'"), "Sanity image CDN is not allowlisted");
  assert(
    publicFiles.nextConfig.includes("what-to-do-if-insurance-claim-is-rejected-complete-guide") &&
      publicFiles.nextConfig.includes("destination: '/blog/claim-rejection-guide/'") &&
      publicFiles.nextConfig.includes("permanent: true"),
    "Protected permanent redirect changed"
  );

  const originalSource = process.env.BLOG_CONTENT_SOURCE;
  delete process.env.BLOG_CONTENT_SOURCE;
  assert(getLiveContentSource() === "sanity", "Default live source is not Sanity");
  process.env.BLOG_CONTENT_SOURCE = "legacy";
  assert(getLiveContentSource() === "legacy", "Legacy rollback switch does not work");
  if (originalSource === undefined) {
    delete process.env.BLOG_CONTENT_SOURCE;
  } else {
    process.env.BLOG_CONTENT_SOURCE = originalSource;
  }

  const report = {
    schemaVersion: 1,
    projectId,
    dataset: productionDataset,
    summary: {
      productionDocuments: managedIds.length,
      productionArticles: sanityPosts.length,
      legacyRollbackArticles: legacyPosts.length,
      missingDocuments: missingDocuments.length,
      documentMismatches: documentMismatches.length,
      archiveOrderParity: true,
      metadataSeoParity: true,
      structuredDataParity: true,
      protectedArticles: PROTECTED_SLUGS.length,
      deprecatedSlugPresent: false,
      publicLegacyImports: 0,
      sanityImageCdnConfigured: true,
      defaultSource: "sanity",
      rollbackSource: "legacy",
      exactMatch: true,
    },
  };

  await mkdir("migration/phase7", { recursive: true });
  await writeFile(
    "migration/phase7/production-cutover-verification.json",
    JSON.stringify(report, null, 2) + "\n",
    "utf8"
  );

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
