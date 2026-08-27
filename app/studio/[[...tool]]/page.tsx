"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="fixed inset-0 z-[100] flex items-center justify-center bg-white p-6">
        <div className="max-w-xl rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Sanity Studio is not configured yet
          </h1>
          <p className="mt-3 leading-relaxed text-slate-600">
            Add NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET
            to the deployment environment before using the Studio.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white">
      <NextStudio config={config} />
    </div>
  );
}
