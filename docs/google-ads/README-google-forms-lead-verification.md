# Google Forms saved-response confirmation for paid lead tracking

**Status: draft only. Feature disabled by default. Do NOT enable, merge or deploy without explicit approval.**

## Goal and important limits

Preserve the **existing Google Form submission and existing email notifications**.
The current browser POST uses no-cors, so the browser cannot reliably distinguish
accepted responses from rejected ones. That request must not itself trigger
a paid lead conversion.

This draft adds a **separate read-only receipt lookup** using a random, non-personal
reference submitted as an additional optional answer. Only a matching saved
Google Forms response can trigger GA4's generate_lead event.

This does NOT guarantee that the owner saw the email notification. The actual
notification must be checked separately in end-to-end testing. It is also not a
server-wide exactly-once conversion ledger: browser localStorage provides
best-effort deduplication. It does not yet configure a Google Ads conversion
action or import the GA4 event into Ads.

## What this PR changes

- Adds opt-in tracking logic to the existing LeadCaptureForm component.
- Keeps legacy Google Forms submission behavior identical while the flag is off.
- Generates a random UUID per attempted enquiry when enabled.
- Posts the UUID alongside the same existing Google Forms answers.
- Polls a same-origin Next.js API endpoint that asks the form-owner-authorized
  Apps Script to search **saved** responses for the exact UUID.
- Reports a GA4 generate_lead event only after a verified match, with NO name,
  email, phone, message, medical information or reference included in analytics.
- On unavailable/unconfirmed lookup, clearly shows an uncertain state instead
  of claiming success or resubmitting potentially duplicated details.
- No Vercel settings, Google Forms questions, owner emails, Google Ads settings,
  secrets, or production traffic were changed by creating this draft.

## Verified existing Google Form metadata (28 October 2026)

- Editor: https://docs.google.com/forms/d/1iQBlYHV5KfnHpPU6iHgN4_CQpjrXGXcMarXnH-RekNM/edit
- Public respondent URL: https://docs.google.com/forms/d/e/1FAIpQLSf4V-9TMQUR6GqYWjYRu4o3yScg1yQ7ceku-vNr7jjubpLtlw/viewform
- Optional short-answer question **Tatkal Lead Reference (system)**: added with Required=OFF and verified to exist once.
- Verified public form field ID from the Google Forms pre-filled-link UI: **entry.345237712**.
- Existing questions (Name, Email, Phone, Issue Type, Message) and notification settings were not edited.
- Setting up the field alone **does not** enable website verification; the flag remains OFF.

## Owner-assisted setup required BEFORE activation

1. **Completed 28 Oct:** owner approved the optional reference field in the EXISTING Google Form. The
   published /forms/d/e/.../viewform URL is NOT the form editor URL.
2. **Completed 28 Oct:** exactly one **optional** short-answer item added, named:
   Tatkal Lead Reference (system)
   This item is visible when someone visits the Google Form directly (Google
   Forms cannot make ordinary questions hidden); it is not shown in the
   TatkalClaims website form. Verify the change does not break existing users.
   Do not make it required: older/direct submissions must continue to work.
3. **Completed 28 Oct:** Google Forms **Get pre-filled link** confirmed **entry.345237712**. Do not replace it with a guessed field ID.
4. **Verified 30 Oct:** The owner manually saved the complete verifier to
   `Code.gs` in the Form-bound Apps Script project:
   https://script.google.com/u/0/home/projects/1CfvhkxcSuy5oWjde43NNn3dIi680Mri5_6hOwYUVwvM5cNxJIQI5svpQ/edit .
   Targeted in-editor inspection confirmed response lookup and exact reference
   comparison. The owner ran the separate read-only smoke test once and
   observed all three boolean checks PASS in the Apps Script execution log.
   The verifier is **not deployed as a web app**; the passing internal test
   does not imply a working external website connection.
