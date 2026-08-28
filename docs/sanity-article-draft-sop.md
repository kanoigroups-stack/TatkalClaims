# Tatkal Claims — Sanity Article Draft SOP

## Purpose

This is the required operating procedure for creating or editing Tatkal Claims articles through Sanity MCP.

It applies to project `ah5vm288`, dataset `production`, and the embedded Studio at `/studio`.

The goal is to automate routine editorial work while keeping URL, SEO, publishing, and rollback safety intact.

## Non-negotiable safety rules

1. **Read first.** Query the target article, current references, and relevant existing articles before any write.
2. **Draft only by default.** New MCP documents must be created as drafts. Edits to published documents must be saved to their draft version.
3. **Never publish without explicit user approval in the current conversation.**
4. **Never change a migrated article slug.**
5. **Never set or modify `legacyOrder` for a new article.** It is migration-only and also makes the Studio treat the slug as locked.
6. **Preserve `publishedAt` on existing articles** unless the user explicitly requests a publication-date correction.
7. **Do not touch the legacy rollback stack** as part of editorial work.
8. **Do not place AdSense markup in Sanity body content.**
9. **Do not use `relatedArticles` as if it controls the current public "More Articles" cards.** The field is stored by Sanity, but the public article page currently chooses the first two other posts instead.
10. **Do not describe `articleChart` as a graphical chart on the live site.** The current renderer presents chart data as an accessible table.
11. The following protected slugs require separate explicit approval before any draft edit:
   - `claim-rejection-guide`
   - `irdai-30-day-claim-settlement-rule-health-insurance-rights`
   - `mis-selling-guide`

## Phase A — read-only discovery

Before preparing a draft:

1. Query for an existing article with the proposed slug/title/topic to avoid duplicates.
2. Query current authors, categories, and topics. Reuse existing references; do not create duplicate taxonomy documents automatically.
3. For an existing article, read the published document and current draft state before editing.
4. For current/news/regulatory/judgment content, verify the underlying sources before drafting factual claims.
5. Identify relevant existing Tatkal Claims articles for internal links.

Current reference baseline (query again before each write):

**Authors**
- Ankit L Kanoi, Founder
- Insurance Expert
- Legal Team

**Categories**
- Claim Delay
- Claim Rejection
- Health Insurance
- Mis-selling
- News

**Topics**
- None currently. Do not create a topic merely to fill the optional field.

## Phase B — article brief

Before the first write, have enough information to determine:

- article purpose and reader intent
- working title
- content type
- category
- author
- primary subject/query
- whether the article is evergreen, news, regulatory, case study, or judgment coverage
- intended publication timing
- source material
- image plan
- internal-link targets

If a consequential choice is unclear, surface it before creating the draft rather than inventing taxonomy, authorship, legal facts, or publication timing.

## Phase C — field rules

### Required content fields

**`title`**
- Required.
- Human-readable article headline.
- Do not put the site name into the article title just to influence SEO.

**`slug`**
- Required.
- New article: generate a concise lowercase hyphenated slug and verify it is unique across published documents and drafts.
- Existing migrated article: do not modify it.
- Preserve trailing-slash public URL convention: `/blog/[slug]/`.

**`excerpt`**
- Required.
- Write a useful stand-alone summary, not keyword stuffing.
- This becomes the meta description when `seo.metaDescription` is empty.

**`body`**
- Required and non-empty.
- Portable Text only for new editorial articles.
- Do not insert an H1 inside the body; the page title is already the H1.
- Use H2 for major sections and H3 for subsections.
- Use the Portable Text divider style `hr`; do not simulate dividers with a paragraph containing `---`.

### Organization fields

**`contentType`** — required. Allowed values:
- `guide`
- `explainer`
- `news`
- `regulatoryUpdate`
- `caseStudy`
- `judgment`

**`category`** — required reference.
- Reuse an existing category whenever appropriate.
- Creating a new category is a separate taxonomy decision and needs explicit approval.

**`topics`** — optional references.
- Reuse existing topics.
- Do not create topics automatically just because the array is empty.

**`author`** — required reference.
- Reuse an existing author.
- Surface the proposed author in the pre-write summary.

**`relatedArticles`** — optional editorial data only.
- May be populated for future use.
- Must not be used as evidence that the live "More Articles" UI will change today.

