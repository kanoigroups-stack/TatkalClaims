# Archived Sanity migration tooling

This directory preserves the completed Sanity migration-era workflows and tooling as historical evidence. These files are **not active operational code** and must not be executed from this archive in normal application or CMS operations.

Archived from the repository state at `ec892c1796ed1965062511147dc409800ac7df4e` after the Sanity-only production cutover and subsequent stabilization.

## Archived workflows

- `workflows/sanity-content-adapter.yml`
- `workflows/sanity-migration-dry-run.yml`
- `workflows/sanity-migration-import.yml`
- `workflows/sanity-phase7-production-promotion.yml`
- `workflows/sanity-public-id-dry-run.yml`
- `workflows/sanity-public-id-repair.yml`

## Archived tooling

- `tooling/prepare-sanity-migration.ts`
- `tooling/import-sanity-migration.ts`
- `tooling/promote-sanity-production.ts`
- `tooling/repair-sanity-public-ids.ts`
- `tooling/verify-sanity-migration.ts`
- `tooling/verify-sanity-content-adapter.ts`

The original migration payloads, reports, baselines, and recovery evidence under `migration/` are intentionally preserved. No migration evidence is deleted by this archive step.

Archived TypeScript is excluded from the active TypeScript project because its historical relative imports reflect its original `scripts/` location. This preserves the source exactly without allowing retired tooling to affect current application type-checks.

Any future restoration or execution of these historical tools should be treated as a separate reviewed recovery/migration action rather than running files directly from `archive/`.
