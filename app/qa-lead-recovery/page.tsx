import { notFound } from "next/navigation";
import QaComponent from "../__qa-lead-recovery/QaComponent";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

/** TEMPORARY TEST ROUTE — remove after browser QA. */
export default function PreviewOnlyQaPage() {
  if (
    process.env.VERCEL_ENV !== "preview" ||
    process.env.NEXT_PUBLIC_LEAD_VERIFICATION_ENABLED !== "true"
  ) notFound();
  return <QaComponent />;
}
