import { readFile } from "node:fs/promises";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const [sop, articleSchema, imageSchema, seoSchema, portableText, renderer, policy, contentIndex] =
    await Promise.all([
      readFile("docs/sanity-article-draft-sop.md", "utf8"),
      readFile("sanity/schemaTypes/documents/article.ts", "utf8"),
      readFile("sanity/schemaTypes/objects/articleImage.ts", "utf8"),
      readFile("sanity/schemaTypes/objects/seo.ts", "utf8"),
      readFile("sanity/schemaTypes/objects/portableText.ts", "utf8"),
      readFile("components/blog/PortableArticleBody.tsx", "utf8"),
      readFile("docs/sanity-mcp-automation.md", "utf8"),
      readFile("lib/content/index.ts", "utf8"),
    ]);

  for (const field of [
    "title",
    "slug",
    "excerpt",
    "contentType",
    "category",
    "author",
    "featuredImage",
    "publishedAt",
    "body",
    "monetization",
  ]) {
    assert(
      articleSchema.includes(`name: "${field}"`),
      `Article schema no longer contains required SOP field: ${field}`
    );
    assert(
      sop.includes(`\`${field}\``),
      `Article draft SOP does not document field: ${field}`
    );
  }

  assert(
    articleSchema.includes('name: "legacyOrder"') &&
      sop.includes("Never set or modify `legacyOrder` for a new article") &&
      sop.includes("Never set it on a new article"),
    "SOP must preserve the migration-only legacyOrder invariant"
  );

  for (const slug of [
    "claim-rejection-guide",
    "irdai-30-day-claim-settlement-rule-health-insurance-rights",
    "mis-selling-guide",
  ]) {
    assert(
      sop.includes(slug),
      `SOP is missing protected slug: ${slug}`
    );
  }

  assert(
    sop.includes("Never publish without explicit user approval") &&
      sop.includes("No explicit approval = no publish"),
    "SOP must keep publishing explicitly approval-gated"
  );

  assert(
    sop.includes("draft") &&
      sop.includes("published content must remain unchanged") &&
      sop.includes("/cms-preview/blog/[slug]/") &&
      sop.includes("/blog/[slug]/"),
    "SOP must require draft/public isolation verification"
  );

  assert(
    imageSchema.includes('name: "alt"') &&
      imageSchema.includes("Rule.required()") &&
      sop.includes("Alt text is required") &&
      sop.includes("Prefer an uploaded Sanity image"),
    "SOP must preserve image-source and alt-text requirements"
  );

  assert(
    seoSchema.includes('name: "metaTitle"') &&
      seoSchema.includes("Rule.max(60)") &&
      seoSchema.includes('name: "metaDescription"') &&
      seoSchema.includes("Rule.max(160)") &&
      sop.includes("Studio warns above 60 characters") &&
      sop.includes("Studio warns above 160 characters"),
    "SOP SEO length guidance must match the schema"
  );

  assert(
    portableText.includes('{ type: "articleTable" }') &&
      portableText.includes('{ type: "articleChart" }') &&
      sop.includes("articleTable") &&
      sop.includes("articleChart"),
    "SOP must document supported table/chart Portable Text types"
  );

  assert(
    renderer.includes("articleChart:") &&
      renderer.includes("ChartVisual") &&
      renderer.includes("View chart data") &&
      sop.includes("graphical bar/line/pie visualization with an accessible expandable data-table fallback"),
    "SOP must match the current graphical chart renderer and data fallback"
  );

  assert(
    contentIndex.includes("getRelatedPosts") &&
      contentIndex.includes("target.relatedSlugs") &&
      sop.includes("public Related articles section") &&
      sop.includes("topic/category/content-type relevance and recency"),
    "SOP must match the current related-article override and fallback behavior"
  );

  assert(
    sop.includes("/blog/example-slug/") &&
      sop.includes("verify the destination article exists"),
    "SOP must require canonical internal-link verification"
  );

  assert(
    sop.includes("Do not insert an H1 inside the body") &&
      sop.includes("Use H2 for major sections and H3 for subsections"),
    "SOP must preserve article heading hierarchy"
  );

  assert(
    policy.includes("docs/sanity-article-draft-sop.md") &&
      policy.includes("All MCP-created or MCP-edited articles must follow"),
    "MCP automation policy must require the article draft SOP"
  );

  console.log(
    "Sanity Article Draft SOP matches current schema, renderer, migration, SEO, media, preview, and publish safeguards."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
