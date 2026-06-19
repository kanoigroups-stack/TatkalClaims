"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-12 h-12 text-red-600" aria-hidden="true" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Something Went Wrong</h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          We apologize for the inconvenience. An unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={reset} 
            className="btn-primary inline-flex items-center justify-center gap-2"
            aria-label="Try loading the page again"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>
          <Link href="/" className="btn-secondary inline-flex items-center justify-center gap-2">
            <Home className="w-4 h-4" aria-hidden="true" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
