/**
 * TatkalClaims: manual read-only functional verification (Apps Script).
 *
 * Paste into a NEW file such as TatkalLeadSmokeTest.gs in the existing
 * Google Form-bound Apps Script project. Keep the verified Code.gs untouched.
 *
 * Select tcReadOnlyLeadVerificationSmokeTest from the function dropdown and
 * run ONCE. It reads existing responses; it does NOT send a new enquiry,
 * create a new Form, send mail, deploy a web app, or change lead data.
 *
 * SECURITY: Does not print the secret, reference, respondent information, or
 * any Form answers. If a shared secret already exists, it remains unchanged.
 * If no secret exists, the function creates a TEMPORARY random one, tests,
 * then removes it in finally (even if a test throws).
 *
 * REQUIREMENTS: The prior QA enquiry with UUID below must still be within
 * the 48-hour lookback window of the verified doPost implementation.
 * If the known-reference test fails after 48 hours, do NOT interpret that
 * as proof the verifier is faulty or resubmit a customer's enquiry.
 */
function tcReadOnlyLeadVerificationSmokeTest() {
  const props = PropertiesService.getScriptProperties();
  const previousSecret = props.getProperty("VERIFY_SHARED_SECRET");
  const temporary = !previousSecret;
  const secret = previousSecret ||
    (Utilities.getUuid() + "-" + Utilities.getUuid() + "-" + Utilities.getUuid());

  if (temporary) props.setProperty("VERIFY_SHARED_SECRET", secret);

  try {
    function isConfirmed(reference, presentedSecret) {
      const response = doPost({
        postData: {
          contents: JSON.stringify({
            reference: reference,
            secret: presentedSecret,
          }),
        },
      });
      const parsed = JSON.parse(response.getContent());
      return parsed !== null && parsed.confirmed === true;
    }

    const known = isConfirmed(
      "f315728c-2a5d-4d29-ae33-1c0a8e721e41",
      secret
    );
    const unknown = isConfirmed(
      "f315728c-2a5d-4d29-ae33-1c0a8e721e42",
      secret
    );
    const wrongSecret = isConfirmed(
      "f315728c-2a5d-4d29-ae33-1c0a8e721e41",
      secret + "_invalid"
    );

    const results = {
      knownSavedReferenceConfirmed: known,
      unknownReferenceRejected: !unknown,
      wrongSecretRejected: !wrongSecret,
    };
    // Output ONLY booleans. No personal data or authentication secrets.
    console.log("TC_READ_ONLY_SMOKE_TEST " + JSON.stringify(results));

    if (!known || unknown || wrongSecret) {
      throw new Error(
        "TC_READ_ONLY_SMOKE_TEST_FAILED: review boolean results; do not deploy"
      );
    }
  } finally {
    // Restore script properties to exactly their prior state.
    if (temporary) props.deleteProperty("VERIFY_SHARED_SECRET");
  }
}
