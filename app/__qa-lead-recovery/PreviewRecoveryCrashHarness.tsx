"use client";

import { useState } from "react";

const REFERENCE_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * TEMPORARY QA ONLY — NO GOOGLE FORM SUBMISSION.
 *
 * Clicking "Simulate error" writes ONLY a supplied UUID + current timestamp
 * to the same sessionStorage key that the real form uses. A subsequent
 * React render intentionally throws, exercising app/error.tsx. No lead
 * details, form POST, tracking event, or private key is ever created here.
 */
export default function PreviewRecoveryCrashHarness() {
  const [reference, setReference] = useState("");
  const [armed, setArmed] = useState(false);
  const [message, setMessage] = useState("");

  // A React render error is caught by Next.js app/error.tsx.
  if (armed) throw new Error("QA ONLY: simulated preview client-render crash");

  const simulateError = () => {
    const uuid = reference.trim();
    if (!REFERENCE_PATTERN.test(uuid)) {
      setMessage("Enter a valid UUID for the previously saved QA response.");
      return;
    }
    try {
      window.sessionStorage.setItem(
        "tc:lead-receipt-recovery",
        JSON.stringify({ reference: uuid, createdAt: Date.now() })
      );
      setArmed(true);
    } catch {
      setMessage("Session storage unavailable: test not armed. No response was submitted.");
    }
  };

  return (
    <main className="mx-auto max-w-lg p-8">
      <h1 className="text-2xl font-bold mb-4">Temporary Preview Recovery Test</h1>
      <p className="mb-5 text-sm">QA only. This page never submits a Google Form or creates a lead.</p>
      <label htmlFor="qa-reference" className="block font-medium mb-2">Existing QA reference UUID</label>
      <input
        id="qa-reference"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        className="border rounded p-3 w-full mb-4"
        autoComplete="off"
      />
      <button
        type="button"
        onClick={simulateError}
        className="btn-primary p-3"
      >
        Simulate error (no lead submitted)
      </button>
      {message && <p role="alert" className="mt-4 text-amber-700">{message}</p>}
    </main>
  );
}
