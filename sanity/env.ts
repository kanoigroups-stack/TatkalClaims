export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-27";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "migration";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "tc000000";

export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_DATASET
);
