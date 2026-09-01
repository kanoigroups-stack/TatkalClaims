import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createClient } from "@sanity/client";

type DocumentShape = {
  _id: string;
  _type: string;
  [key: string]: unknown;
};

const OLD_PAYLOAD = "migration/sanity/private-id-pre-repair.ndjson";
const NEW_PAYLOAD = "migration/sanity/dry-run.ndjson";
const OUTPUT = "migration/sanity/public-id-repair-verification.json";
const REQUIRED_DOCUMENTS = 65;
const REQUIRED_ARTICLES = 57;
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

async function readNdjson(path: string): Promise<DocumentShape[]> {
  return (await readFile(path, "utf8"))
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as DocumentShape);
}

async function main() {
  assert(
    process.argv.includes("--confirm-public-id-repair"),
    "Refusing repair. Re-run with --confirm-public-id-repair."
  );

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-27";
  const token = process.env.SANITY_WRITE_TOKEN;

  assert(projectId === "ah5vm288", "Repair is locked to Sanity project ah5vm288");
  assert(dataset === "migration", 'Repair is locked to dataset "migration"');
  assert(token, "SANITY_WRITE_TOKEN is required");

  const [oldDocs, newDocs] = await Promise.all([
    readNdjson(OLD_PAYLOAD),
    readNdjson(NEW_PAYLOAD),
  ]);

  assert(oldDocs.length === REQUIRED_DOCUMENTS, "Old rollback payload must contain exactly 65 documents");
  assert(newDocs.length === REQUIRED_DOCUMENTS, "New payload must contain exactly 65 documents");
  assert(oldDocs.filter((doc) => doc._type === "article").length === REQUIRED_ARTICLES, "Old rollback payload must contain exactly 57 articles");
  assert(newDocs.filter((doc) => doc._type === "article").length === REQUIRED_ARTICLES, "New payload must contain exactly 57 articles");

  const oldIds = oldDocs.map((doc) => doc._id);
  const newIds = newDocs.map((doc) => doc._id);
  const oldSet = new Set(oldIds);

  assert(new Set(oldIds).size === REQUIRED_DOCUMENTS, "Old payload contains duplicate IDs");
  assert(new Set(newIds).size === REQUIRED_DOCUMENTS, "New payload contains duplicate IDs");
  assert(oldIds.every((id) => id.includes(".")), "Old rollback payload must contain the known private sub-path IDs");
  assert(newIds.every((id) => !id.includes(".")), "New payload must contain only root-path IDs without periods");
  assert(newIds.every((id) => !oldSet.has(id)), "Old and new document ID sets must not overlap");

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: "published",
  });

  const anonymousClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: "published",
  });

  const currentIds = await client.fetch<string[]>(
    '*[_type in $types]._id',
    { types: ALLOWED_TYPES }
  );
  assert(currentIds.length === REQUIRED_DOCUMENTS, "Preflight failed: migration dataset does not contain exactly 65 managed documents");

  const currentSet = new Set(currentIds);
  assert(
    oldIds.every((id) => currentSet.has(id)) &&
      currentIds.every((id) => oldSet.has(id)),
    "Preflight failed: current managed ID set is not the frozen private-ID payload"
  );

  const actualOldDocs = await client.getDocuments(oldIds);
  for (let index = 0; index < oldDocs.length; index += 1) {
    const actual = actualOldDocs[index];
    assert(actual, "Preflight failed: missing old document " + oldDocs[index]._id);
    assert(
      digest(actual) === digest(oldDocs[index]),
      "Preflight failed: old document content changed for " + oldDocs[index]._id
    );
  }

  async function deleteDocuments(documents: DocumentShape[]) {
    const ordered = [
      ...documents.filter((doc) => doc._type === "article"),
      ...documents.filter((doc) => doc._type !== "article"),
    ];
    const batchSize = 25;
    for (let index = 0; index < ordered.length; index += batchSize) {
      const batch = ordered.slice(index, index + batchSize);
      let transaction = client.transaction();
      for (const document of batch) transaction = transaction.delete(document._id);
      await transaction.commit({ visibility: "sync" });
    }
  }

  async function createDocuments(documents: DocumentShape[]) {
    const ordered = [
      ...documents.filter((doc) => doc._type !== "article"),
      ...documents.filter((doc) => doc._type === "article"),
    ];
    const batchSize = 25;
    for (let index = 0; index < ordered.length; index += batchSize) {
      const batch = ordered.slice(index, index + batchSize);
      let transaction = client.transaction();
      for (const document of batch) transaction = transaction.createOrReplace(document);
      await transaction.commit({ visibility: "sync" });
    }
  }

  let swapStarted = false;

  try {
    swapStarted = true;
    await deleteDocuments(oldDocs);
    await createDocuments(newDocs);

    const actualNewDocs = await client.getDocuments(newIds);
    const missing: string[] = [];
    const mismatches: string[] = [];

    for (let index = 0; index < newDocs.length; index += 1) {
      const actual = actualNewDocs[index];
      if (!actual) {
        missing.push(newDocs[index]._id);
      } else if (digest(actual) !== digest(newDocs[index])) {
        mismatches.push(newDocs[index]._id);
      }
    }

    const managedIds = await client.fetch<string[]>(
      '*[_type in $types]._id',
      { types: ALLOWED_TYPES }
    );
    const managedSet = new Set(managedIds);
    const newSet = new Set(newIds);
    const unexpected = managedIds.filter((id) => !newSet.has(id));
    const absent = newIds.filter((id) => !managedSet.has(id));

    const [authenticatedArticles, anonymousArticles, anonymousDocuments] =
      await Promise.all([
        client.fetch<number>('count(*[_type == "article"])'),
        anonymousClient.fetch<number>('count(*[_type == "article"])'),
        anonymousClient.fetch<number>('count(*[_type in $types])', { types: ALLOWED_TYPES }),
      ]);

    const report = {
      schemaVersion: 1,
      projectId,
      dataset,
      status: "success",
      oldPrivateDocumentsRemoved: oldIds.length,
      newPublicDocumentsCreated: newIds.length,
      authenticatedArticles,
      anonymousArticles,
      anonymousDocuments,
      missing,
      mismatches,
      unexpected,
      absent,
      privatePathIdsRemaining: managedIds.filter((id) => id.includes(".")),
      exactMatch:
        managedIds.length === REQUIRED_DOCUMENTS &&
        authenticatedArticles === REQUIRED_ARTICLES &&
        anonymousArticles === REQUIRED_ARTICLES &&
        anonymousDocuments === REQUIRED_DOCUMENTS &&
        missing.length === 0 &&
        mismatches.length === 0 &&
        unexpected.length === 0 &&
        absent.length === 0 &&
        managedIds.every((id) => !id.includes(".")),
    };

    await mkdir("migration/sanity", { recursive: true });
    await writeFile(OUTPUT, JSON.stringify(report, null, 2) + "\n", "utf8");
    assert(report.exactMatch, "Public-ID repair postflight verification failed");
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    if (swapStarted) {
      console.error("Repair failed; restoring frozen private-ID payload.");
      try {
        const existingNew = await client.getDocuments(newIds);
        const newDocsPresent = newDocs.filter((_, index) => Boolean(existingNew[index]));
        if (newDocsPresent.length) await deleteDocuments(newDocsPresent);
        await createDocuments(oldDocs);

        const restored = await client.getDocuments(oldIds);
        const rollbackOk = restored.every(
          (actual, index) => Boolean(actual) && digest(actual) === digest(oldDocs[index])
        );
        console.error(
          rollbackOk
            ? "Rollback completed successfully."
            : "WARNING: rollback verification failed."
        );
      } catch (rollbackError) {
        console.error("CRITICAL: automatic rollback failed.", rollbackError);
      }
    }
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
