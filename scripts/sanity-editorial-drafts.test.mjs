import assert from "node:assert/strict";
import {test} from "node:test";
import {validateBatch, validateDocument, validatePatch, parsePayload} from "./sanity-editorial-drafts.mjs";

function article(id = "drafts.article-editorial-example-20261113",
  slug = "health-claim-deduction-example-2026") {
  return {
    _id: id, _type: "article",
    title: "Health Claim Deduction: An Editorial Example",
    slug: {_type: "slug", current: slug},
    excerpt: "How to review a health insurance settlement and ask for an itemised explanation.",
    contentType: "guide", monetization: "none", featured: false, cornerstone: false,
    readingTimeMinutes: 3,
    category: {_type: "reference", _ref: "category-health-insurance-faeb7d29a0"},
    author: {_type: "reference", _ref: "author-legal-team-7478b83c34"},
    topics: [{_key: "t1", _type: "reference", _ref: "71e6f52f-0d8a-4c8c-8e90-778cc5aa0f22"}],
    relatedArticles: [],
    seo: {_type: "seo", noIndex: false, noFollow: false},
    body: [{
      _key: "b1", _type: "block", style: "normal", markDefs: [],
      children: [{_key: "s1", _type: "span", marks: [], text: "Draft-only editorial example."}]
    }]
  };
}
test("accepts any valid draft article, not a specific slug", () => {
  const d = article();
  assert.equal(validateDocument(d).slug, "health-claim-deduction-example-2026");
});
test("accepts a batch of different new articles", () => {
  assert.equal(validateBatch([
    article(), article("drafts.article-another-new-20261113", "another-health-claim-guide-2026")
  ]).length, 2);
});
test("rejects duplicate slugs, including separate IDs", () => {
  assert.throws(() => validateBatch([
    article(), article("drafts.article-another-new-20261113")
  ]), /Duplicate slugs/);
});
test("rejects published ids, dates, legacy metadata, and unknown fields", () => {
  for (const changes of [
    {_id: "article-public-example"},
    {publishedAt: "2026-11-13T00:00:00Z"},
    {legacyOrder: 1},
    {unrecognizedField: "do not send"}
  ]) {
    assert.throws(() => validateDocument({...article(), ...changes}));
  }
});
test("rejects hardcoded protected editorial slugs", () => {
  assert.throws(() => validateDocument(article("drafts.article-protected-123456", "claim-rejection-guide")),
    /Protected/);
});
test("rejects invalid or duplicate Portable Text keys", () => {
  const d = article();
  d.body[0].children[0]._key = d.body[0]._key;
  assert.throws(() => validateDocument(d), /Duplicate/);
});
test("rejects publish-like SEO state", () => {
  const d = article();
  d.seo.noIndex = true;
  assert.throws(() => validateDocument(d), /SEO/);
});
test("supports pretty JSON and NDJSON batches", () => {
  const docs = [article(), article("drafts.article-another-new-20261113", "another-health-claim-guide-2026")];
  assert.equal(parsePayload(JSON.stringify(docs, null, 2)).length, 2);
  assert.equal(parsePayload(docs.map(x=>JSON.stringify(x)).join("\n")).length, 2);
});
test("allows revision-guarded narrow draft patches only", () => {
  const good = {
    draftId: "drafts.article-editorial-example-20261113",
    expectedRevision: "revision-1234567",
    set: {"seo.metaDescription": "Focused, verified summary", "featuredImage.alt": "Accurate visual description"}
  };
  assert.equal(validatePatch(good).draftId, good.draftId);
  assert.throws(() => validatePatch({...good, set: {publishedAt: "2026-11-13"}}), /unapproved/);
  assert.throws(() => validatePatch({...good, draftId: "article-published-123456"}), /draft ID/);
  assert.throws(() => validatePatch({...good, expectedRevision: ""}), /revision guard/);
});
