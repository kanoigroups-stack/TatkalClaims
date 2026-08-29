"use client";

import { useEffect, useRef } from "react";
import {
  adsenseConfig,
  canServeArticleAds,
} from "@/lib/adsense/config";
import { useArticleMonetization } from "./ArticleMonetizationProvider";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function ArticleAd({
  position,
}: {
  position: "primary" | "secondary";
}) {
  const { profile, preview } = useArticleMonetization();
  const initialized = useRef(false);

  const allowedByProfile =
    profile === "standard" || (profile === "light" && position === "primary");
  const slot =
    position === "primary"
      ? adsenseConfig.slots.articlePrimary
      : adsenseConfig.slots.articleSecondary;
  const canServe =
    allowedByProfile &&
    !preview &&
    canServeArticleAds(profile) &&
    Boolean(slot);

  useEffect(() => {
    if (!canServe || initialized.current) return;

    let attempts = 0;
    let timer: number | undefined;

    const initialize = () => {
      if (initialized.current) return;

      if (Array.isArray(window.adsbygoogle)) {
        try {
          window.adsbygoogle.push({});
          initialized.current = true;
          return;
        } catch {
          // AdSense may retry naturally on a later render/navigation.
        }
      }

      attempts += 1;
      if (attempts < 20) {
        timer = window.setTimeout(initialize, 250);
      }
    };

    initialize();

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [canServe]);

  if (!allowedByProfile) return null;

  if (preview) {
    return (
      <aside
        className="my-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center md:my-12"
        aria-label={"Ad placement preview " + position}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Ad placement preview
        </p>
        <p className="mt-2 text-sm text-slate-600">
          {position === "primary"
            ? "Light and Standard profiles"
            : "Standard profile only"}
        </p>
      </aside>
    );
  }

  if (!canServe) return null;

  return (
    <aside
      className="my-10 min-h-[90px] md:my-12"
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseConfig.clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
