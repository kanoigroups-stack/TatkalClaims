import { readFile } from "node:fs/promises";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const workflow = await readFile(
    ".github/workflows/sanity-schema-deploy.yml",
    "utf8"
  );

  assert(
    workflow.includes("workflow_dispatch:"),
    "Schema deploy must remain manually triggerable"
  );

  assert(
    workflow.includes("permissions:") &&
      workflow.includes("contents: read"),
    "Schema deploy GitHub permissions must stay read-only"
  );

  assert(
    workflow.includes(
      "SANITY_AUTH_TOKEN: ${{ secrets.SANITY_SCHEMA_DEPLOY_TOKEN }}"
    ),
    "Schema deploy must use the dedicated SANITY_SCHEMA_DEPLOY_TOKEN secret"
  );

  assert(
    workflow.includes("NEXT_PUBLIC_SANITY_PROJECT_ID: ah5vm288") &&
      workflow.includes("NEXT_PUBLIC_SANITY_DATASET: production"),
    "Schema deploy must stay pinned to Tatkal Claims production"
  );

  assert(
    workflow.includes("node-version: 22.12"),
    "Current Sanity CLI schema commands require Node 22.12+"
  );

  const validateIndex = workflow.indexOf(
    "npx --no-install sanity schemas validate --workspace tatkalClaims --level error"
  );
  const deployIndex = workflow.indexOf(
    "npx --no-install sanity schemas deploy --workspace tatkalClaims --verbose"
  );

  assert(
    validateIndex >= 0 && deployIndex > validateIndex,
    "Schema validation must run before schema deployment"
  );

  assert(
    workflow.includes("npx --no-install sanity schemas list --json") &&
      workflow.includes("schema-deploy-verification.json"),
    "Schema deploy must verify stored schemas after deployment"
  );

  assert(
    !workflow.includes("dataset import") &&
      !workflow.includes("documents create") &&
      !workflow.includes("documents delete"),
    "Schema deploy workflow must not contain content mutation commands"
  );

  console.log(
    "Sanity schema deploy workflow is production-pinned, validation-first, content-safe, and manually gated."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
