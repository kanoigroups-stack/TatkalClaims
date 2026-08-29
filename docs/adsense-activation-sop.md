# Tatkal Claims — AdSense Activation SOP

## Current state

Phase 12 installs a controlled AdSense architecture, but ad serving is **disabled by default**.

The public site must not serve AdSense merely because the frontend code exists.

Required runtime gate:

`NEXT_PUBLIC_ADSENSE_ENABLED=true`

Even with that flag enabled, article ads render only when:
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is a valid `ca-pub-...` client ID
- the required article ad-slot IDs are populated
- the Sanity article `monetization` profile is `light` or `standard`

Profiles:
- `none`: no article ad units
- `light`: primary in-article unit only
- `standard`: primary + secondary in-article units

## Non-negotiable activation blockers

Do not enable live AdSense until every blocker below is cleared.

### 1. AdSense site approval

Add `tatkalclaims.com` to the AdSense Sites list and complete ownership verification.

The site must show a Ready/approved state before live ad serving is enabled.

Google guidance:
https://support.google.com/adsense/answer/12169212

### 2. Privacy Policy update

The Phase 12C branch prepares a Privacy Policy disclosure for Google AdSense, non-personalized contextual advertising, cookies/local storage used for frequency capping and reporting, and consent handling.

Do not merge or activate advertising until that legal/privacy wording has been deliberately reviewed.

Google requires publishers to disclose data collection, sharing, and use arising from Google products, including third-party cookies, web beacons, IP addresses, or similar identifiers.

Google guidance:
https://support.google.com/publisherpolicies/answer/10437794

### 3. Non-personalized ads and consent management

Tatkal Claims contains insurance, health-insurance, and financial-dispute content. Google Publisher Policies prohibit using sensitive health information or detailed negative financial status to select or target personalized ads.

For that reason, Tatkal Claims requests non-personalized ads by default for every AdSense page. Non-personalized ads use contextual information and coarse location rather than a visitor's past behavior or interest profile.

Google guidance:
https://support.google.com/publisherpolicies/answer/15101728
https://support.google.com/adsense/answer/9007336
https://support.google.com/adsense/answer/7670312

Non-personalized ads can still use cookies or mobile identifiers for frequency capping, aggregated reporting, and related purposes. Consent may still be required in jurisdictions covered by ePrivacy-style rules.

For EEA, UK, and Switzerland traffic, configure a Google-certified CMP integrated with the IAB TCF where required by Google's publisher consent rules.

Google guidance:
https://support.google.com/adsense/answer/13554116

The Google CMP available through AdSense Privacy & messaging is one possible implementation, but the account configuration must be reviewed before activation.

### 4. ads.txt

Set a valid `NEXT_PUBLIC_ADSENSE_CLIENT_ID`.

The frontend exposes `/ads.txt` from that client ID using the standard Google seller line:

`google.com, pub-..., DIRECT, f08c47fec0942fa0`

The route remains unavailable until a valid client ID is configured.

Google guidance:
https://support.google.com/adsense/answer/12171612

Verify `https://tatkalclaims.com/ads.txt` before enabling ads.

### 5. Ad units

Create two responsive display ad units in AdSense for reporting clarity:

- Tatkal Claims Article Primary
- Tatkal Claims Article Secondary

Save their numeric slot IDs as:

- `NEXT_PUBLIC_ADSENSE_ARTICLE_PRIMARY_SLOT`
- `NEXT_PUBLIC_ADSENSE_ARTICLE_SECONDARY_SLOT`

Do not commit publisher IDs or slot IDs directly into source files. They are public identifiers, but environment configuration keeps deployment and rollback controlled.

## Placement policy

Tatkal Claims uses manual article placements rather than enabling Auto ads by default.

The renderer identifies safe H2 section boundaries approximately around the first and second thirds of sufficiently long articles.

Rules:
- no unit is inserted into very short articles
- placements occur only at H2 section boundaries
- placements avoid nearby inline article CTA blocks
- `light` uses only the primary position
- `standard` uses primary + secondary
- `none` renders no ad
- ads are not inserted into Sanity Portable Text content
- no ad is placed in navigation, the article header, or the conversion CTA
- floating WhatsApp and sticky mobile case-evaluation controls are suppressed while article ads are active to reduce accidental-click risk

Google placement guidance:
https://support.google.com/adsense/answer/1346295

## Auto ads

Do not enable Auto ads or overlay formats as part of Phase 12 activation by default.

Tatkal Claims already has high-interaction UI such as navigation, case-evaluation CTAs, and WhatsApp. Manual in-article placements provide clearer control over accidental-click risk and reading quality.

If Auto ads are evaluated later, treat that as a separate experiment:
- review excluded pages and excluded areas
- keep overlays away from conversion controls
- start with conservative ad load and spacing
- use an AdSense experiment before broad rollout where practical

Google Auto ads guidance:
https://support.google.com/adsense/answer/9305577

## Recommended rollout

Do not bulk-change all 57 migrated articles from `none`.

Start with a small deliberate sample after account approval and privacy/CMP readiness.

Suggested rollout:
1. keep the three protected core articles at `none` initially
2. choose a small set of sufficiently long informational/news articles for `light`
3. verify mobile and desktop layout, Core Web Vitals, CTR anomalies, and user behavior
4. use `standard` only after the light rollout is stable
5. expand article-by-article or by an explicitly approved editorial rule

Sanity profile changes remain editorial writes and must follow the normal draft/publish approval model.

## Preview behavior

Vercel preview deployments intentionally render harmless `standard`-profile placement placeholders.

Preview placeholders:
- do not load the Google AdSense script
- do not make live ad requests
- exist only to inspect spacing and interaction
- suppress floating CTA/WhatsApp controls so the monetized layout can be reviewed accurately

Production does not use the preview override.

## Activation sequence

1. Confirm AdSense account/site approval.
2. Review and approve the Phase 12C Privacy Policy update.
3. Confirm non-personalized ad mode remains enforced in the Tatkal Claims frontend.
4. Configure a certified CMP / Google Privacy & messaging as required.
5. Add the AdSense client ID in deployment environment settings.
6. Verify `/ads.txt`.
7. Create the primary and secondary responsive display units.
8. Add both slot IDs in deployment environment settings.
9. Keep `NEXT_PUBLIC_ADSENSE_ENABLED=false`.
10. Select a small article sample and prepare approved Sanity monetization-profile changes.
11. Verify preview/rendering and policy spacing.
12. Set `NEXT_PUBLIC_ADSENSE_ENABLED=true` only after all preceding gates are complete.
13. Verify live requests include non-personalized privacy treatment, along with layout, consent behavior, and `ads.txt`.

## Emergency rollback

The first-line rollback is:

`NEXT_PUBLIC_ADSENSE_ENABLED=false`

Redeploying with the flag disabled prevents the article AdSense script and units from serving even if Sanity articles remain `light` or `standard`.

If a content-specific issue exists, also return that article's Sanity monetization profile to `none` through the normal draft/publish approval process.
