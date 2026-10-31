"use client";

import { useState } from "react";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function QaComponent() {
  const [value, setValue] = useState("");
  const [trigger, setTrigger] = useState(false);
  const [warning, setWarning] = useState("");
  if (trigger) throw new Error("Intentional preview-only QA render exception");

  const simulate = () => {
    if (!UUID.test(value.trim())) {
      setWarning("Please enter a valid existing QA UUID.");
      return;
    }
    try {
      window.sessionStorage.setItem(
        "tc:lead-receipt-recovery",
        JSON.stringify({ reference: value.trim(), createdAt: Date.now() })
      );
      setTrigger(true);
    } catch {
      setWarning("Session storage is unavailable.");
    }
  };

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-bold mb-4">Preview recovery QA</h1>
      <p>This is a simulated error test. It does not submit an enquiry.</p>
      <label htmlFor="qa-reference" className="block mt-5">Existing QA reference UUID</label>
      <input id="qa-reference" className="w-full border p-3 mb-4"
        value={value} onChange={(e) => setValue(e.target.value)} />
      <button type="button" className="btn-primary p-3" onClick={simulate}>
        Simulate error (no lead submitted)
      </button>
      {warning && <p role="alert">{warning}</p>}
    </main>
  );
}