### Dates and reading time

**`publishedAt`** — required.
- Existing article: preserve it.
- New draft: use the intended publication timestamp if known.
- If the exact publication time is not yet known, use a clearly provisional planned value and refresh it immediately before publish.
- Do not silently backdate a new article.

**`updatedAt`** — optional.
- Existing article: set only for a substantive editorial update when appropriate.
- New draft: normally leave empty until a later update.

**`readingTimeMinutes`** — optional but recommended.
- Populate an integer of at least 1 so the public page does not show "Read time unavailable".
- Use a consistent estimate based on body text; round up rather than down.

### Migration/settings fields

**`legacyOrder`**
- Migration-only.
- Never set it on a new article.
- Never modify it on a migrated article during editorial work.

**`featured`** and **`cornerstone`**
- Default to false unless the editorial brief deliberately calls for them.
- They are classification/settings fields, not substitutes for content quality.

**`monetization`**
- Allowed values: `none`, `light`, `standard`.
- New article default in schema is `standard`.
- This is an editorial profile only; do not inject ad markup into the article body.

## Phase D — media rules

### Featured image — `featuredImage`

Required.

For new editorial articles:
- Prefer an uploaded Sanity image.
- `externalUrl` exists primarily for migration compatibility and should not be the normal new-content path.
- Alt text is required and must describe the image meaningfully.
- Do not use the title mechanically as alt text unless it actually describes the image.
- Optional caption and credit should be accurate.
- `displaySize` does not control featured-image placement.

A draft is not publish-ready if `featuredImage` has neither an uploaded image asset nor a valid external URL.

### Social image — `socialImage`

Optional.

Fallback order in the current frontend:
1. `seo.ogImage`
2. `socialImage`
3. `featuredImage`

Do not duplicate the same uploaded asset into every field unless there is an editorial reason.

### Images inside the body

Use `articleImage`.
- Alt text is required.
- Prefer uploaded Sanity assets for new editorial content.
- Supported display sizes: `normal`, `wide`, `full`.
- Add caption/credit when useful.

## Phase E — Portable Text body components

Supported text:
- normal paragraphs
- H2
- H3
- blockquote
- divider
- bullet list
- numbered list
- strong
- emphasis
- link

Supported custom blocks:
- `articleImage`
- `articleTable`
- `articleChart`
- `keyTakeaway`
- `importantRule`
- `expertNote`
- `warningBlock`
- `faqBlock`
- `sourceCitation`
- `articleCta`

### Internal links

For Tatkal Claims articles, prefer relative links:

`/blog/example-slug/`

This keeps internal links same-site and same-tab.

Before inserting an internal link:
- verify the destination article exists
- use its actual canonical slug
- do not link to the authenticated CMS preview URL
- do not link to a superseded/redirect source URL when the canonical destination is known

### External links

Use a valid `http` or `https` URL. The frontend opens absolute web URLs in a new tab with `noopener noreferrer`.

### Tables

For `articleTable`:
- at least one row
- each row must contain at least one cell
- use `hasHeaderRow: true` when the first row is genuinely a header
- keep the number/order of columns consistent across rows
- title and caption are optional
- `**bold**` inside a cell is supported by the current renderer for simple emphasis

### Charts

For `articleChart`:
- title required
- type required: `bar`, `line`, or `pie`
- at least one data point with label + numeric value
- unit/source/sourceUrl/notes are optional
- current public rendering is a **data table**, not a drawn bar/line/pie visualization
- only use it when the tabular representation is acceptable until graphical rendering is deliberately added later

### FAQ

Use `faqBlock` only when questions are genuinely useful to the article. Each item requires a question and a non-empty Portable Text answer.

### Source/citation

Use `sourceCitation` where an explicit source block improves trust or traceability. It requires source name and URL.

Do not invent case citations, regulatory dates, court holdings, statistics, or source URLs.

### CTA

The public article page already includes a fixed Tatkal Claims case-evaluation CTA after the body.

Use `articleCta` inside the body only deliberately; otherwise it may create a redundant CTA experience.

## Phase F — SEO rules

The `seo` object is optional because the frontend has fallbacks.

**`metaTitle`**
- Optional; falls back to article title.
- Studio warns above 60 characters.

