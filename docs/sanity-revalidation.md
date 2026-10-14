# Tatkal Claims — Sanity to Vercel Revalidation Runbook

## Purpose

Tatkal Claims public article pages are cached with Incremental Static Regeneration (ISR). Normal editorial freshness is event-driven: a published Sanity change sends a signed webhook to the Next.js revalidation endpoint. A 12-hour time-based revalidation interval remains only as a safety fallback.

Do not use Vercel redeployment as a routine way to make Sanity content appear.

## Runtime contract

- Production CMS: Sanity project `ah5vm288`, dataset `production`.
- Public revalidation endpoint: `https://tatkalclaims.com/api/revalidate`.
- Webhook secret environment variable: `SANITY_REVALIDATE_SECRET`.
- Time-based fallback: 12 hours (`43_200` seconds).
- Drafts and Content Release versions must remain excluded from the webhook.
- Public pages remain published-only; authenticated `/cms-preview/` routes remain draft-first and noindex.

## Required Sanity webhook configuration

Name: `Tatkal Claims public revalidation`

URL:

`https://tatkalclaims.com/api/revalidate`

Method: `POST`

Events:
- Create
- Update
- Delete

Drafts: disabled

Versions: disabled

Filter:

`coalesce(after()._type, before()._type) in ["article", "author", "category", "topic"]`

Projection:

```groq
{
  "projectId": sanity::projectId(),
  "dataset": sanity::dataset(),
  "before": before(){
    _id,
    _type,
    "slug": slug.current,
    "authorSlug": author->slug.current,
    "topicTitles": coalesce(topics[]->title, []),
    title
  },
  "after": after(){
    _id,
    _type,
    "slug": slug.current,
    "authorSlug": author->slug.current,
    "topicTitles": coalesce(topics[]->title, []),
    title
  }
}
```

Secret: use the exact same strong secret stored in Vercel as `SANITY_REVALIDATE_SECRET`. Never commit the secret or expose it through a `NEXT_PUBLIC_` variable.

## What each publication invalidates

### Article create/update/delete

The endpoint invalidates:
- the current article route
- the previous article route when a slug changed or an article was unpublished
- homepage
- blog index
- sitemap
- the article's current and previous author archive
- the article's current and previous known topic landing pages
- source article pages that explicitly reference the changed article in `relatedArticles`

The global article-summary cache is refreshed for collection pages, but article-detail pages do not depend on that global cache.

### Author change

The endpoint refreshes:
- the current/previous author route
- public articles directly referencing that author
- collection/sitemap caches that contain projected author data

### Category change

The endpoint refreshes:
- public articles directly referencing that category
- collection/sitemap caches using projected category data

### Topic change

The endpoint refreshes:
- public articles directly referencing that topic
- the matching current/previous code-backed topic landing page when applicable
- collection/sitemap caches using projected topic data

## Normal editorial workflow

1. Create or edit a Sanity draft.
2. Complete editorial/SEO/media QA.
3. Obtain explicit publication approval.
4. Publish in Sanity.
5. Confirm the published Sanity state and no unintended residual draft.
6. Verify the normal public article URL.
7. Verify affected collection pages when relevant.
8. Verify `/sitemap.xml` for new/unpublished/indexability-changing articles.

There is no routine Vercel deployment step after article publication.

## Failure handling

If a published Sanity change is not visible publicly:

1. Confirm the intended Sanity document really published and no newer draft is being confused with the published state.
2. Check the normal public URL and `/sitemap.xml`.
3. Inspect the Sanity webhook attempts log for the public-revalidation webhook.
4. A `2xx` response means Sanity delivered the request successfully.
5. A `401` usually means the webhook secret/signature does not match.
6. A `400` means the payload/project/dataset/document type did not match the endpoint contract.
7. A `500` indicates missing server configuration or a runtime failure; Sanity may retry according to its webhook policy.
8. Correct the webhook/configuration problem and verify the public page again.

**Do not redeploy Vercel merely to clear a CMS cache.**

The 12-hour fallback exists so the site can self-correct even if webhook delivery fails temporarily, but waiting for that fallback is not the normal publishing procedure.

## Slug changes and unpublishing

Routine editorial work should preserve established article slugs.

If an approved slug change occurs, the webhook invalidates both the previous and current route. Cache invalidation does not create an SEO redirect; any indexed slug change still requires a separately reviewed permanent redirect.

Sanity unpublishing fires a delete-style webhook event. The endpoint uses the `before()` snapshot so the old article path, collections, and sitemap can be invalidated even after the published document disappears.

## Security

The endpoint:
- verifies Sanity's signed webhook request
- verifies the expected project and production dataset
- validates slugs before building cache paths
- rejects unsupported document types
- keeps the shared secret server-only

Do not disable signature validation for debugging.

## Monitoring and rollback

After rollout:
- monitor Vercel ISR Write Units for several days
- verify new/updated articles appear promptly without deployments
- verify sitemap freshness after publication and unpublishing
- periodically inspect failed webhook attempts

If the webhook has a production defect, disable the Sanity webhook while diagnosing it. The 12-hour fallback keeps public content recoverable. Revert the infrastructure change only through the normal Git/Vercel approval process.
