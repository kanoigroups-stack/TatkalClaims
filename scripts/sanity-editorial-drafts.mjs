/**
 * Reusable TatkalClaims draft-only Content Lake writer.
 * Designed for an authenticated PRIVATE executor. Never commit unpublished
 * editorial payloads or credentials to the public repository.
 *
 * Usage:
 *   node scripts/sanity-editorial-drafts.mjs validate articles.ndjson
 *   node scripts/sanity-editorial-drafts.mjs preflight articles.ndjson
 *   node scripts/sanity-editorial-drafts.mjs create articles.ndjson
 *   node scripts/sanity-editorial-drafts.mjs patch-preflight patch.json
 *   node scripts/sanity-editorial-drafts.mjs patch patch.json
 *
 * There is deliberately NO publish, unpublish, delete, or upsert operation.
 */
import {readFile} from "node:fs/promises";
import {pathToFileURL} from "node:url";

const PROJECT_ID = "ah5vm288";
const DATASET = "production";
const MAX_BATCH = 10;
const ALLOWED_TYPES = new Set(["guide", "explainer", "news", "regulatoryUpdate", "caseStudy", "judgment"]);
const BLOCK_TYPES = new Set([
  "block", "articleImage", "articleTable", "articleChart", "keyTakeaway",
  "importantRule", "expertNote", "warningBlock", "faqBlock", "sourceCitation", "articleCta"
]);
const ROOT_FIELDS = new Set([
  "_id", "_type", "title", "slug", "excerpt", "contentType", "category", "topics",
  "author", "featuredImage", "socialImage", "readingTimeMinutes", "body",
  "featured", "cornerstone", "seo", "relatedArticles", "monetization"
]);
const PATCH_FIELDS = new Set([
  "excerpt", "body", "seo.metaDescription", "seo.ogDescription", "seo.ogTitle",
  "seo.metaTitle", "featuredImage.alt", "featuredImage.credit",
  "featuredImage.displaySize", "socialImage.alt", "socialImage.credit",
  "socialImage.displaySize", "topics", "relatedArticles", "readingTimeMinutes"
]);
const PROTECTED_SLUGS = new Set([
  "claim-rejection-guide",
  "irdai-30-day-claim-settlement-rule-health-insurance-rights",
  "mis-selling-guide"
]);

