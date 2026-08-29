import { readFile } from "node:fs/promises";
import { getArticleAdBoundaries } from "../lib/adsense/article-placement";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const [
    envExample,
    config,
    articleRoute,
    renderer,
    provider,
    articleAd,
    adsTxtRoute,
    articleSchema,
    portableTextSchema,
    stickyCta,
    whatsapp,
    globals,
    privacyPolicy,
    activationSop,
  ] = await Promise.all([
    readFile(".env.example", "utf8"),
    readFile("lib/adsense/config.ts", "utf8"),
    readFile("app/blog/[slug]/page.tsx", "utf8"),
    readFile("components/blog/PortableArticleBody.tsx", "utf8"),
    readFile("components/ads/ArticleMonetizationProvider.tsx", "utf8"),
    readFile("components/ads/ArticleAd.tsx", "utf8"),
    readFile("app/ads.txt/route.ts", "utf8"),
    readFile("sanity/schemaTypes/documents/article.ts", "utf8"),
    readFile("sanity/schemaTypes/objects/portableText.ts", "utf8"),
    readFile("components/floating/StickyMobileCTA.tsx", "utf8"),
    readFile("components/floating/WhatsAppFloat.tsx", "utf8"),
    readFile("app/globals.css", "utf8"),
    readFile("app/privacy-policy/page.tsx", "utf8"),
    readFile("docs/adsense-activation-sop.md", "utf8"),
  ]);

  for (const setting of [
    "NEXT_PUBLIC_ADSENSE_ENABLED=false",
    "NEXT_PUBLIC_ADSENSE_CLIENT_ID=",
    "NEXT_PUBLIC_ADSENSE_ARTICLE_PRIMARY_SLOT=",
    "NEXT_PUBLIC_ADSENSE_ARTICLE_SECONDARY_SLOT=",
  ]) {
    assert(envExample.includes(setting), "Missing AdSense env safeguard: " + setting);
  }

  assert(
    config.includes('NEXT_PUBLIC_ADSENSE_ENABLED') &&
      config.includes('toLowerCase() === "true"') &&
      config.includes("/^ca-pub-\\d+$/") &&
      config.includes("canServeArticleAds"),
    "AdSense config is no longer explicitly gated by enable flag and valid client"
  );

  assert(
    articleSchema.includes('{ title: "None", value: "none" }') &&
      articleSchema.includes('{ title: "Light", value: "light" }') &&
      articleSchema.includes('{ title: "Standard", value: "standard" }'),
    "Sanity article monetization profiles changed unexpectedly"
  );

  assert(
    !portableTextSchema.includes("adsbygoogle") &&
      !portableTextSchema.includes("googlesyndication"),
    "AdSense code must not be embedded into Sanity Portable Text schema"
  );

  assert(
    articleRoute.includes("ArticleMonetizationProvider") &&
      articleRoute.includes("AdSenseScript") &&
      articleRoute.includes("<PortableArticleBody value={post.body} />") &&
      articleRoute.includes('process.env.VERCEL_ENV === "preview" ? "standard" : undefined'),
    "Article route must preserve direct Portable Text rendering and preview-only ad simulation"
  );

  assert(
    renderer.includes('ArticleAd position="primary"') &&
      renderer.includes('ArticleAd position="secondary"') &&
      renderer.includes("getArticleAdBoundaries"),
    "Portable Article renderer no longer uses controlled Phase 12 ad boundaries"
  );

  assert(
    provider.includes("document.body.dataset.articleAdsActive") &&
      articleAd.includes("canServeArticleAds") &&
      articleAd.includes("Ad placement preview") &&
      articleAd.includes("data-ad-slot"),
    "Article ad provider/unit safeguards are incomplete"
  );

  assert(
    adsTxtRoute.includes("getAdsTxtLine") &&
      adsTxtRoute.includes('status: 404') &&
      config.includes("google.com, ${publisherId}, DIRECT, f08c47fec0942fa0"),
    "ads.txt must stay unavailable until a valid publisher/client ID is configured"
  );

  assert(
    stickyCta.includes("tc-sticky-mobile-cta") &&
      whatsapp.includes("tc-whatsapp-float") &&
      globals.includes('body[data-article-ads-active="true"] .tc-sticky-mobile-cta') &&
      globals.includes('body[data-article-ads-active="true"] .tc-whatsapp-float'),
    "Interactive floating controls are no longer isolated from active article ads"
  );

  assert(
    privacyPolicy.includes("We do not use cookies for targeted advertising") &&
      activationSop.includes("must be deliberately reviewed and revised before personalized AdSense is enabled") &&
      activationSop.includes("Google-certified CMP") &&
      activationSop.includes("NEXT_PUBLIC_ADSENSE_ENABLED=false"),
    "Activation SOP must keep privacy/CMP review and disabled rollback explicit"
  );

  const syntheticBody = Array.from({ length: 48 }, (_, index) => ({
    _type: "block",
    style: [8, 14, 22, 30, 38, 43].includes(index) ? "h2" : "normal",
  }));
  const boundaries = getArticleAdBoundaries(syntheticBody);

  assert(boundaries.primary !== null, "Primary article ad boundary was not found");
  assert(boundaries.secondary !== null, "Secondary article ad boundary was not found");
  assert(
    boundaries.primary! < boundaries.secondary!,
    "Article ad boundaries are out of order"
  );
  assert(
    boundaries.secondary! - boundaries.primary! >= 8,
    "Article ad boundaries are too close together"
  );

  const shortBody = Array.from({ length: 12 }, () => ({
    _type: "block",
    style: "normal",
  }));
  const shortBoundaries = getArticleAdBoundaries(shortBody);
  assert(
    shortBoundaries.primary === null && shortBoundaries.secondary === null,
    "Short articles must not receive automatic article ad boundaries"
  );

  console.log(
    JSON.stringify(
      {
        phase: "12",
        mode: "adsense-disabled-by-default-architecture",
        profiles: ["none", "light", "standard"],
        previewPlaceholders: true,
        adsTxt: "requires valid client ID",
        activation: "privacy/CMP/site approval/slots required",
        syntheticBoundaries: boundaries,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
