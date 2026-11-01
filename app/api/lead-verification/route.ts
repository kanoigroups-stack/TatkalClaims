import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REFERENCE_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function reply(body: { confirmed: boolean; error?: string }, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

/**
 * Read-only receipt lookup through a Google Apps Script authorized by the
 * existing Google Form owner. Never submits Forms responses or fires analytics.
 * Never returns sensitive respondent data.
 */
export async function POST(request: NextRequest) {
  const deploymentUrl = process.env.GOOGLE_FORMS_VERIFY_WEBAPP_URL;
  const sharedSecret = process.env.GOOGLE_FORMS_VERIFY_SHARED_SECRET;

  if (
    process.env.NEXT_PUBLIC_LEAD_VERIFICATION_ENABLED !== "true" ||
    !/^entry\.\d+$/.test(process.env.NEXT_PUBLIC_GOOGLE_FORM_REFERENCE_ENTRY || "") ||
    !deploymentUrl ||
    !sharedSecret
  ) {
    return reply({ confirmed: false, error: "Verifier not configured" }, 503);
  }

  // Never disclose the shared secret to browsers or accept cross-origin calls.
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return reply({ confirmed: false, error: "Invalid request origin" }, 403);
  }

  let target: URL;
  try {
    target = new URL(deploymentUrl);
  } catch {
    return reply({ confirmed: false, error: "Invalid verifier configuration" }, 503);
  }
  if (
    target.protocol !== "https:" ||
    target.hostname !== "script.google.com" ||
    !/^\/macros\/s\/[^/]+\/exec$/.test(target.pathname)
  ) {
    return reply({ confirmed: false, error: "Invalid verifier configuration" }, 503);
  }

  let body: unknown;
  try {
    // Do not rely solely on Content-Length: chunked POSTs may omit it.
    // A single UUID reference request should be far below 512 bytes.
    if (Number(request.headers.get("content-length") || "0") > 512) {
      return reply({ confirmed: false, error: "Invalid request" }, 400);
    }
    const raw = await request.text();
    if (raw.length > 512) {
      return reply({ confirmed: false, error: "Invalid request" }, 400);
    }
    body = JSON.parse(raw);
  } catch {
    return reply({ confirmed: false, error: "Invalid request" }, 400);
  }

  const reference =
    body && typeof body === "object" && "reference" in body
      ? (body as { reference: unknown }).reference
      : null;
  if (typeof reference !== "string" || !REFERENCE_PATTERN.test(reference)) {
    return reply({ confirmed: false, error: "Invalid reference" }, 400);
  }

  try {
    const result = await fetch(target.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, secret: sharedSecret }),
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(7000),
    });
    if (!result.ok) return reply({ confirmed: false, error: "Verifier unavailable" }, 503);

    const data: unknown = await result.json();
    if (
      !data ||
      typeof data !== "object" ||
      !("confirmed" in data) ||
      typeof (data as { confirmed: unknown }).confirmed !== "boolean"
    ) return reply({ confirmed: false, error: "Invalid verifier response" }, 503);

    return reply({ confirmed: (data as { confirmed: boolean }).confirmed });
  } catch {
    return reply({ confirmed: false, error: "Verifier unavailable" }, 503);
  }
}
