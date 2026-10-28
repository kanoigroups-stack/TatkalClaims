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
4. **Prepared 28 Oct:** Open the Form-bound Apps Script project at
   https://script.google.com/u/0/home/projects/1CfvhkxcSuy5oWjde43NNn3dIi680Mri5_6hOwYUVwvM5cNxJIQI5svpQ/edit .
   TinyFish reported saving the file `TatkalLeadVerifier.gs` with the draft
   read-only response verifier. **Not executed, OAuth-authorized or deployed;**
   an authorized reviewer must still verify the saved script text and security
   before any execution. This does not trigger response submits or emails.
5. In Apps Script **Project settings > Script properties**, enter a strong
   high-entropy VERIFY_SHARED_SECRET. Never place credentials in source,
   a chat message, a public spreadsheet or a GitHub commit.
6. Deploy an Apps Script **Web app**, Execute as: **Me** (form owner);
   access may need **Anyone** for server-to-server Next.js calls. This grants
   the web app elevated ability to READ responses; review the risk and restrict
   access via the shared secret. The verifier returns only {confirmed:boolean}.
   An OAuth-protected Google Forms API alternative is possible if a publicly
   accessible web app is unsuitable.
7. Securely configure these Vercel variables for the intended environment:
   - NEXT_PUBLIC_LEAD_VERIFICATION_ENABLED=true
   - NEXT_PUBLIC_GOOGLE_FORM_REFERENCE_ENTRY=entry.345237712
   - GOOGLE_FORMS_VERIFY_WEBAPP_URL=https://script.google.com/macros/s/.../exec
   - GOOGLE_FORMS_VERIFY_SHARED_SECRET=<same strong private secret>
   Keep the feature flag unset/false until the form owner has authorized the
   setup and the script/entry ID are verified.
8. Check that the web app response returns confirmed=true only when the exact
   UUID is present in a saved response. Missing or invalid configuration fails
   closed, i.e. NO conversion event.
9. Confirm that the existing Google Forms email notification still reaches
   the owner's usual inbox. Google Forms email delivery is not established
   merely by querying saved responses.
10. Configure GA4's generate_lead event as a key event only after testing,
    and import it to Google Ads with suitable primary/secondary conversion
    settings. Activate Google Ads auto-tagging separately. Keep ads paused
    until financial-services eligibility and billing are resolved.

## Acceptance tests required before production

- With flag OFF, legacy form works as before and NO verified conversion fires.
- With flag ON and Form configured, submit a clearly marked test enquiry once.
  Exactly one saved Form response and the usual notification email must arrive.
- Verify the receipt by exact UUID and check a single GA4 generate_lead event;
  check that the event has no personally identifiable data.
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
- Production analytics quality and email behavior remain UNVERIFIED until the
  checks above have been completed on real authorized test infrastructure.
- The current campaign remains PAUSED, independent of this website PR.
- The optional reference question was added with approval. Apps Script was
  saved but remains undeployed. Live email receipt and conversion tests have
  NOT been performed; they are required before activation.

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
