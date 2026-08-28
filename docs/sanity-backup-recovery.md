# Tatkal Claims — Sanity backup and recovery

This procedure is designed so routine backups do not require terminal access.

## What the backup contains

The GitHub Action exports the Sanity `production` dataset for project `ah5vm288`.

The export intentionally includes:

- published documents
- draft documents
- authors, categories, topics, and references
- Sanity image/file assets

The workflow does **not** use `--no-drafts` or `--no-assets`.

## Why the GitHub artifact is encrypted

The repository is public. A raw Sanity export must therefore never be uploaded as a normal GitHub Actions artifact.

Before upload, the workflow encrypts the `.tar.gz` backup using AES-256-CBC with PBKDF2 and then deletes all plaintext backup copies from the runner.

The uploaded artifact contains only:

- the encrypted `.tar.gz.enc` file
- its SHA-256 checksum
- a non-sensitive manifest

## One-time GitHub setup

Two repository Actions secrets are required:

1. `SANITY_BACKUP_TOKEN`
   - a dedicated Sanity project token that can read the production dataset and drafts
   - do not reuse a write/admin token unless there is no safer option
   - never paste the token into chat or commit it to the repository

2. `SANITY_BACKUP_PASSPHRASE`
   - a long unique passphrase used only to encrypt/decrypt backups
   - store it in a password manager
   - never commit it or paste it into chat

## How to create a backup

In GitHub:

1. Open the TatkalClaims repository.
2. Open **Actions**.
3. Select **Sanity production backup**.
4. Click **Run workflow**.
5. Wait for the job to finish successfully.
6. Open the completed run and download the encrypted backup artifact if an offline copy is desired.

No terminal command is required.

## Retention

GitHub is configured to retain each encrypted backup artifact for 90 days, subject to GitHub account/repository retention limits.

A separate offline copy is recommended for long-term retention.

## Recovery safety rule

Never test a restore by importing directly into the live `production` dataset.

Recovery validation must use a separate temporary recovery dataset first. Only after verifying the restored document count, assets, references, drafts, and representative articles should any production recovery be considered.

## Existing website rollback remains separate

This Sanity backup protects CMS content.

The existing `BLOG_CONTENT_SOURCE=legacy` rollback path protects website availability if the Sanity integration fails. Do not remove the legacy rollback stack until the later retirement phase.
