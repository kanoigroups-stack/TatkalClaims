import { notFound } from "next/navigation";
import QaComponent from "./QaComponent";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default function QaPage() {
  if (process.env.VERCEL_ENV !== "preview") notFound();
  return <QaComponent />;
}
