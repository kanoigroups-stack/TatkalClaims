import { readFile } from "node:fs/promises";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const previewClient = await readFile("lib/content/sanity-preview.ts", "utf8");

  assert(
    previewClient.includes('perspective: "previewDrafts"'),
    "CMS preview must use Sanity previewDrafts perspective"
  );

  assert(
    (previewClient.match(/cache: "no-store"/g) || []).length >= 2,
    "Both CMS preview list and article fetches must use cache: no-store"
  );

  assert(
    previewClient.includes("useCdn: false"),
    "CMS preview must bypass the Sanity CDN"
  );

  assert(
    !previewClient.includes('perspective: "raw"'),
    "CMS editorial preview must not render from raw perspective"
  );

  assert(
    previewClient.includes(
      "order(coalesce(legacyOrder, 999999) asc, publishedAt desc)"
    ),
    "CMS preview list must preserve migrated archive ordering"
  );

  console.log(
    "CMS preview uses previewDrafts with no-store and preserves archive ordering."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
