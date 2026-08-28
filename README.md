# Tatkal Claims

India's Most Trusted Insurance Dispute Resolution Platform

## Deploy on Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Add New Project
3. Import your GitHub repo
4. Vercel auto-detects Next.js → Click Deploy

## Content Management

Tatkal Claims articles are managed in **Sanity CMS**, not in a repository JSON file.

- Studio: `https://tatkalclaims.com/studio/`
- Public articles: `/blog/[slug]/`
- Authenticated editorial preview: `/cms-preview/blog/`
- Public content reads the Sanity `production` dataset with 60-second revalidation.
- Drafts must be reviewed through the authenticated preview and are not published automatically.
- Do not change migrated slugs or `legacyOrder` during routine editorial work.
- Do not reintroduce the retired `data/blogs.json` / `BLOG_CONTENT_SOURCE=legacy` runtime.

For MCP-assisted article creation and editing, follow:

- `docs/sanity-article-draft-sop.md`
- `docs/sanity-mcp-automation.md`

## Content Safety

- Publishing requires explicit approval.
- New editorial images should normally be uploaded to Sanity and require alt text.
- Protected migrated URLs and the permanent claim-rejection redirect must remain intact.
- Sanity production backups and recovery validation are documented in `docs/sanity-backup-recovery.md`.

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Sanity CMS
