import { createClient } from "@sanity/client";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const liveProjectId = "ah5vm288";
const projectId = process.env.SANITY_RECOVERY_PROJECT_ID || "";
const apiVersion = "2026-08-27";
const targetDataset = process.env.SANITY_RECOVERY_DATASET || "";
const token = process.env.SANITY_AUTH_TOKEN || "";

function validateRecoveryTarget() {
  assert(
    /^[a-z0-9]+$/.test(projectId),
    "Recovery project ID is required and must contain only lowercase letters and numbers"
  );
  assert(
    projectId !== liveProjectId,
    "Recovery validation can never target the live Tatkal Claims Sanity project"
  );
  assert(
    /^recovery-[a-z0-9][a-z0-9-]{0,63}$/.test(targetDataset),
    'Recovery dataset name must start with "recovery-" and contain only lowercase letters, numbers, and hyphens'
  );
  assert(
    targetDataset !== "production" && targetDataset !== "migration",
    "Recovery validation can never target production or migration"
  );
}

function isSystemDocumentId(id: string) {
  return id.startsWith("_.");
}

function clientForTarget() {
  assert(token, "SANITY_AUTH_TOKEN is required for recovery validation");

  return createClient({
    projectId,
    dataset: targetDataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: "raw",
  });
}

async function preflight() {
  validateRecoveryTarget();
  const client = clientForTarget();

  const datasets = await client.datasets.list();
  assert(
    datasets.some((dataset) => dataset.name === targetDataset),
    `Recovery dataset "${targetDataset}" does not exist. Create it manually before running recovery validation.`
  );

  const existing = await client.fetch<Array<{ _id: string }>>('*[]{_id}');
  const existingContent = existing.filter(
    (document) => !isSystemDocumentId(document._id)
  );
  const systemDocumentCount = existing.length - existingContent.length;

  assert(
    existingContent.length === 0,
    `Recovery dataset "${targetDataset}" is not empty (${existingContent.length} non-system documents; ${systemDocumentCount} Sanity system documents ignored). Use a fresh empty recovery-* dataset.`
  );

  console.log(
    `Recovery preflight passed: project ${projectId}, dataset ${targetDataset} has zero non-system documents (${systemDocumentCount} Sanity system documents ignored) and is isolated from the live Tatkal Claims project.`
  );
}

type ExportDocument = {
  _id?: string;
  _type?: string;
  slug?: { current?: string };
};

type RestoredDocument = {
  _id: string;
  _type: string;
  slug?: string;
};

function sorted(values: string[]) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function sameStrings(a: string[], b: string[]) {
  const left = sorted(a);
  const right = sorted(b);
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

async function verify() {
  validateRecoveryTarget();

  const ndjsonPath = process.env.RECOVERY_DATA_NDJSON || "";
  assert(ndjsonPath, "RECOVERY_DATA_NDJSON is required for recovery verification");

  const raw = await readFile(ndjsonPath, "utf8");
  const exported = raw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as ExportDocument)
    .filter(
      (document): document is Required<Pick<ExportDocument, "_id" | "_type">> &
        ExportDocument =>
        typeof document._id === "string" && typeof document._type === "string"
    );

  const assetTypes = new Set(["sanity.imageAsset", "sanity.fileAsset"]);
  const expectedNonAssetIds = exported
    .filter((document) => !assetTypes.has(document._type))
    .map((document) => document._id);

  const expectedPublishedArticleSlugs = exported
    .filter(
      (document) =>
        document._type === "article" &&
        !document._id.startsWith("drafts.") &&
        typeof document.slug?.current === "string"
    )
    .map((document) => document.slug!.current!);

  const expectedDraftArticleIds = exported
    .filter(
      (document) =>
        document._type === "article" && document._id.startsWith("drafts.")
    )
    .map((document) => document._id);

  const protectedSlugs = [
    "claim-rejection-guide",
    "irdai-30-day-claim-settlement-rule-health-insurance-rights",
    "mis-selling-guide",
  ];

  for (const slug of protectedSlugs) {
    assert(
      expectedPublishedArticleSlugs.includes(slug),
      `Backup is missing protected published article slug: ${slug}`
    );
  }

  const client = clientForTarget();
  const restored = await client.fetch<RestoredDocument[]>(
    '*[]{_id, _type, "slug": slug.current}'
  );
  const restoredContent = restored.filter(
    (document) => !isSystemDocumentId(document._id)
  );
  const restoredSystemDocumentCount = restored.length - restoredContent.length;

  const restoredNonAssetIds = restoredContent
    .filter((document) => !assetTypes.has(document._type))
    .map((document) => document._id);

  assert(
    sameStrings(expectedNonAssetIds, restoredNonAssetIds),
    "Restored non-asset document IDs do not exactly match the backup"
  );

  const restoredPublishedArticleSlugs = restoredContent
    .filter(
      (document) =>
        document._type === "article" &&
        !document._id.startsWith("drafts.") &&
        typeof document.slug === "string"
    )
    .map((document) => document.slug!);

  assert(
    sameStrings(expectedPublishedArticleSlugs, restoredPublishedArticleSlugs),
    "Restored published article slugs do not exactly match the backup"
  );

  const restoredDraftArticleIds = restoredContent
    .filter(
      (document) =>
        document._type === "article" && document._id.startsWith("drafts.")
    )
    .map((document) => document._id);

  assert(
    sameStrings(expectedDraftArticleIds, restoredDraftArticleIds),
    "Restored draft article IDs do not exactly match the backup"
  );

  const expectedAssetBinaryCount = Number(
    process.env.RECOVERY_ASSET_BINARY_COUNT || "0"
  );
  const restoredAssetCount = restoredContent.filter((document) =>
    assetTypes.has(document._type)
  ).length;

  if (expectedAssetBinaryCount > 0) {
    assert(
      restoredAssetCount > 0,
      "Backup contained asset binaries but the recovery dataset has no asset documents"
    );
  }

  const summary = {
    schemaVersion: 1,
    phase: "8D-recovery-validation",
    targetProjectId: projectId,
    targetDataset,
    expectedNonAssetDocuments: expectedNonAssetIds.length,
    restoredNonAssetDocuments: restoredNonAssetIds.length,
    expectedPublishedArticles: expectedPublishedArticleSlugs.length,
    restoredPublishedArticles: restoredPublishedArticleSlugs.length,
    expectedDraftArticles: expectedDraftArticleIds.length,
    restoredDraftArticles: restoredDraftArticleIds.length,
    backupAssetBinaries: expectedAssetBinaryCount,
    restoredAssetDocuments: restoredAssetCount,
    restoredSanitySystemDocumentsIgnored: restoredSystemDocumentCount,
    protectedSlugsVerified: protectedSlugs.length,
    exactNonAssetIdParity: true,
    exactPublishedSlugParity: true,
    exactDraftIdParity: true,
  };

  const outputPath =
    process.env.RECOVERY_VERIFICATION_OUTPUT ||
    "recovery-work/recovery-verification.json";

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(summary, null, 2) + "\n", "utf8");

  console.log(JSON.stringify(summary, null, 2));
}

async function main() {
  const mode = process.argv[2];
  if (mode === "preflight") return preflight();
  if (mode === "verify") return verify();
  throw new Error('Usage: tsx scripts/sanity-recovery-validation.ts "preflight" | "verify"');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
