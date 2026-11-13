/**
 * One-time, draft-only Content Lake import for the approved ICU/HDU editorial manuscript.
 * Does NOT publish, change an existing document, update images, or deploy anything.
 * The manuscript must be supplied outside the public repository as a GitHub Actions secret.
 */
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const PROJECT = "ah5vm288";
const DATASET = "production";
const ID = "drafts.article-icu-hdu-deductions-20261113";
const SLUG = "icu-hdu-charges-health-insurance-claim-deduction-appeal";
const TITLE = "ICU or HDU Charges Deducted From Your Health Insurance Claim? How to Check and Appeal";
const EXPECTED_SHA256 = "b0ced87967489f7cfb53504dd970c006fed1a68fa1366c0868413a78d2fed18c";
const ALLOWED_MODES = new Set(["--validate", "--preflight", "--create"]);

function assert(ok, why) {
  if (!ok) throw new Error(why);
}

function inspectDraft(doc, raw) {
  assert(createHash("sha256").update(raw).digest("hex") === EXPECTED_SHA256,
    "Manuscript checksum mismatch: refuse to import a different file");
  assert(doc && !Array.isArray(doc) && doc._id === ID && doc._type === "article",
    "Wrong draft ID or document type");
  assert(doc.slug?._type === "slug" && doc.slug.current === SLUG && doc.title === TITLE,
    "Title or slug mismatch");
  assert(doc.contentType === "guide" && doc.monetization === "none",
    "Content classification or monetization must match the reviewed draft");
  assert(!Object.hasOwn(doc, "publishedAt") && !Object.hasOwn(doc, "_rev"),
    "Unpublished manuscript must not contain a publication date or a revision");
  assert(doc.seo?.noIndex === false && doc.seo?.noFollow === false &&
    !doc.seo?.canonicalOverride, "Unexpected canonical or robots metadata");
  assert(!doc.featuredImage && !doc.socialImage,
    "Images are added manually by the editor after draft creation");
  assert(Array.isArray(doc.body) && doc.body.length === 63,
    "Body block count does not match the reviewed manuscript");
  assert(doc.body.filter(x => x._type === "faqBlock").length === 1 &&
    doc.body.filter(x => x._type === "sourceCitation").length === 5 &&
    doc.body.filter(x => x._type === "articleTable").length === 2,
    "Expected FAQs, sources, or tables missing");
  assert(doc.body.filter(x => x._type === "faqBlock")[0].items.length === 8,
    "Expected eight FAQs");
  assert(Array.isArray(doc.relatedArticles) && doc.relatedArticles.length === 3,
    "Exactly three related articles are required");
  assert(Number.isInteger(doc.readingTimeMinutes) && doc.readingTimeMinutes > 0,
    "Reading time is missing");
  const ids = new Set();
  const walk = value => {
    if (Array.isArray(value)) return value.forEach(walk);
    if (!value || typeof value !== "object") return;
    if (value._key) {
      assert(!ids.has(value._key), "Repeated Portable Text _key");
      ids.add(value._key);
    }
    if (value._type === "block") {
      assert(Array.isArray(value.markDefs), "Portable Text block is missing markDefs");
    }
    Object.values(value).forEach(walk);
  };
  walk(doc.body);
  assert(doc.category?._ref && doc.author?._ref && doc.topics?.length === 1,
    "Required author/category/topic references are missing");
  const refs = [doc.category._ref, doc.author._ref,
    ...doc.topics.map(x => x._ref), ...doc.relatedArticles.map(x => x._ref)];
  assert(new Set(refs).size === refs.length, "Duplicate taxonomy or related reference");
  return refs;
}

async function inspectContentLake(client, refs) {
  // Raw perspective is important: duplicate detection must see *both* drafts and published documents.
  const matches = await client.fetch(
    '*[_type == "article" && (slug.current == $slug || title == $title || _id == $id)]{_id}',
    { slug: SLUG, title: TITLE, id: ID });
  assert(Array.isArray(matches) && matches.length === 0,
    "An article with this title, slug or draft ID already exists; refusing duplicate import");
  const found = await client.fetch('*[_id in $ids]{_id}', { ids: refs });
  const foundIds = new Set(found.map(x => x._id));
  assert(refs.every(id => foundIds.has(id)),
    "At least one author, category, topic or related-article reference is missing");
  assert(!foundIds.has(ID), "Duplicate draft ID");
}

async function main() {
  const [mode, file, ...extra] = process.argv.slice(2);
  assert(ALLOWED_MODES.has(mode) && file && extra.length === 0,
    "Usage: node scripts/import-icu-hdu-draft-only.mjs --validate|--preflight|--create PATH_TO_PRIVATE_NDJSON");
  const raw = await readFile(file);
  const doc = JSON.parse(raw.toString("utf8"));
  const refs = inspectDraft(doc, raw);
  console.log("Manuscript validation passed: " + doc.body.length +
    " blocks, " + refs.length + " valid reference shapes, no images or publication date.");
  if (mode === "--validate") return;

  const token = process.env.SANITY_EDITORIAL_DRAFT_TOKEN;
  assert(token, "Missing SANITY_EDITORIAL_DRAFT_TOKEN (project-scoped Editor token)");
  const { createClient } = await import("@sanity/client");
  const client = createClient({
    projectId: PROJECT, dataset: DATASET, apiVersion: "2026-08-27", token,
    useCdn: false, perspective: "raw"
  });
  await inspectContentLake(client, refs);
  console.log("Live production preflight passed: article slug is unused and all references exist.");
  if (mode === "--preflight") return;

  // Deliberately use Content Lake API create() rather than MCP create_documents:
  // MCP is currently misinterpreting the project's legacy schema metadata.
  // create() with a drafts.* ID cannot publish an article or overwrite an existing ID.
  await client.create(doc);
  const saved = await client.fetch('*[_id == $id][0]{_id,_type,"slug":slug.current,"bodyCount":count(body),"publishedAt":publishedAt}', {id: ID});
  assert(saved?._id === ID && saved?._type === "article" &&
    saved.slug === SLUG && saved.bodyCount === 63 && saved.publishedAt == null,
    "A draft write was attempted, but readback did not match; inspect Content Lake before retrying");
  console.log("SUCCESS: one unpublished ICU/HDU article draft created and read back. Images and practitioner sign-off remain pending.");
}

main().catch(error => {
  // Do not log manuscript bytes, tokens, API payloads or stack traces in public Action logs.
  console.error("DRAFT IMPORT STOPPED:", error?.message || "unknown error");
  process.exitCode = 1;
});
