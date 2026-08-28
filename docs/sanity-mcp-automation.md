# Tatkal Claims — Sanity MCP automation

## Purpose

Sanity MCP is the day-to-day editorial automation layer. GitHub Actions remains the safety layer for backups, recovery validation, CI, and schema deployment.

## Current project

- Project: Tatkal Claims
- Project ID: `ah5vm288`
- Editorial dataset: `production`
- Migration evidence dataset: `migration`
- Embedded Studio: `/studio`

## Operating rules for MCP

1. **Read-only by default.** Queries and audits may run without changing content.
2. **Draft-first writes.** Automated article creation or editing should create/update drafts first.
3. **Publishing requires explicit approval.** Do not publish an article merely because a draft validates.
4. **Do not change migrated slugs.** Existing migrated article slugs are URL invariants.
5. **Protected slugs require extra caution:**
   - `claim-rejection-guide`
   - `irdai-30-day-claim-settlement-rule-health-insurance-rights`
   - `mis-selling-guide`
6. **Preserve original publication dates** unless a deliberate editorial decision says otherwise.
7. **No legacy rollback retirement** as part of MCP automation.
8. **No AdSense placement in Sanity body content.** Monetization belongs in Next.js components.
9. **Backups and recovery stay in GitHub Actions.** MCP must not replace the encrypted backup/recovery workflows.

## Schema awareness

The local Studio schema in GitHub is authoritative. When schema changes need to become visible to Sanity MCP, deploy that same repository schema through the **Sanity schema deploy** GitHub Action.

Do not maintain a separate MCP-only schema.

## One-time schema deploy setup

Create a dedicated Sanity project token that is allowed to deploy schema metadata for project `ah5vm288`, then save it in GitHub Actions secrets as:

`SANITY_SCHEMA_DEPLOY_TOKEN`

Never commit or paste the token into chat.

## Schema deploy procedure

In GitHub:

1. Open **Actions**.
2. Select **Sanity schema deploy**.
3. Click **Run workflow** on `main`.
4. Wait for all steps to pass.

The workflow validates the `tatkalClaims` workspace with the current Sanity CLI before deployment, deploys only schema metadata, then lists stored schemas and uploads a non-sensitive verification artifact.

## Planned editorial automation after schema deployment

Once MCP can read the deployed schema, the safe target workflow is:

- research/prepare article content
- create or update a Sanity draft
- populate title, excerpt, body, organization fields, media, SEO metadata, and internal links
- validate required fields and image alt text
- inspect authenticated CMS preview
- confirm public article is unchanged while still a draft
- request explicit publish approval
- publish only after approval
- verify public propagation and SEO metadata

This keeps routine editorial work automated without giving up the existing production safety gates.
