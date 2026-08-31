# Archived Sanity migration tooling

This directory preserves historical migration tooling and workflow definitions used during the Tatkal Claims CMS migration.

## Status

- Historical evidence only.
- Not part of the supported production execution path.
- Do not run these scripts against the production dataset.
- Current production operations are limited to the retained application safety gate, production backup, recovery validation, schema deployment, and IndexNow workflows.
- Migration payloads and parity reports remain under `migration/` as immutable migration evidence.

Archived files are intentionally kept outside `.github/workflows/` and `scripts/` so they cannot be triggered accidentally by normal GitHub Actions or day-to-day maintenance.
