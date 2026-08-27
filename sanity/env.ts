export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-27";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "migration";

// Sanity project IDs are public identifiers; this fallback lets isolated
// preview deployments read the public migration dataset without a secret.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ah5vm288";

export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_DATASET
);
