import fs from "node:fs";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const routeFiles = [
  "app/page.tsx",
  "app/blog/page.tsx",
  "app/blog/[slug]/page.tsx",
  "app/author/[slug]/page.tsx",
  "app/blog/topic/[slug]/page.tsx",
  "app/sitemap.ts",
];

for (const path of routeFiles) {
  const source = fs.readFileSync(path, "utf8");
  assert(
    source.includes("export const revalidate = 43200;"),
    `${path} must use the 12-hour ISR fallback`
  );
  assert(
    !source.includes("export const revalidate = 60;"),
    `${path} must not retain the 60-second ISR fallback`
  );
}

const cache = fs.readFileSync("lib/content/cache.ts", "utf8");
assert(
  cache.includes("PUBLIC_REVALIDATE_SECONDS = 43_200"),
  "Sanity data cache must use the 12-hour fallback"
);
assert(
  cache.includes('SANITY_ARTICLE_SUMMARIES_TAG = "sanity:article-summaries"'),
  "Article summary cache tag is missing"
);

const sanity = fs.readFileSync("lib/content/sanity.ts", "utf8");
for (const required of [
  "SANITY_ARTICLE_SUMMARIES_TAG",
  "SANITY_ARTICLES_FULL_TAG",
  "SANITY_AUTHORS_TAG",
  "getSanityArticleTag(slug)",
  "getSanityAuthorTag(slug)",
  "getSanityRelatedPostsBySlug",
  "candidateLimit",
  "getSanityArticleSlugsReferencingDocument",
  'relatedArticle: "$documentId in relatedArticles[]._ref"',
]) {
  assert(sanity.includes(required), `Sanity cache wiring missing: ${required}`);
}

const contentIndex = fs.readFileSync("lib/content/index.ts", "utf8");
const relatedSection = contentIndex.slice(
  contentIndex.indexOf("export async function getRelatedPosts")
);
assert(
  relatedSection.includes("return getSanityRelatedPostsBySlug(slug, limit);"),
  "Article related-post lookup must use the source-specific Sanity adapter"
);
assert(
  !relatedSection.includes("const posts = await getAllPosts()"),
  "Article detail routes must not depend on the global article-summary cache"
);

const webhook = fs.readFileSync("app/api/revalidate/route.ts", "utf8");
for (const required of [
  "parseBody<WebhookPayload>",
  "SANITY_REVALIDATE_SECRET",
  "expectedProjectId",
  "productionDataset",
  "body?.projectId !== expectedProjectId",
  "body?.dataset !== productionDataset",
  "const before = body.before || null",
  "const after = body.after || null",
  "revalidatePath(path)",
  "revalidateTag(SANITY_ARTICLE_SUMMARIES_TAG)",
  "revalidateTag(getSanityArticleTag(slug))",
  'getAffectedArticleSlugs("relatedArticle")',
  'getAffectedArticleSlugs("author")',
  'getAffectedArticleSlugs("category")',
  'getAffectedArticleSlugs("topic")',
  "getKnowledgeTopicByTitle",
  'message: "Invalid webhook signature"',
]) {
  assert(webhook.includes(required), `Webhook safety check missing: ${required}`);
}
assert(
  !webhook.includes('revalidatePath(path, "page")') &&
    !webhook.includes('markPattern("/blog/[slug]")') &&
    !webhook.includes('markPattern("/blog/topic/[slug]")') &&
    !webhook.includes('markPattern("/author/[slug]")'),
  "Webhook must not return to broad pattern invalidation for routine content changes"
);
assert(
  webhook.includes("SLUG_PATTERN"),
  "Webhook must validate slugs before constructing revalidation paths"
);

const env = fs.readFileSync(".env.example", "utf8");
assert(
  env.includes("SANITY_REVALIDATE_SECRET="),
  "Environment example must document the webhook secret"
);
assert(
  !env.includes("NEXT_PUBLIC_SANITY_REVALIDATE_SECRET"),
  "Webhook secret must never be exposed as NEXT_PUBLIC_"
);

console.log("ISR/revalidation verification passed.");
