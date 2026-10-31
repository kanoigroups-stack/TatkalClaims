"use client";

import { useState } from "react";

/** TEMPORARY QA — no Google Form POST, no analytics, no customer data. */
export default function CrashTest() {
  const [ref, setRef] = useState("");
  const [explode, setExplode] = useState(false);
  const [warning, setWarning] = useState("");
  if (explode) throw new Error("QA ONLY — simulated render error; no lead submitted");

  const run = () => {
    const uuid = ref.trim();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)) {
      setWarning("Please enter the existing saved QA UUID.");
      return;
    }
    try {
      window.sessionStorage.setItem(
        "tc:lead-receipt-recovery",
        JSON.stringify({ reference: uuid, createdAt: Date.now() })
      );
      setExplode(true);
    } catch {
      setWarning("Session storage unavailable. No error simulated.");
    }
  };

  return (
    <main className="p-8 mx-auto max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Preview-only Lead Recovery QA</h1>
      <p className="text-sm mb-4">This test never submits a Google Form.</p>
      <label htmlFor="qa-ref" className="block mb-2">Existing QA reference UUID</label>
      <input
        id="qa-ref" value={ref} onChange={(e) => setRef(e.target.value)}
        className="border rounded p-3 w-full mb-4" autoComplete="off"
      />
      <button type="button" onClick={run} className="btn-primary p-3">
        Simulate error (no lead submitted)
      </button>
      {warning && <p role="alert" className="text-amber-700 mt-4">{warning}</p>}
    </main>
  );
}
