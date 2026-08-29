"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  canServeArticleAds,
  type ArticleMonetizationProfile,
} from "@/lib/adsense/config";

type ArticleMonetizationContextValue = {
  profile: ArticleMonetizationProfile;
  preview: boolean;
  adsActive: boolean;
};

const ArticleMonetizationContext =
  createContext<ArticleMonetizationContextValue>({
    profile: "none",
    preview: false,
    adsActive: false,
  });

export default function ArticleMonetizationProvider({
  profile,
  previewProfile,
  children,
}: {
  profile: ArticleMonetizationProfile;
  previewProfile?: ArticleMonetizationProfile;
  children: ReactNode;
}) {
  const value = useMemo(() => {
    const effectiveProfile = previewProfile || profile;
    const preview = Boolean(previewProfile);
    const adsActive =
      effectiveProfile !== "none" &&
      (preview || canServeArticleAds(effectiveProfile));

    return {
      profile: effectiveProfile,
      preview,
      adsActive,
    };
  }, [previewProfile, profile]);

  useEffect(() => {
    if (value.adsActive) {
      document.body.dataset.articleAdsActive = "true";
    } else {
      delete document.body.dataset.articleAdsActive;
    }

    return () => {
      delete document.body.dataset.articleAdsActive;
    };
  }, [value.adsActive]);

  return (
    <ArticleMonetizationContext.Provider value={value}>
      {children}
    </ArticleMonetizationContext.Provider>
  );
}

export function useArticleMonetization() {
  return useContext(ArticleMonetizationContext);
}