**`metaDescription`**
- Optional; falls back to excerpt.
- Studio warns above 160 characters.

**`canonicalOverride`**
- Advanced only.
- Normally leave empty so the canonical is `/blog/[slug]/`.
- Never use the authenticated preview URL as a canonical.

**`noIndex` / `noFollow`**
- Normal publishable article: leave false.
- The authenticated CMS preview is forcibly noindex/nofollow regardless of these fields.

**`ogTitle` / `ogDescription`**
- Optional; fall back to the resolved meta title/description.

**`ogImage`**
- Optional; falls back to social image, then featured image.

Before publish, verify:
- canonical is intended
- noIndex is false unless deliberate
- noFollow is false unless deliberate
- title/description are sensible at search-result length
- social image fallback is usable

## Phase G — MCP write procedure

### Editing an existing article

1. Read the published document and `_rev`.
2. Confirm it is not one of the protected slugs unless explicit approval has been given.
3. Patch using the published document ID with an optimistic `ifRevisionId` guard.
4. MCP must save the edit to the draft version; published content must remain unchanged.
5. Re-query both raw published and draft states and confirm only the intended fields differ.

### Creating a new article

1. Query for duplicate title/slug candidates.
2. Resolve existing author/category/topic references.
3. Create the `article` through MCP without a custom ID unless a stable custom ID is genuinely required.
4. MCP `create_documents` creates a draft by default.
5. Do not set `legacyOrder`.
6. Re-read the created draft and validate all required fields before preview.

## Phase H — draft QA gate

A draft is not ready for publish approval until all applicable checks pass:

- title present
- unique slug present
- excerpt present
- body non-empty
- content type valid
- existing category reference valid
- existing author reference valid
- featured image has usable source
- featured-image alt text present
- publishedAt present
- reading time populated where practical
- Portable Text contains no unsupported block types
- internal links resolve to intended public URLs
- tables render correctly
- articleChart is acceptable as a table in the current frontend
- SEO fallbacks/overrides are intentional
- canonical is correct
- noIndex/noFollow publish state is intentional
- existing migrated slug/date/legacyOrder invariants preserved
- protected-slug rule respected

## Phase I — preview isolation

Use:

`https://tatkalclaims.com/cms-preview/blog/[slug]/`

The authenticated preview is draft-first and noindex.

For an edit to an existing published article verify both:
- CMS preview shows the draft changes.
- `https://tatkalclaims.com/blog/[slug]/` still shows the published version.

For a brand-new draft, the public URL should not expose the unpublished article.

Do not use `?debug=1` for ordinary editorial preview.

## Phase J — publish approval gate

Before calling any publish operation, present a concise publish summary containing:

- title
- slug/public URL
- content type
- category
- author
- intended `publishedAt`
- featured/social image status
- SEO title/description/canonical/noindex state
- important internal links
- any table/chart/special blocks
- whether this is a new article or an update
- exact fields changed for an existing article

Then ask for explicit approval to publish.

**No explicit approval = no publish.**

## Phase K — post-publish verification

After approved publishing:

1. Confirm draft has been published successfully.
2. Confirm the public article becomes available/updates after the normal cache propagation window.
3. Verify public title, excerpt, image, body, tables, links, CTA behavior, and metadata.
4. Verify canonical and robots state.
5. Verify sitemap inclusion for normal indexable articles.
6. Confirm protected redirects/slugs are unchanged.
7. Confirm there is no unintended residual draft.
8. If the publish introduced a material error, use a controlled corrective draft/revert rather than editing blindly.

## Phase L — abandoned draft cleanup

If the user rejects or abandons a draft:
- discard the draft through MCP
- verify the published document remains unchanged
- verify no residual article draft remains

Do not leave temporary test markers, test images, test tables, or throwaway drafts in production.

## What MCP may automate after this SOP

Without changing the approval model, MCP may prepare:

- complete new article drafts
- existing-article draft edits
- SEO fields
- Portable Text structure
- tables
- current table-rendered chart blocks
- FAQ/source/callout blocks
- internal links
- taxonomy/reference selection from existing documents
- draft QA queries
- post-write comparison of draft vs published content

Publishing, protected-slug edits, new taxonomy creation, canonical overrides, and other consequential editorial decisions remain approval-gated.
