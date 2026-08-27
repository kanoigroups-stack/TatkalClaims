import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createClient } from "@sanity/client";
import { getAllPosts } from "../lib/content";
import { apiVersion, dataset, projectId } from "../sanity/env";

const EXPECTED_ARTICLES = 57;
const EXPECTED_DOCUMENTS = 65;
const DEPRECATED_SLUG =
  "what-to-do-if-insurance-claim-is-rejected-complete-guide";
const PROTECTED_SLUGS = [
  "claim-rejection-guide",
  "irdai-30-day-claim-settlement-rule-health-insurance-rights",
  "mis-selling-guide",
];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
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
  const baseline = JSON.parse(
    await readFile("migration/baseline/manifest.json", "utf8")
  );
  const expectedDocuments = (
    await readFile("migration/sanity/dry-run.ndjson", "utf8")
  )
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  const expectedArticles = expectedDocuments.filter(
    (document) => document._type === "article"
  );

  assert(
    expectedDocuments.length === EXPECTED_DOCUMENTS,
    "Frozen migration payload no longer contains 65 documents"
  );
  assert(
    expectedArticles.length === EXPECTED_ARTICLES,
    "Frozen migration payload no longer contains 57 articles"
  );
  assert(
    expectedDocuments.every((document) => !document._id.includes(".")),
    "Frozen migration payload contains private Sanity sub-path IDs"
  );

  const expectedBySlug = new Map(
    expectedArticles.map((document) => [document.slug.current, document])
  );
  const baselineBySlug = new Map(
    baseline.articles.map((article: any) => [article.slug, article])
  );

  const anonymousClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: "published",
  });

  const [anonymousDocuments, anonymousArticles, posts] = await Promise.all([
    anonymousClient.fetch<number>(
      'count(*[_type in ["article", "author", "category", "topic"]])'
    ),
    anonymousClient.fetch<number>('count(*[_type == "article"])'),
    getAllPosts("sanity"),
  ]);

  assert(
    anonymousDocuments === EXPECTED_DOCUMENTS,
    "Anonymous Sanity document count mismatch: " + anonymousDocuments
  );
  assert(
    anonymousArticles === EXPECTED_ARTICLES,
    "Anonymous Sanity article count mismatch: " + anonymousArticles
  );
  assert(
    posts.length === EXPECTED_ARTICLES,
    "Sanity adapter returned wrong article count: " + posts.length
  );
  assert(
    new Set(posts.map((post) => post.slug)).size === EXPECTED_ARTICLES,
    "Sanity adapter returned duplicate slugs"
  );
  assert(
    !posts.some((post) => post.slug === DEPRECATED_SLUG),
    "Deprecated slug leaked through Sanity adapter"
  );

  for (const slug of PROTECTED_SLUGS) {
    assert(
      posts.some((post) => post.slug === slug),
      "Protected slug missing from Sanity adapter: " + slug
    );
  }

  for (const post of posts) {
    const baselineArticle: any = baselineBySlug.get(post.slug);
    const expected: any = expectedBySlug.get(post.slug);

    assert(baselineArticle, "Baseline record missing for " + post.slug);
    assert(expected, "Dry-run record missing for " + post.slug);
    assert(post.title === baselineArticle.title, "Title mismatch for " + post.slug);
    assert(post.excerpt === baselineArticle.excerpt, "Excerpt mismatch for " + post.slug);
    assert(post.category === baselineArticle.category, "Category mismatch for " + post.slug);
    assert(post.author === baselineArticle.author, "Author mismatch for " + post.slug);
    assert(post.date === baselineArticle.publishedDate, "Publication date mismatch for " + post.slug);
    assert(post.readTime === baselineArticle.readTime, "Read time mismatch for " + post.slug);
    assert(post.image.url === baselineArticle.image, "Featured image mismatch for " + post.slug);
    assert(
      digest(post.body) === digest(expected.body),
      "Portable Text body mismatch for " + post.slug
    );
  }

  console.log(
    JSON.stringify(
      {
        projectId,
        dataset,
        source: "sanity-anonymous",
        anonymousDocuments,
        anonymousArticles,
        adapterArticles: posts.length,
        duplicateSlugs: 0,
        missingProtectedSlugs: 0,
        deprecatedSlugPresent: false,
        metadataParity: true,
        portableTextParity: true,
        exactMatch: true,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
