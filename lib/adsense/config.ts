export type ArticleMonetizationProfile = "none" | "light" | "standard";

function normalize(value: string | undefined) {
  return value?.trim() || "";
}

function isValidClientId(value: string) {
  return /^ca-pub-\d+$/.test(value);
}

function isValidSlotId(value: string) {
  return /^\d+$/.test(value);
}

const clientId = normalize(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID);
const primarySlot = normalize(
  process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_PRIMARY_SLOT
);
const secondarySlot = normalize(
  process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SECONDARY_SLOT
);
const enabledFlag =
  normalize(process.env.NEXT_PUBLIC_ADSENSE_ENABLED).toLowerCase() === "true";

export const adsenseConfig = {
  enabled: enabledFlag && isValidClientId(clientId),
  clientId,
  slots: {
    articlePrimary: primarySlot,
    articleSecondary: secondarySlot,
  },
} as const;

export function canServeArticleAds(profile: ArticleMonetizationProfile) {
  if (!adsenseConfig.enabled || profile === "none") return false;

  if (profile === "light") {
    return isValidSlotId(adsenseConfig.slots.articlePrimary);
  }

  return (
    isValidSlotId(adsenseConfig.slots.articlePrimary) &&
    isValidSlotId(adsenseConfig.slots.articleSecondary)
  );
}

export function getAdsTxtLine() {
  if (!isValidClientId(clientId)) return null;

  const publisherId = clientId.replace(/^ca-/, "");
  return `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`;
}