5. In Apps Script **Project settings > Script properties**, enter a strong
   high-entropy VERIFY_SHARED_SECRET. Never place credentials in source,
   a chat message, a public spreadsheet or a GitHub commit.
6. **Requires explicit separate owner approval, not yet performed.** Deploy
   an Apps Script **Web app**, Execute as: **Me** (form owner). Calls from an
   unauthenticated Vercel server typically require web-app access **Anyone**
   (including anonymous visitors, not merely signed-in Google users). This is a
   **publicly reachable endpoint executing with the Form owner's privileges**.
   Even though it returns only `{confirmed:boolean}`, and validates a strong
   server-only shared secret, the web app is not network-private. Obtain
   informed approval for this specific Google access setting before clicking
   Deploy. If unacceptable, choose a restricted OAuth-based Google Forms API
   integration instead; that path needs different credentials and development.
7. Securely configure these Vercel variables for the intended environment:
   - NEXT_PUBLIC_LEAD_VERIFICATION_ENABLED=true
   - NEXT_PUBLIC_GOOGLE_FORM_REFERENCE_ENTRY=entry.345237712
   - GOOGLE_FORMS_VERIFY_WEBAPP_URL=https://script.google.com/macros/s/.../exec
   - GOOGLE_FORMS_VERIFY_SHARED_SECRET=<same strong private secret>
   Scope all **four** variables to the Preview environment and **only** the
   Git branch `draft/google-forms-verified-lead-tracking-20261021` for QA.
   Do not add them to Production, Development, or all-preview branches.
   An environment-variable change affects only **new deployments**.
   Keep the flag unset/false until explicit deployment/access approval and
   the endpoint/security review are complete.
8. Check that the web app response returns confirmed=true only when the exact
   UUID is present in a saved response. Missing or invalid configuration fails
   closed, i.e. NO conversion event.
9. **Verified 29 Oct:** One synthetic QA submission was saved in the
   existing Form and its owner-notification email was found in Gmail; the email
   links to the exact editor Form ID. This is distinct from the verification
   of the Apps Script internal lookup.
10. Configure GA4's generate_lead event as a key event only after testing,
    and import it to Google Ads with suitable primary/secondary conversion
    settings. Activate Google Ads auto-tagging separately. Keep ads paused
    until financial-services eligibility and billing are resolved.

## Acceptance tests required before production

- With flag OFF, legacy form works as before and NO verified conversion fires.
- With flag ON and Form configured, submit a clearly marked test enquiry once.
  Exactly one saved Form response and the usual notification email must arrive.
- Verify the receipt by exact UUID in the preview. **Preview intentionally
  suppresses GA4 `generate_lead`** to avoid contaminating real lead conversions.
  Test the event gating with a mock `window.gtag`, ensuring the event only
  fires with both a verified response and the live production hostname.
  Check that no PII or claim content reaches analytics. Only test the actual
  production GA4 event after separate production approval.
- Test the optional Other issue-type option and its free-text answer.
- Temporarily break the verifier, use an unknown UUID, and simulate timeouts.
  The website must show "could not confirm", NOT a thank-you or conversion.
- Press "Check submission again": this must NOT submit a second response and
  must not report a duplicate conversion in the same browser.
- Test direct Form submissions that have no reference; their normal email
  notifications must continue.
- Verify the original contact phone and paid-ads landing-page disclosures.

## Notes on limitations

- Google Forms formResponse is an opaque browser submission. This cannot be
  fixed by simply reading the no-cors POST result.
- The UUID/reference item must be added to the actual destination Form.
  Without owner access it is impossible to confirm a specific saved response
  using the proposed implementation. Do not activate the flag without it.
- The lookup searches recent responses (48 hours) and does not save or
  modify them. Very delayed responses need manual reconciliation.
- A partial network failure may mean that an enquiry was saved despite an
  unconfirmed UI result. Never automatically POST the same data again.
- **Internal verifier and owner notification passed** as of 30 October 2026.
  **Public endpoint, Vercel preview, and GA4 client event remain UNVERIFIED.**
  Do not equate the internal smoke test with an end-to-end website integration.
