import { notFound } from "next/navigation";
import CrashTest from "./CrashTest";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

/** TEMPORARY QA — remove immediately after testing. */
export default function PreviewCrashTestPage() {
  if (process.env.VERCEL_ENV !== "preview" ||
      process.env.NEXT_PUBLIC_LEAD_VERIFICATION_ENABLED !== "true") notFound();
  return <CrashTest />;
}
