import { readFile } from "node:fs/promises";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const [workflow, runtime] = await Promise.all([
    readFile(".github/workflows/sanity-recovery-validation.yml", "utf8"),
    readFile("scripts/sanity-recovery-validation.ts", "utf8"),
  ]);

  assert(
    workflow.includes("workflow_dispatch:"),
    "Recovery workflow must remain manually triggerable"
  );

  assert(
    workflow.includes("SANITY_AUTH_TOKEN: ${{ secrets.SANITY_RECOVERY_TOKEN }}"),
    "Recovery workflow must use the dedicated temporary recovery token"
  );

  assert(
    workflow.includes("recovery_project_id:") &&
      workflow.includes(
        "SANITY_RECOVERY_PROJECT_ID: ${{ inputs.recovery_project_id }}"
      ) &&
      workflow.includes(
        "NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ inputs.recovery_project_id }}"
      ),
    "Recovery workflow must require a separate recovery Sanity project ID"
  );

  assert(
    workflow.includes(
      "BACKUP_PASSPHRASE: ${{ secrets.SANITY_BACKUP_PASSPHRASE }}"
    ),
    "Recovery workflow must reuse only the backup decryption passphrase"
  );

  assert(
    workflow.includes("actions: read") && workflow.includes("contents: read"),
    "Recovery workflow permissions must stay read-only for GitHub"
  );

  assert(
    workflow.includes("sanity-production-backup.yml/runs?branch=main&status=success&per_page=1"),
    "Recovery workflow must default to the latest successful main backup"
  );

  assert(
    workflow.includes("startswith(\"sanity-production-backup-\")") &&
      workflow.includes(".expired == false"),
    "Recovery workflow must select only unexpired encrypted backup artifacts"
  );

  assert(
    workflow.includes("sha256sum") &&
      workflow.includes("EXPECTED_HASH") &&
      workflow.includes("ACTUAL_HASH"),
    "Recovery workflow must verify encrypted backup integrity before decryption"
  );

  assert(
    workflow.includes("openssl enc -d -aes-256-cbc") &&
      workflow.includes("-pbkdf2") &&
      workflow.includes("-iter 200000"),
    "Recovery workflow decryption settings do not match backup encryption"
  );

  assert(
    workflow.includes(
      'npx sanity dataset import "${{ steps.archive.outputs.plain }}" "$SANITY_RECOVERY_DATASET"'
    ) &&
      !workflow.includes("--replace") &&
      !workflow.includes("--missing"),
    "Recovery import must use create-only semantics in an empty temporary dataset"
  );

  assert(
    runtime.includes('const liveProjectId = "ah5vm288"') &&
      runtime.includes("projectId !== liveProjectId") &&
      runtime.includes(
        "Recovery validation can never target the live Tatkal Claims Sanity project"
      ),
    "Recovery workflow does not fail closed against the live Sanity project"
  );

  assert(
    /^recovery-/.test("recovery-test") &&
      runtime.includes('/^recovery-[a-z0-9][a-z0-9-]{0,63}$/') &&
      runtime.includes('targetDataset !== "production"') &&
      runtime.includes('targetDataset !== "migration"'),
    "Recovery target dataset allowlist is not enforced"
  );

  assert(
    runtime.includes("datasets.some((dataset) => dataset.name === targetDataset)") &&
      runtime.includes('return id.startsWith("_.")') &&
      runtime.includes("existingContent.length === 0") &&
      runtime.includes("Sanity system documents ignored"),
    "Recovery preflight must require zero non-system documents while ignoring only Sanity _. system records"
  );

  assert(
    !runtime.includes(".datasets.create(") &&
      !workflow.includes("dataset create"),
    "Recovery validation must never create datasets automatically"
  );

  assert(
    runtime.includes("restoredContent = restored.filter(") &&
      runtime.includes("!isSystemDocumentId(document._id)") &&
      runtime.includes("sameStrings(expectedNonAssetIds, restoredNonAssetIds)") &&
      runtime.includes(
        "sameStrings(expectedPublishedArticleSlugs, restoredPublishedArticleSlugs)"
      ) &&
      runtime.includes("sameStrings(expectedDraftArticleIds, restoredDraftArticleIds)"),
    "Recovery verification must ignore only Sanity _. system records and compare restored content against the backup itself"
  );

  assert(
    runtime.includes('"claim-rejection-guide"') &&
      runtime.includes(
        '"irdai-30-day-claim-settlement-rule-health-insurance-rights"'
      ) &&
      runtime.includes('"mis-selling-guide"'),
    "Recovery verification lost protected slug checks"
  );

  assert(
    workflow.includes("if: always()") &&
      workflow.includes("run: rm -rf recovery-work"),
    "Recovery workflow must delete decrypted backup files even after failure"
  );

  const uploadSection = workflow.slice(
    workflow.indexOf("- name: Upload recovery verification")
  );

  assert(
    uploadSection.includes("recovery-verification.json") &&
      uploadSection.includes("recovery-manifest.txt") &&
      !uploadSection.includes("restore.tar.gz") &&
      !uploadSection.includes("data.ndjson"),
    "Recovery artifacts must contain only non-sensitive verification output"
  );

  console.log(
    "Sanity recovery workflow is separate-project isolated, create-only, backup-grounded, and fail-closed."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
