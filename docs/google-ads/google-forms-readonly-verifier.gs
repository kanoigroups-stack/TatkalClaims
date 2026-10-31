/**
 * Draft, read-only Google Forms response verifier.
 *
 * Copy into an Apps Script project BOUND TO THE EXISTING Google Form.
 * Deploy as web app "Execute as: Me" after the Form owner approves setup.
 * It DOES NOT write to the form or send any emails. Existing Google Forms
 * email notifications keep using their existing submission workflow.
 *
 * Add an optional Short Answer Form question with EXACT title:
 *   Tatkal Lead Reference (system)
 *
 * In Apps Script Project Settings > Script properties, set
 * VERIFY_SHARED_SECRET to a long random value. Set the same value only
 * in Vercel's GOOGLE_FORMS_VERIFY_SHARED_SECRET server environment variable.
 * NEVER commit the secret.
 */

const LEAD_REFERENCE_QUESTION_TITLE = "Tatkal Lead Reference (system)";
const REFERENCE_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function jsonReply_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const expectedSecret =
      PropertiesService.getScriptProperties().getProperty("VERIFY_SHARED_SECRET");
    if (!expectedSecret || !e || !e.postData || !e.postData.contents) {
      return jsonReply_({ confirmed: false });
    }

    const request = JSON.parse(e.postData.contents);
    if (
      typeof request.secret !== "string" ||
      request.secret !== expectedSecret ||
      typeof request.reference !== "string" ||
      !REFERENCE_PATTERN.test(request.reference)
    ) {
      return jsonReply_({ confirmed: false });
    }

    const form = FormApp.getActiveForm();
    if (!form) return jsonReply_({ confirmed: false });

    const matchingItems = form.getItems(FormApp.ItemType.TEXT)
      .filter((item) => item.getTitle() === LEAD_REFERENCE_QUESTION_TITLE);
    if (matchingItems.length !== 1) return jsonReply_({ confirmed: false });

    // Query only recent saved responses. Older/uncertain submissions need
    // manual reconciliation, NOT an automatic second submission.
    const since = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const responses = form.getResponses(since);
    const item = matchingItems[0];
    for (let i = responses.length - 1; i >= 0; i--) {
      const saved = responses[i];
      const answer = saved.getResponseForItem(item);
      if (answer && answer.getResponse() === request.reference && saved.getId()) {
        return jsonReply_({ confirmed: true });
      }
    }

    return jsonReply_({ confirmed: false });
  } catch (_error) {
    // Never return form content, respondent data, secret, or stack traces.
    return jsonReply_({ confirmed: false });
  }
}
