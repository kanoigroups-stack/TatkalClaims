"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle, Home, RefreshCw } from "lucide-react";
import {
  getRecoverableLeadReference,
  verifySavedGoogleFormResponse,
  recordVerifiedLeadConversion,
  clearLeadReferenceForRecovery,
} from "@/lib/lead-verification";

type RecoveryStatus = "idle" | "checking" | "confirmed" | "uncertain";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [reference, setReference] = useState<string | null>(null);
  const [recoveryStatus, setRecoveryStatus] = useState<RecoveryStatus>("idle");

  useEffect(() => {
    console.error(error);
    // Do not assume that an app error means a saved Google Form response
    // was rejected. Recover the UUID only; no claimant personal data is stored.
    setReference(getRecoverableLeadReference());
  }, [error]);

  const checkExistingReceipt = async () => {
    if (!reference || recoveryStatus === "checking" || recoveryStatus === "confirmed") return;
    setRecoveryStatus("checking");
    try {
      const confirmed = await verifySavedGoogleFormResponse(reference);
      if (confirmed) {
        // Same verified-only conversion gate as LeadCaptureForm; preview
        // hostnames are excluded from production GA4.
        recordVerifiedLeadConversion(reference);
        clearLeadReferenceForRecovery(reference);
        setRecoveryStatus("confirmed");
      } else {
        setRecoveryStatus("uncertain");
      }
    } catch {
      // A verifier/network error is not proof that Google rejected the form.
      setRecoveryStatus("uncertain");
    }
  };

  if (reference) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-lg bg-white rounded-2xl border border-slate-200 p-7 shadow-sm" role="status" aria-live="polite">
          {recoveryStatus === "confirmed" ? (
            <>
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-5" aria-hidden="true" />
              <h1 className="text-2xl font-bold text-slate-900 mb-3">Your enquiry has been received</h1>
              <p className="text-slate-700 mb-4">
                We verified an existing saved Google Forms response. You do not need to submit your enquiry again.
              </p>
            </>
          ) : (
            <>
              <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-5" aria-hidden="true" />
              <h1 className="text-2xl font-bold text-slate-900 mb-3">We could not display your confirmation</h1>
              <p className="text-slate-700 mb-4">
                Your enquiry may already have reached us. Please do not submit it again, as this could create a duplicate.
              </p>
              <button
                type="button"
                onClick={checkExistingReceipt}
                disabled={recoveryStatus === "checking"}
                className="btn-primary inline-flex items-center justify-center px-5 py-3 disabled:opacity-60 mb-4"
              >
                {recoveryStatus === "checking" ? "Checking saved response..." : "Check existing submission"}
              </button>
              {recoveryStatus === "uncertain" && (
                <p className="text-sm text-amber-800 mb-4">
                  We still cannot confirm the saved response. Do not resubmit automatically; contact us with the reference below.
                </p>
              )}
            </>
          )}
          <p className="text-xs text-slate-600 break-all mb-4">
            Reference: <strong>{reference}</strong>
          </p>
          <p className="text-sm text-slate-700 mb-4">
            Need help? Call <a className="underline text-primary-700" href="tel:+917207382073">+91 7207382073</a>.
          </p>
          <Link href="/" className="text-sm underline text-primary-700">
            Return to homepage without resubmitting
          </Link>
        </div>
      </main>
    );
  }

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
