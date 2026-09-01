import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createClient } from "@sanity/client";

type SanityDocument = {
  _id: string;
  _type: string;
  [key: string]: unknown;
};

const PROJECT_ID = "ah5vm288";
const TARGET_DATASET = "production";
const NDJSON = "migration/sanity/dry-run.ndjson";
const OUTPUT = "migration/phase7/production-promotion-report.json";
const REQUIRED_DOCUMENTS = 65;
const REQUIRED_ARTICLES = 57;
const ALLOWED_TYPES = ["article", "author", "category", "topic"];
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
  assert(
    process.argv.includes("--confirm-production-promotion"),
    "Refusing production promotion without --confirm-production-promotion"
  );

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-27";
  const token = process.env.SANITY_WRITE_TOKEN;

  assert(projectId === PROJECT_ID, "Promotion is locked to Sanity project " + PROJECT_ID);
  assert(dataset === TARGET_DATASET, 'Promotion is locked to dataset "production"');
  assert(token, "SANITY_WRITE_TOKEN is required");

  const documents = (await readFile(NDJSON, "utf8"))
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as SanityDocument);

  const articles = documents.filter((document) => document._type === "article");
  const expectedIds = documents.map((document) => document._id);
  const expectedIdSet = new Set(expectedIds);

  assert(documents.length === REQUIRED_DOCUMENTS, "Frozen payload must contain exactly 65 documents");
  assert(articles.length === REQUIRED_ARTICLES, "Frozen payload must contain exactly 57 articles");
  assert(new Set(expectedIds).size === REQUIRED_DOCUMENTS, "Frozen payload contains duplicate IDs");
  assert(expectedIds.every((id) => !id.includes(".")), "Frozen payload contains private Sanity sub-path IDs");
  assert(
    articles.every((article: any) => article.slug?.current !== DEPRECATED_SLUG),
    "Deprecated article cannot be promoted"
  );

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: "published",
  });

  const [beforeAllCount, beforeManagedIds, beforeDocs] = await Promise.all([
    client.fetch<number>("count(*)"),
    client.fetch<string[]>('*[_type in $types]._id', { types: ALLOWED_TYPES }),
    client.fetch<Array<{_id:string;_type:string;title?:string;name?:string;slug?:string}>>(
      '*[]{_id,_type,title,name,"slug":slug.current}'
    ),
  ]);

  const typeCounts = beforeDocs.reduce<Record<string, number>>((acc, doc) => {
    acc[doc._type] = (acc[doc._type] || 0) + 1;
    return acc;
  }, {});

  console.log(
    JSON.stringify(
      {
        preflightOnly: true,
        beforeAllCount,
        beforeManagedDocuments: beforeManagedIds.length,
        typeCounts,
        documents: beforeDocs.map((doc) => ({
          _id: doc._id,
          _type: doc._type,
          title: doc.title,
          name: doc.name,
          slug: doc.slug,
        })),
      },
      null,
      2
    )
  );

  const beforeUserDocs = beforeDocs.filter(
    (doc) => !doc._id.startsWith("_.") && !doc._type.startsWith("system.")
  );
  const beforeSystemDocs = beforeDocs.filter(
    (doc) => doc._id.startsWith("_.") || doc._type.startsWith("system.")
  );

  const beforeManagedSet = new Set(beforeManagedIds);
  const beforeExpectedDocuments =
    beforeManagedIds.length === REQUIRED_DOCUMENTS &&
    expectedIds.every((id) => beforeManagedSet.has(id)) &&
    beforeManagedIds.every((id) => expectedIdSet.has(id));

  console.log(
    JSON.stringify(
      {
        productionUserDocuments: beforeUserDocs.length,
        productionSystemDocuments: beforeSystemDocs.length,
      },
      null,
      2
    )
  );

  let existingExactMatch = false;

  if (beforeUserDocs.length !== 0) {
    assert(
      beforeUserDocs.length === REQUIRED_DOCUMENTS && beforeExpectedDocuments,
      "Production dataset contains user documents that are not the exact managed 65-document payload. Refusing overwrite."
    );

    const actual = await client.getDocuments(expectedIds);
    existingExactMatch = actual.every(
      (document, index) =>
        Boolean(document) && digest(document) === digest(documents[index])
    );

    assert(
      existingExactMatch,
      "Production dataset contains the expected IDs but document content differs. Refusing overwrite."
    );
  }

  if (!existingExactMatch) {
    const ordered = [
      ...documents.filter((document) => document._type !== "article"),
      ...documents.filter((document) => document._type === "article"),
    ];

    const batchSize = 25;
    for (let index = 0; index < ordered.length; index += batchSize) {
      const batch = ordered.slice(index, index + batchSize);
      let transaction = client.transaction();

      for (const document of batch) {
        transaction = transaction.createOrReplace(document);
      }

      await transaction.commit({ visibility: "sync" });
      console.log(
        "Promoted " +
          Math.min(index + batch.length, ordered.length) +
          "/" +
          ordered.length +
          " documents"
      );
    }
  }

  const actualDocuments = await client.getDocuments(expectedIds);
  const missingIds: string[] = [];
  const mismatches: string[] = [];

  for (let index = 0; index < documents.length; index += 1) {
    const actual = actualDocuments[index];
    if (!actual) {
      missingIds.push(documents[index]._id);
    } else if (digest(actual) !== digest(documents[index])) {
      mismatches.push(documents[index]._id);
    }
  }

  const [actualIds, articleSlugs, finalDocs] = await Promise.all([
    client.fetch<string[]>('*[_type in $types]._id', { types: ALLOWED_TYPES }),
    client.fetch<string[]>('*[_type == "article"].slug.current'),
    client.fetch<Array<{_id:string;_type:string}>>('*[]{_id,_type}'),
  ]);

  const finalUserDocs = finalDocs.filter(
    (doc) => !doc._id.startsWith("_.") && !doc._type.startsWith("system.")
  );
  const finalSystemDocs = finalDocs.filter(
    (doc) => doc._id.startsWith("_.") || doc._type.startsWith("system.")
  );

  const actualIdSet = new Set(actualIds);
  const unexpectedIds = actualIds.filter((id) => !expectedIdSet.has(id));
  const absentIds = expectedIds.filter((id) => !actualIdSet.has(id));
  const duplicateSlugs = articleSlugs.filter(
    (slug, index) => articleSlugs.indexOf(slug) !== index
  );
  const missingProtectedSlugs = PROTECTED_SLUGS.filter(
    (slug) => !articleSlugs.includes(slug)
  );
  const deprecatedSlugPresent = articleSlugs.includes(DEPRECATED_SLUG);
  const privatePathIds = actualIds.filter((id) => id.includes("."));

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
      { types: ALLOWED_TYPES }
    ),
    anonymousClient.fetch<number>('count(*[_type == "article"])'),
  ]);

  const exactMatch =
    finalUserDocs.length === REQUIRED_DOCUMENTS &&
    actualIds.length === REQUIRED_DOCUMENTS &&
    articleSlugs.length === REQUIRED_ARTICLES &&
    missingIds.length === 0 &&
    mismatches.length === 0 &&
    unexpectedIds.length === 0 &&
    absentIds.length === 0 &&
    duplicateSlugs.length === 0 &&
    missingProtectedSlugs.length === 0 &&
    !deprecatedSlugPresent &&
    privatePathIds.length === 0 &&
    anonymousDocuments === REQUIRED_DOCUMENTS &&
    anonymousArticles === REQUIRED_ARTICLES;

  const report = {
    schemaVersion: 1,
    projectId,
    dataset,
    preflight: {
      beforeAllCount,
      beforeUserDocuments: beforeUserDocs.length,
      beforeSystemDocuments: beforeSystemDocs.length,
      beforeManagedDocuments: beforeManagedIds.length,
      existingExactMatch,
    },
    summary: {
      expectedDocuments: REQUIRED_DOCUMENTS,
      actualDocuments: actualIds.length,
      userDocuments: finalUserDocs.length,
      systemDocumentsIgnored: finalSystemDocs.length,
      expectedArticles: REQUIRED_ARTICLES,
      actualArticles: articleSlugs.length,
      anonymousDocuments,
      anonymousArticles,
      missingIds: missingIds.length,
      mismatches: mismatches.length,
      unexpectedIds: unexpectedIds.length,
      absentIds: absentIds.length,
      duplicateSlugs: new Set(duplicateSlugs).size,
      missingProtectedSlugs: missingProtectedSlugs.length,
      deprecatedSlugPresent,
      privatePathIds: privatePathIds.length,
      exactMatch,
    },
    missingIds,
    mismatches,
    unexpectedIds,
    absentIds,
    duplicateSlugs: Array.from(new Set(duplicateSlugs)).sort(),
    missingProtectedSlugs,
    privatePathIds,
  };

  await mkdir("migration/phase7", { recursive: true });
  await writeFile(OUTPUT, JSON.stringify(report, null, 2) + "\n", "utf8");

  assert(exactMatch, "Production Sanity promotion verification failed");

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
