"use client";

import { useEffect } from "react";
import {
  adsenseConfig,
  canServeArticleAds,
  type ArticleMonetizationProfile,
} from "@/lib/adsense/config";

export default function AdSenseScript({
  profile,
  preview,
}: {
  profile: ArticleMonetizationProfile;
  preview: boolean;
}) {
  const canServe = !preview && canServeArticleAds(profile);

  useEffect(() => {
    if (!canServe) return;

    const adsbygoogle = ((window as any).adsbygoogle =
      (window as any).adsbygoogle || []);

    // Tatkal Claims contains insurance, health-insurance, and financial-dispute
    // content. Request non-personalized ads by default so ad selection does not
    // use a visitor's past behavior or interest profile.
    adsbygoogle.requestNonPersonalizedAds = 1;

    const existing = document.querySelector(
      'script[data-tatkal-adsense="true"]'
    );
    if (existing) return;

    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
      adsenseConfig.clientId;
    script.dataset.tatkalAdsense = "true";
    script.dataset.privacyTreatments = "disablePersonalization";
    document.head.appendChild(script);
  }, [canServe]);

  return null;
}
