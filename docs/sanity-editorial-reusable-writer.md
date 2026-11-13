# TatkalClaims — Reusable Sanity Editorial Draft Writer (Proposal)

## Goal
Create and maintain **many** TatkalClaims articles using the same draft-first process.
This replaces the article-specific workflow added in PR #82.

The public website and Sanity Studio content model are unchanged. This is a
tool for **private, authorized execution**, not an API route, published CMS
document, recurring GitHub workflow or Vercel production deployment.

## Why it is needed
On 13 November 2026, a successful deployment of the existing Studio schema
(GitHub run 43386923833) did not fix Sanity MCP document validation.
\`get_schema(type="article")\` returned the article type without its fields;
\`create_documents\` rejected valid keys such as title, slug, body and seo.
Sanity reported no content mutation. The repository's real Studio schema
(\`sanity/schemaTypes/documents/article.ts\`) still defines all these fields.
The MCP schema selection is currently a legacy-only \`_.schemas.tatkalClaims\`.
Prefer the native Sanity connector again if this is repaired.

## Draft-only workflow
1. Research/cannibalization check using Sanity; verify primary legal/regulatory
   sources, existing category/topic/author and internal links.
2. Prepare the complete manuscript privately as JSON/NDJSON in the existing
   \`article\` content model. Do NOT commit unpublished content to this public repo.
3. Use this reusable writer to validate → preflight → create unpublished draft(s)
   through Sanity Content Lake, with a project-scoped Editor token kept outside
   GitHub source and chat.
4. Confirm the draft by querying Sanity. User uploads 1200×675 JPG hero and
   1200×630 JPG social/OG images; assistant verifies exact image refs, MIME,
   dimensions, contextual alt, credit, display settings and final draft.
5. Stop. Ask for **explicit approval to publish**. Publishing and postpublish
   checks remain governed by \`docs/sanity-article-draft-sop.md\` and the
   authoritative handover. This writer DOES NOT publish.

## Execution — private authorized environment
A single project-scoped Editor token named
\`SANITY_EDITORIAL_DRAFT_TOKEN\` is required in a trusted runtime (for example,
an ephemeral, authenticated Vercel Sandbox accessed via connected tools).
Do not use the organization-wide Sanity schema-deployment token.

After an authorized runtime has the token and the private editorial JSON:
\`\`\`sh
node scripts/sanity-editorial-drafts.mjs validate /tmp/articles.ndjson
node scripts/sanity-editorial-drafts.mjs preflight /tmp/articles.ndjson
node scripts/sanity-editorial-drafts.mjs create /tmp/articles.ndjson
\`\`\`

One file can contain either one JSON object, a JSON array, or up to ten
newline-delimited objects. The same commands apply to every article; no hardcoded
slug, date, or article-specific workflow/secret is required. This does not
schedule imports and does not change \`main\` on its own.

For revisions to an existing **unpublished draft**, query its latest \`_rev\`
and prepare a narrow patch:
\`\`\`json
{
  "draftId": "drafts.article-example-123456",
  "expectedRevision": "current-draft-revision",
  "set": {
    "seo.metaDescription": "Carefully reviewed description",
    "featuredImage.alt": "Specific description of the uploaded illustration"
  }
}
\`\`\`
\`\`\`sh
node scripts/sanity-editorial-drafts.mjs patch-preflight /tmp/patch.json
node scripts/sanity-editorial-drafts.mjs patch /tmp/patch.json
\`\`\`
Published \`article.*\` IDs, \`publishedAt\`, \`legacyOrder\`, protected slugs,
titles, canonical overrides and unrelated fields cannot be patched.

**Execution limitation:** The connected Sanity MCP cannot currently perform
this write, and the direct private executor has not yet been proven end-to-end.
Do not claim fully autonomous draft creation until an authorized private
executor has been tested and the draft readback is confirmed.

## Safety checks
- No content exposed in public GitHub files, PR bodies or logs.
- No public API route or website changes.
- Fixed production project \`ah5vm288\`, dataset \`production\`.
- Draft-only IDs; no publishing, unpublishing, deleting or upsert.
- Entire batch validated before attempting one atomic transaction.
- Duplicate ID, title and slug lookup in raw Sanity perspective.
- Required references are checked in the production dataset.
- Recursive Portable Text \`_key\` uniqueness, block types, core metadata and
  non-monetized default profile.
- Draft edits require exact \`_rev\` optimistic locking and permitted fields.
- No GitHub merges or Vercel deployments without explicit user approval.
- No generated article should be uploaded as a GitHub Action artifact.

## Operational follow-up
- Run \`node --test scripts/sanity-editorial-drafts.test.mjs\` and
  \`node --check scripts/sanity-editorial-drafts.mjs\` during QA.
- Verify the private executor can invoke read-only preflight using the
  dedicated Editor credential **before** a real draft creation.
- Then import the already prepared ICU/HDU draft, verify the draft ID and slug,
  and stop for the image upload and practitioner review.
- If the native Sanity connector starts honoring the deployed schema again,
  prefer it for ordinary drafts and retain this script only as a fallback.
- Remove any unused one-time article secrets once no longer needed.
