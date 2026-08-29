import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function exists(path: string) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const [
    articleSchema,
    articleSop,
    sitemap,
    middleware,
    previewIndex,
    previewArticle,
    schemaDeployWorkflow,
  ] = await Promise.all([
    readFile("sanity/schemaTypes/documents/article.ts", "utf8"),
    readFile("docs/sanity-article-draft-sop.md", "utf8"),
    readFile("app/sitemap.ts", "utf8"),
    readFile("middleware.ts", "utf8"),
    readFile("app/cms-preview/blog/page.tsx", "utf8"),
    readFile("app/cms-preview/blog/[slug]/page.tsx", "utf8"),
    readFile(".github/workflows/sanity-schema-deploy.yml", "utf8"),
  ]);

  assert(
    !(await exists("app/cms-staging/blog/page.tsx")) &&
      !(await exists("app/cms-staging/blog/[slug]/page.tsx")),
    "Superseded cms-staging runtime routes must remain retired"
  );

  assert(
    await exists("migration/phase6/staging-parity-report.json"),
    "Phase 6 staging parity evidence must remain preserved"
  );

  assert(
    middleware.includes('matcher: ["/cms-preview/:path*"]') &&
      previewIndex.includes("getPreviewSanityPosts") &&
      previewArticle.includes("getPreviewSanityPostBySlug"),
    "Authenticated cms-preview must remain the editorial preview path"
  );

  assert(
    articleSchema.includes('initialValue: "none"') &&
      articleSop.includes("New article default in schema is `none`") &&
      articleSop.includes("changing monetization from `none`"),
    "New articles must default to non-monetized and require approval before monetization"
  );

  assert(
    !sitemap.includes("lastModified: new Date(),") &&
      sitemap.includes("new Date(post.updatedAt || post.date)"),
    "Sitemap must avoid synthetic freshness and use substantive article updatedAt when present"
  );

  assert(
    schemaDeployWorkflow.includes("SANITY_SCHEMA_DEPLOY_TOKEN") &&
      schemaDeployWorkflow.includes("SANITY_AUTH_TOKEN:"),
    "Schema deploy token must remain configured while the manual schema deploy workflow depends on it"
  );

  console.log(JSON.stringify({
    phase: "13B",
    cmsStaging: "retired",
    cmsPreview: "retained-authenticated",
    migrationEvidence: "preserved",
    newArticleMonetizationDefault: "none",
    sitemapFreshness: "evidence-based",
    schemaDeployToken: "retain-while-workflow-depends-on-it",
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
