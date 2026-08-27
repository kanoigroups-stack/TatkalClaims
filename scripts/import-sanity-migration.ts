import { readFile } from "node:fs/promises";
import { createClient } from "@sanity/client";

type SanityDocument = {
  _id: string;
  _type: string;
  [key: string]: unknown;
};

const NDJSON = "migration/sanity/dry-run.ndjson";
const REQUIRED_ARTICLES = 57;
const ALLOWED_TYPES = new Set(["article", "author", "category", "topic"]);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  assert(
    process.argv.includes("--confirm-import"),
    "Refusing to write. Re-run with --confirm-import only after reviewing migration/sanity/report.json."
  );

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-27";
  const token = process.env.SANITY_WRITE_TOKEN;

  assert(projectId, "NEXT_PUBLIC_SANITY_PROJECT_ID is required");
  assert(dataset, "NEXT_PUBLIC_SANITY_DATASET is required");
  assert(token, "SANITY_WRITE_TOKEN is required");
  assert(
    dataset === "migration",
    'Refusing to import into dataset "' +
      dataset +
      '". Phase 4 importer is hard-locked to the "migration" dataset.'
  );

  const raw = await readFile(NDJSON, "utf8");
  const documents = raw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as SanityDocument);

  const articles = documents.filter((doc) => doc._type === "article");
  assert(
    articles.length === REQUIRED_ARTICLES,
    "Expected " + REQUIRED_ARTICLES + " article documents, found " + articles.length
  );

  const ids = documents.map((doc) => doc._id);
  assert(new Set(ids).size === ids.length, "Duplicate document IDs in migration NDJSON");

  for (const document of documents) {
    assert(document._id, "Document missing _id");
    assert(
      ALLOWED_TYPES.has(document._type),
      "Unexpected Sanity document type: " + document._type
    );
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  const batchSize = 25;

  for (let index = 0; index < documents.length; index += batchSize) {
    const batch = documents.slice(index, index + batchSize);
    let transaction = client.transaction();

    for (const document of batch) {
      transaction = transaction.createOrReplace(document);
    }

    await transaction.commit({ visibility: "sync" });
    console.log(
      "Imported " +
        Math.min(index + batch.length, documents.length) +
        "/" +
        documents.length +
        " documents"
    );
  }

  console.log(
    JSON.stringify(
      {
        dataset,
        documents: documents.length,
        articles: articles.length,
        status: "import-complete",
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
