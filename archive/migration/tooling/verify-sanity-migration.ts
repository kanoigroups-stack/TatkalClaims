import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createClient } from "@sanity/client";

type SanityDocument = {
  _id: string;
  _type: string;
  [key: string]: unknown;
};

const NDJSON = "migration/sanity/dry-run.ndjson";
const OUTPUT = "migration/sanity/verification.json";
const REQUIRED_ARTICLES = 57;
const REQUIRED_DOCUMENTS = 65;
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

function sha256(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

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

function digestDocument(document: unknown) {
  return sha256(JSON.stringify(canonicalize(document)));
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-27";
  const token = process.env.SANITY_WRITE_TOKEN;

  assert(projectId, "NEXT_PUBLIC_SANITY_PROJECT_ID is required");
  assert(projectId !== "tc000000", "Placeholder Sanity project ID is not allowed");
  assert(dataset === "migration", 'Verifier is hard-locked to dataset "migration"');
  assert(token, "SANITY_WRITE_TOKEN is required");

  const raw = await readFile(NDJSON, "utf8");
  const expectedDocuments = raw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as SanityDocument);

  const expectedArticles = expectedDocuments.filter(
    (document) => document._type === "article"
  );

  assert(
    expectedDocuments.length === REQUIRED_DOCUMENTS,
    "Dry-run document count changed"
  );
  assert(
    expectedArticles.length === REQUIRED_ARTICLES,
    "Dry-run article count changed"
  );
  assert(
    expectedDocuments.every((document) => !document._id.includes(".")),
    "Dry-run contains private Sanity sub-path IDs; public migration IDs must not contain periods"
  );

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  const actualDocuments = await client.getDocuments(
    expectedDocuments.map((document) => document._id)
  );

  const missingIds: string[] = [];
  const mismatches: Array<{
    id: string;
    type: string;
    expectedSha256: string;
    actualSha256: string | null;
  }> = [];

  for (let index = 0; index < expectedDocuments.length; index += 1) {
    const expected = expectedDocuments[index];
    const actual = actualDocuments[index];

    if (!actual) {
      missingIds.push(expected._id);
      mismatches.push({
        id: expected._id,
        type: expected._type,
        expectedSha256: digestDocument(expected),
        actualSha256: null,
      });
      continue;
    }

    const expectedDigest = digestDocument(expected);
    const actualDigest = digestDocument(actual);

    if (expectedDigest !== actualDigest) {
      mismatches.push({
        id: expected._id,
        type: expected._type,
        expectedSha256: expectedDigest,
        actualSha256: actualDigest,
      });
    }
  }

  const allowedTypes = ["article", "author", "category", "topic"];
  const actualIds = await client.fetch<string[]>(
    '*[_type in $types]._id',
    { types: allowedTypes }
  );

  const expectedIdSet = new Set(
    expectedDocuments.map((document) => document._id)
  );
  const actualIdSet = new Set(actualIds);
  const privatePathIds = actualIds.filter((id) => id.includes("."));

  const unexpectedIds = actualIds.filter((id) => !expectedIdSet.has(id));
  const absentIds = Array.from(expectedIdSet).filter(
    (id) => !actualIdSet.has(id)
  );

  const articleSlugs = await client.fetch<string[]>(
    '*[_type == "article"].slug.current'
  );

  const duplicateSlugs = articleSlugs.filter(
    (slug, index) => articleSlugs.indexOf(slug) !== index
  );

  const missingProtectedSlugs = PROTECTED_SLUGS.filter(
    (slug) => !articleSlugs.includes(slug)
  );

  const deprecatedSlugPresent = articleSlugs.includes(DEPRECATED_SLUG);

  const anonymousClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: "published",
  });
  const [anonymousDocuments, anonymousArticles] = await Promise.all([
    anonymousClient.fetch<number>(
      'count(*[_type in $types])',
      { types: allowedTypes }
    ),
    anonymousClient.fetch<number>('count(*[_type == "article"])'),
  ]);

  const report = {
    schemaVersion: 2,
    dataset,
    summary: {
      expectedDocuments: REQUIRED_DOCUMENTS,
      actualDocuments: actualIds.length,
      expectedArticles: REQUIRED_ARTICLES,
      actualArticles: articleSlugs.length,
      missingIds: missingIds.length,
      unexpectedIds: unexpectedIds.length,
      mismatches: mismatches.length,
      duplicateSlugs: new Set(duplicateSlugs).size,
      missingProtectedSlugs: missingProtectedSlugs.length,
      deprecatedSlugPresent,
      privatePathIds: privatePathIds.length,
      anonymousDocuments,
      anonymousArticles,
      exactMatch:
        actualIds.length === REQUIRED_DOCUMENTS &&
        articleSlugs.length === REQUIRED_ARTICLES &&
        missingIds.length === 0 &&
        unexpectedIds.length === 0 &&
        absentIds.length === 0 &&
        mismatches.length === 0 &&
        duplicateSlugs.length === 0 &&
        missingProtectedSlugs.length === 0 &&
        privatePathIds.length === 0 &&
        anonymousDocuments === REQUIRED_DOCUMENTS &&
        anonymousArticles === REQUIRED_ARTICLES &&
        !deprecatedSlugPresent,
    },
    missingIds,
    unexpectedIds,
    absentIds,
    mismatches,
    duplicateSlugs: Array.from(new Set(duplicateSlugs)).sort(),
    missingProtectedSlugs,
    deprecatedSlugPresent,
    privatePathIds,
  };

  await mkdir("migration/sanity", { recursive: true });
  await writeFile(OUTPUT, JSON.stringify(report, null, 2) + "\n", "utf8");

  assert(report.summary.exactMatch, "Sanity migration verification failed");

  console.log(JSON.stringify(report.summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
