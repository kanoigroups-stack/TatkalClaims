import { notFound } from "next/navigation";
import PreviewRecoveryCrashHarness from "./PreviewRecoveryCrashHarness";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

/**
 * TEMPORARY QA ONLY — delete this entire directory after recovery tests.
 * This route cannot render in a production deployment. It cannot submit
 * Google Forms; its child only seeds a UUID and intentionally throws.
 */
export default function PreviewRecoveryQaPage() {
  if (
    process.env.VERCEL_ENV !== "preview" ||
    process.env.NEXT_PUBLIC_LEAD_VERIFICATION_ENABLED !== "true"
  ) {
    notFound();
  }
  return <PreviewRecoveryCrashHarness />;
}
