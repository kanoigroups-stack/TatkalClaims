export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-27";

export const productionDataset = "production";
export const migrationDataset = "migration";

// CLI/test tooling may override NEXT_PUBLIC_SANITY_DATASET. Public content and
// the embedded Studio intentionally use productionDataset directly.
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || productionDataset;

// Sanity project IDs and dataset names are public identifiers, not secrets.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ah5vm288";

export const isSanityConfigured = Boolean(
  projectId &&
    projectId !== "tc000000" &&
    productionDataset
);
