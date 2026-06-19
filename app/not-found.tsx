import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export const metadata = {
  title: "Page Not Found | Tatkal Claims",
  description: "The page you are looking for does not exist. Return to Tatkal Claims homepage.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-12 h-12 text-primary-700" aria-hidden="true" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Sorry, the page you are looking for does not exist or has been moved. 
          Let us help you get back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary inline-flex items-center justify-center gap-2">
            <Home className="w-4 h-4" aria-hidden="true" />
            Back to Home
          </Link>
          <Link href="/blog/" className="btn-secondary inline-flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Knowledge Center
          </Link>
        </div>
      </div>
    </main>
  );
}
