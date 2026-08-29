import Script from "next/script";
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
  if (preview || !canServeArticleAds(profile)) return null;

  return (
    <Script
      id="google-adsense"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
        adsenseConfig.clientId
      }
    />
  );
}
