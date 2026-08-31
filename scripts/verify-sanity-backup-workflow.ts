import { readFile } from "node:fs/promises";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const workflow = await readFile(
    ".github/workflows/sanity-production-backup.yml",
    "utf8"
  );

  assert(
    workflow.includes("workflow_dispatch:"),
    "Backup workflow must remain manually triggerable"
  );

  assert(
    workflow.includes("SANITY_AUTH_TOKEN: ${{ secrets.SANITY_BACKUP_TOKEN }}"),
    "Backup workflow is not using the dedicated Sanity backup token secret"
  );

  assert(
    workflow.includes(
      "BACKUP_PASSPHRASE: ${{ secrets.SANITY_BACKUP_PASSPHRASE }}"
    ),
    "Backup workflow is not using the dedicated encryption passphrase secret"
  );

  assert(
    workflow.includes("SANITY_PROJECT_ID: ah5vm288") &&
      workflow.includes("SANITY_DATASET: production") &&
      workflow.includes("NEXT_PUBLIC_SANITY_PROJECT_ID: ah5vm288") &&
      workflow.includes("NEXT_PUBLIC_SANITY_DATASET: production"),
    "Backup workflow is not pinned to the Tatkal Claims production dataset"
  );

  assert(
    workflow.includes('npx --no-install sanity dataset export "$SANITY_DATASET" "$PLAIN" --overwrite'),
    "Backup workflow does not use the repo-pinned Sanity v3 export command"
  );

  assert(
    !workflow.includes("--no-drafts") && !workflow.includes("--no-assets"),
    "Backup workflow must include drafts and assets"
  );

  assert(
    workflow.includes("openssl enc -aes-256-cbc") &&
      workflow.includes("-pbkdf2") &&
      workflow.includes("-iter 200000"),
    "Backup artifact is not encrypted with the expected settings"
  );

  assert(
    workflow.includes('rm -f "$PLAIN" "$VERIFY" backup/archive-entries.txt'),
    "Plaintext backup is not deleted before artifact upload"
  );

  const uploadSection = workflow.slice(
    workflow.indexOf("- name: Upload encrypted backup artifact")
  );

  assert(
    uploadSection.includes("${{ steps.export.outputs.encrypted }}") &&
      !uploadSection.includes("${{ steps.export.outputs.plain }}"),
    "Artifact upload must contain only encrypted backup bytes"
  );

  assert(
    workflow.includes("retention-days: 90"),
    "Encrypted backup artifact retention is not set to 90 days"
  );

  console.log(
    "Sanity production backup workflow is manual, encrypted, draft+asset complete, and production-pinned."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
