/**
 * Opt-in Google Forms receipt verification.
 *
 * The browser's Google Forms no-cors POST gives no reliable receipt status.
 * A conversion must never be recorded from that POST alone.
 */
export const LEAD_VERIFICATION_ENABLED =
  process.env.NEXT_PUBLIC_LEAD_VERIFICATION_ENABLED === "true" &&
  /^entry\.\d+$/.test(process.env.NEXT_PUBLIC_GOOGLE_FORM_REFERENCE_ENTRY || "");

export const GOOGLE_FORM_REFERENCE_ENTRY =
  process.env.NEXT_PUBLIC_GOOGLE_FORM_REFERENCE_ENTRY || "";

const POLL_DELAYS_MS = [900, 1500, 2500, 4000, 6000];

export function createLeadReference(): string {
  return crypto.randomUUID();
}

export async function verifySavedGoogleFormResponse(reference: string): Promise<boolean> {
  for (const delay of POLL_DELAYS_MS) {
    await new Promise<void>((resolve) => setTimeout(resolve, delay));
    try {
      const response = await fetch("/api/lead-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) continue;
      const data: unknown = await response.json();
      if (
        data !== null &&
        typeof data === "object" &&
        "confirmed" in data &&
        (data as { confirmed: unknown }).confirmed === true
      ) return true;
    } catch {
      // A verifier/network failure is NOT a rejected Form submission.
    }
  }
  return false;
}

/**
 * Only the actual live website may emit verified paid-lead GA4 events.
 * Vercel previews use the same GA4 property for basic site analytics and
 * MUST NOT produce live generate_lead conversions during QA.
 */
export function isLiveLeadConversionHost(hostname: string): boolean {
  return hostname === "tatkalclaims.com" || hostname === "www.tatkalclaims.com";
}

/**
 * GA4 event after confirmed receipt only. Best-effort browser deduplication:
 * a server-wide exactly-once ledger has NOT been configured.
 * No customer names, phones, messages, or claim details enter analytics.
 */
export function recordVerifiedLeadConversion(reference: string): void {
  if (typeof window === "undefined") return;
  // This is intentionally false on .vercel.app and staging hostnames.
  // Use a mocked gtag callback for preview QA; do not contaminate live GA4.
  if (!isLiveLeadConversionHost(window.location.hostname)) return;
  const key = "tc-verified-lead-event:" + reference;
  try {
    if (window.localStorage.getItem(key) === "1") return;
  } catch {
    // Storage may be disabled by the visitor.
  }
  if (typeof window.gtag !== "function") return;
  window.gtag("event", "generate_lead", { method: "google_form_confirmed" });
  try {
    window.localStorage.setItem(key, "1");
  } catch {
    // Successful submission must never depend on browser storage.
  }
}