function insist(value, message) {
  if (!value) throw new Error(message);
}
function isRef(value) {
  return value && value._type === "reference" && typeof value._ref === "string" &&
    value._ref.length > 0 && !value._ref.startsWith("drafts.");
}
function safeId(id) {
  return typeof id === "string" && /^drafts\.[a-zA-Z0-9][a-zA-Z0-9_.-]{5,100}$/.test(id);
}
function verifyTree(node, usedKeys) {
  if (Array.isArray(node)) {
    for (const item of node) verifyTree(item, usedKeys);
    return;
  }
  if (!node || typeof node !== "object") return;
  if (Object.hasOwn(node, "_key")) {
    insist(typeof node._key === "string" && node._key.length > 0, "Invalid _key");
    insist(!usedKeys.has(node._key), "Duplicate Portable Text / array _key: " + node._key);
    usedKeys.add(node._key);
  }
  if (node._type === "block") {
    insist(Array.isArray(node.markDefs), "Portable Text block missing markDefs");
    insist(Array.isArray(node.children), "Portable Text block missing children");
  }
  if (node._type === "sourceCitation") {
    insist(typeof node.url === "string" && /^https:\/\//i.test(node.url),
      "Source citation must use HTTPS");
  }
  for (const value of Object.values(node)) verifyTree(value, usedKeys);
}
function refList(draft) {
  return [
    draft.category._ref,
    draft.author._ref,
    ...(draft.topics || []).map(x => x._ref),
    ...(draft.relatedArticles || []).map(x => x._ref)
  ];
}
export function validateDocument(draft) {
  insist(draft && !Array.isArray(draft) && typeof draft === "object", "Document must be an object");
  insist(safeId(draft._id) && draft._type === "article", "Only explicit drafts.* article IDs are permitted");
  for (const field of Object.keys(draft)) {
    insist(ROOT_FIELDS.has(field), "Unexpected root document field: " + field);
  }
  insist(!Object.hasOwn(draft, "publishedAt") && !Object.hasOwn(draft, "_rev") &&
    !Object.hasOwn(draft, "legacyOrder"), "No publication date, revision, or migration field allowed");
  insist(typeof draft.title === "string" && draft.title.trim().length > 12, "Missing article title");
  insist(draft.slug?._type === "slug" && typeof draft.slug.current === "string" &&
    /^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(draft.slug.current), "Invalid slug");
  insist(!PROTECTED_SLUGS.has(draft.slug.current), "Protected editorial slug requires separate authorization");
  insist(typeof draft.excerpt === "string" && draft.excerpt.trim().length > 30, "Missing excerpt");
  insist(ALLOWED_TYPES.has(draft.contentType), "Unknown article contentType");
  insist(draft.monetization === "none", "New article monetization must be none");
  insist(draft.featured !== true && draft.cornerstone !== true, "Featured/cornerstone classification requires separate review");
  insist(isRef(draft.category) && isRef(draft.author), "Invalid author or category reference");
  insist(Array.isArray(draft.topics || []) && (draft.topics || []).every(isRef),
    "Invalid topic references");
  insist(Array.isArray(draft.relatedArticles || []) &&
    (draft.relatedArticles || []).length <= 3 &&
    (draft.relatedArticles || []).every(isRef), "Invalid related article references");
  insist(Number.isInteger(draft.readingTimeMinutes) && draft.readingTimeMinutes >= 1,
    "Reading time must be a positive integer");
  insist(Array.isArray(draft.body) && draft.body.length > 0 &&
    draft.body.every(x => BLOCK_TYPES.has(x._type)), "Body must contain supported Portable Text blocks");
  insist(draft.seo && draft.seo._type === "seo" &&
    draft.seo.noIndex === false && draft.seo.noFollow === false &&
    !draft.seo.canonicalOverride, "SEO flags/canonical override are not publish-ready");
  for (const image of [draft.featuredImage, draft.socialImage]) {
    if (image !== undefined) {
      insist(image._type === "articleImage" &&
        typeof image.alt === "string" && image.alt.trim().length > 4,
        "Image metadata requires an articleImage object and descriptive alt");
      insist(Boolean(image.image?.asset?._ref) || Boolean(image.externalUrl),
        "Do not attach a media object without an image asset");
    }
  }
  const allKeys = new Set();
  verifyTree(draft.body, allKeys);
  verifyTree(draft.topics || [], allKeys);
  verifyTree(draft.relatedArticles || [], allKeys);
  const refs = refList(draft);
  insist(new Set(refs).size === refs.length, "Duplicate author/category/topic/related reference");
  return {id: draft._id, slug: draft.slug.current, title: draft.title, refs};
}
export function validateBatch(input) {
  const rows = Array.isArray(input) ? input : [input];
  insist(rows.length >= 1 && rows.length <= MAX_BATCH, "Batch must contain 1–10 articles");
  const summaries = rows.map(validateDocument);
  insist(new Set(summaries.map(x => x.id)).size === rows.length, "Duplicate draft IDs in input");
  insist(new Set(summaries.map(x => x.slug)).size === rows.length, "Duplicate slugs in input");
  insist(new Set(summaries.map(x => x.title)).size === rows.length, "Duplicate titles in input");
  return summaries;
}
export function validatePatch(payload) {
  insist(payload && typeof payload === "object" && !Array.isArray(payload), "Patch must be an object");
  insist(safeId(payload.draftId), "Patch target must be a draft ID");
  insist(typeof payload.expectedRevision === "string" && payload.expectedRevision.length > 4,
    "Patch requires an explicit draft revision guard");
  insist(payload.set && typeof payload.set === "object" && !Array.isArray(payload.set),
    "Patch requires set fields");
  const entries = Object.entries(payload.set);
  insist(entries.length > 0 && entries.every(([key]) => PATCH_FIELDS.has(key)),
    "Patch contains an unapproved field");
  if (Object.hasOwn(payload.set, "body")) {
    insist(Array.isArray(payload.set.body) && payload.set.body.length > 0,
      "Updated body cannot be empty");
    verifyTree(payload.set.body, new Set());
  }
  for (const key of ["relatedArticles", "topics"]) {
    if (Object.hasOwn(payload.set, key)) {
      const value = payload.set[key];
      insist(Array.isArray(value) && (key !== "relatedArticles" || value.length <= 3) &&
        value.every(isRef), "Invalid references in patch");
    }
  }
  if (Object.hasOwn(payload.set, "readingTimeMinutes")) {
    insist(Number.isInteger(payload.set.readingTimeMinutes) &&
      payload.set.readingTimeMinutes >= 1, "Invalid reading time");
  }
  return payload;
}
export function parsePayload(text) {
  const lines = text.split(/\r?\n/).filter(x => x.trim().length > 0);
  if (lines.length === 1) {
    const value = JSON.parse(lines[0]);
    return value;
  }
  return lines.map(line => JSON.parse(line));
}
async function clientFor(mode) {
  const token = process.env.SANITY_EDITORIAL_DRAFT_TOKEN;
  insist(token && token.trim().length > 10,
    "Private executor needs a project-scoped SANITY_EDITORIAL_DRAFT_TOKEN");
  const {createClient} = await import("@sanity/client");
  return createClient({
    projectId: PROJECT_ID, dataset: DATASET, apiVersion: "2026-08-27",
    token, useCdn: false, perspective: "raw"
  });
}
async function preflightCreate(client, summaries) {
  const ids = summaries.map(x => x.id);
  const slugs = summaries.map(x => x.slug);
  const titles = summaries.map(x => x.title);
  const duplicates = await client.fetch(
    '*[_type == "article" && (_id in $ids || slug.current in $slugs || title in $titles)]{_id}',
    {ids, slugs, titles});
  insist(duplicates.length === 0, "One or more articles already exist under this ID, slug, or title");
  const refs = [...new Set(summaries.flatMap(x => x.refs))];
  const present = await client.fetch('*[_id in $refs]{_id}', {refs});
  const set = new Set(present.map(x => x._id));
  insist(refs.every(x => set.has(x)), "A referenced author/category/topic/article is missing");
  return summaries.length;
}
async function preflightPatch(client, payload) {
  const draft = await client.fetch(
    '*[_id == $id][0]{_id,_rev,_type,"slug":slug.current,"publishedAt":publishedAt}',
    {id: payload.draftId});
  insist(draft?._id === payload.draftId && draft?._type === "article",
    "Draft does not exist; published documents cannot be patched directly");
  insist(!PROTECTED_SLUGS.has(draft.slug), "Protected article requires separate approval");
  insist(draft._rev === payload.expectedRevision, "Draft has changed since last read");
  const fields = payload.set;
  const refs = [
    ...(fields.topics || []).map(x => x._ref),
    ...(fields.relatedArticles || []).map(x => x._ref)
  ];
  if (refs.length) {
    const present = await client.fetch('*[_id in $refs]{_id}', {refs});
    const known = new Set(present.map(x => x._id));
    insist(refs.every(x => known.has(x)), "Invalid references in patch");
  }
  return draft;
}
async function main() {
  const [command, filename, ...extra] = process.argv.slice(2);
  const modes = ["validate", "preflight", "create", "patch-preflight", "patch"];
  insist(modes.includes(command) && filename && extra.length === 0,
    "Usage: node scripts/sanity-editorial-drafts.mjs validate|preflight|create|patch-preflight|patch PRIVATE_JSON");
  const contents = await readFile(filename, "utf8");
  insist(Buffer.byteLength(contents) <= 512000, "Payload too large");
  const value = parsePayload(contents);
  if (command.startsWith("patch")) {
    const p = validatePatch(value);
    console.log("Draft-only patch validation passed.");
    const client = await clientFor(command);
    await preflightPatch(client, p);
    console.log("Draft revision and references verified.");
    if (command === "patch") {
      const updated = await client.patch(p.draftId).set(p.set)
        .ifRevisionId(p.expectedRevision).commit({visibility: "sync"});
      insist(updated?._id === p.draftId, "Patch result must be the same draft");
      console.log("An unpublished draft was updated; publication was not requested.");
    }
    return;
  }
  const batch = Array.isArray(value) ? value : [value];
  const summaries = validateBatch(batch);
  console.log("Local checks passed for " + summaries.length + " unpublished draft(s).");
  if (command === "validate") return;
  const client = await clientFor(command);
  await preflightCreate(client, summaries);
  console.log("Read-only duplicate and reference checks passed.");
  if (command === "preflight") return;
  let txn = client.transaction();
  for (const doc of batch) txn = txn.create(doc);
  await txn.commit({visibility: "sync"});
  const ids = summaries.map(x => x.id);
  const saved = await client.fetch(
    '*[_id in $ids]{_id,_type,"slug":slug.current,"bodyCount":count(body),"publishedAt":publishedAt}',
    {ids});
  const got = new Map(saved.map(x => [x._id, x]));
  insist(summaries.every(x => {
    const item = got.get(x.id);
    return item && item._type === "article" && item.slug === x.slug &&
      item.bodyCount > 0 && item.publishedAt == null;
  }), "Draft write completed but post-write verification is incomplete; inspect before retrying");
  console.log("Created " + saved.length + " unpublished drafts. No publication or deployment.");
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    // Do not print full API errors, draft content, tokens or private payloads.
    const known = error instanceof Error ? error.message : "Unknown failure";
    console.error("Draft-only writer stopped: " + known.slice(0,300));
    process.exitCode = 1;
  });
}