- The current campaign remains PAUSED, independent of this website PR.
- The optional reference question was added with approval. The Apps Script
  source was manually saved; its internal read-only three-case smoke test passed
  and Form email notification was verified. **External end-to-end verification
  and actual GA4 event delivery have NOT been tested**; Script is undeployed.

## Documentation

Google Forms Apps Script Form.getResponses(timestamp):
https://developers.google.com/apps-script/reference/forms/form#getresponsestimestamp

Apps Script web apps and security options:
https://developers.google.com/apps-script/guides/web

Google Forms API alternative:
https://developers.google.com/workspace/forms/api/reference/rest/v1/forms.responses/list

## Deployment separation

The Google Form's optional reference field was edited on 28 Oct with owner approval.
The Next.js production code, Google Ads settings, and live submission workflow
have **not** been changed. The Google Apps Script verifier must still receive
explicit credential review and a separate deployment/enable approval; do not
interpret a successful Vercel preview build as proof of real lead verification.


## Live QA record, confirmed 30 October 2026

Owner-visible Apps Script execution log from `tcReadOnlyLeadVerificationSmokeTest`:

| Condition | Observed |
|---|---|
| Existing saved QA UUID | `knownSavedReferenceConfirmed: true` |
| Nonexistent UUID rejected | `unknownReferenceRejected: true` |
| Incorrect private key rejected | `wrongSecretRejected: true` |
| Execution | Completed without error |

The existing QA Form response was saved 29 October 2026 and Form notification
delivered to the connected inbox. **Do not reuse its UUID indefinitely:** the
lookup checks the previous 48 hours. A new preview-specific test should use a
clearly labelled synthetic record after endpoint approval. Never re-post an
existing customer enquiry because receipt verification is uncertain.

## Preview-only readiness review (30 October 2026)

Project: Vercel `tatkal-claimsfinal`, non-production branch
`draft/google-forms-verified-lead-tracking-20261021`. Connected Git preview
builds are available. The project currently has **no Google Forms verifier
variables** configured; current Google Apps Script has **no web-app deployment**.
The existing draft is therefore disabled-by-default.

**Security/analytics guardrails before preview activation:**

1. Owner reviews the Google Apps Script web-app access impact, explicitly
   authorizes its execution identity and public access choice, and deploys
   only after that approval. Do not store shared-secret values in the repo,
   chat, preview logs, URLs, or browser JS.
2. Configure the four variables above as **branch-specific Preview only**.
   Secret must be high entropy and only in Apps Script Properties and
   Vercel server runtime. Public `NEXT_PUBLIC_*` values contain only the
   enabled flag and non-secret Google Form field ID.
3. Preview's `generate_lead` dispatch is blocked by an exact production-host
   check in `lib/lead-verification.ts`; preview may test receipt and user
   acknowledgement without polluting the normal production GA4 property.
4. The Vercel verification API now validates the parsed request body's actual
   size even when Content-Length is omitted; failed or unavailable lookups
   return `confirmed:false`. Existing Google Forms browser POST is opaque
   and must never be counted as a success.
5. Confirm an authorized form submission from the preview delivers **one**
   Google Form response and owner email. Test unknown UUID, bad secret,
   unavailable script, and repeat **lookup** (no resubmission).
6. Form owner must specifically approve any eventual production merge and
   production activation; publishing the Google Apps Script endpoint is a
   distinct approval from approving draft preparation.
7. Rate-limiting or WAF protection for the API endpoint is recommended before
   exposing it at scale. Same-origin browser checks alone are not a robust
   defense against scripted clients. Browser-local dedup is not cross-device
   exactly-once conversion enforcement.

References: Google Apps Script web-app access and execution identity:
https://developers.google.com/apps-script/guides/web
Vercel branch-scoped Preview environment variables:
https://vercel.com/docs/environment-variables
