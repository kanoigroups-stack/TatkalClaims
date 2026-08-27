import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import blogsData from "../lib/blogs";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  image: string;
  content: string;
};

const EXPECTED_COUNT = 58;
const BASE_URL = "https://tatkalclaims.com";
const SOURCE_BLOG_COMMIT =
  process.env.BASELINE_SOURCE_COMMIT ||
  "864436218168dc67293a9be210ee3c0b072afc10";

const PROTECTED_SLUGS = [
  "claim-rejection-guide",
  "irdai-30-day-claim-settlement-rule-health-insurance-rights",
  "mis-selling-guide",
] as const;

const DEPRECATED_SLUG =
  "what-to-do-if-insurance-claim-is-rejected-complete-guide";

const REQUIRED_REDIRECT = {
  source: `/blog/${DEPRECATED_SLUG}/`,
  destination: "/blog/claim-rejection-guide/",
  permanent: true,
};

function sha256(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function validatePost(post: BlogPost, index: number) {
  for (const field of [
    "slug",
    "title",
    "excerpt",
    "category",
    "readTime",
    "author",
    "date",
    "image",
    "content",
  ] as const) {
    assert(
      typeof post[field] === "string" && post[field].length > 0,
      `Post #${index + 1} has an invalid or empty ${field}`
    );
  }

  assert(
    /^\d{4}-\d{2}-\d{2}$/.test(post.date),
    `Post "${post.slug}" has a non-YYYY-MM-DD date: ${post.date}`
  );
}

async function main() {
  const posts = blogsData.posts as BlogPost[];

  assert(
    posts.length === EXPECTED_COUNT,
    `Expected ${EXPECTED_COUNT} effective posts, found ${posts.length}`
  );

  posts.forEach(validatePost);

  const slugs = posts.map((post) => post.slug);
  const uniqueSlugs = new Set(slugs);

  assert(
    uniqueSlugs.size === slugs.length,
    `Duplicate slugs found: ${slugs
      .filter((slug, index) => slugs.indexOf(slug) !== index)
      .join(", ")}`
  );

  for (const slug of PROTECTED_SLUGS) {
    assert(uniqueSlugs.has(slug), `Protected slug missing: ${slug}`);
  }

  assert(
    !uniqueSlugs.has(DEPRECATED_SLUG),
    `Deprecated consolidated slug must not be exported: ${DEPRECATED_SLUG}`
  );

  const nextConfig = await readFile("next.config.js", "utf8");

  assert(
    nextConfig.includes(`source: '${REQUIRED_REDIRECT.source}'`) &&
      nextConfig.includes(
        `destination: '${REQUIRED_REDIRECT.destination}'`
      ) &&
      nextConfig.includes("permanent: true"),
    "Required permanent claim-rejection redirect is missing or changed"
  );

  const articleBaseline = posts.map((post) => {
    const publicUrl = `${BASE_URL}/blog/${post.slug}/`;
    const canonical = publicUrl;

    const recordForHash = {
      slug: post.slug,
      publicUrl,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      readTime: post.readTime,
      author: post.author,
      publishedDate: post.date,
      image: post.image,
      canonical,
      content: post.content,
    };

    return {
      ...recordForHash,
      contentSha256: sha256(post.content),
      recordSha256: sha256(JSON.stringify(recordForHash)),
    };
  });

  const sitemapBlogUrls = articleBaseline.map((article) => article.publicUrl);

  const exportPayload = {
    schemaVersion: 1,
    source: {
      repository: "kanoigroups-stack/TatkalClaims",
      sourceBlogCommit: SOURCE_BLOG_COMMIT,
      effectiveModule: "lib/blogs.ts",
    },
    articleCount: articleBaseline.length,
    posts,
  };

  const manifest = {
    schemaVersion: 1,
    source: exportPayload.source,
    expectedArticleCount: EXPECTED_COUNT,
    articleCount: articleBaseline.length,
    duplicateSlugCount: slugs.length - uniqueSlugs.size,
    missingProtectedSlugs: PROTECTED_SLUGS.filter(
      (slug) => !uniqueSlugs.has(slug)
    ),
    deprecatedSlugPresent: uniqueSlugs.has(DEPRECATED_SLUG),
    slugs,
    sitemapBlogUrls,
    redirects: [REQUIRED_REDIRECT],
    articles: articleBaseline.map(({ content, ...record }) => record),
  };

  await mkdir("migration/baseline", { recursive: true });
  await writeFile(
    "migration/baseline/effective-blogs.json",
    `${JSON.stringify(exportPayload, null, 2)}\n`,
    "utf8"
  );
  await writeFile(
    "migration/baseline/manifest.json",
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );

  console.log(
    JSON.stringify(
      {
        articleCount: manifest.articleCount,
        duplicateSlugCount: manifest.duplicateSlugCount,
        missingProtectedSlugs: manifest.missingProtectedSlugs,
        deprecatedSlugPresent: manifest.deprecatedSlugPresent,
        redirectCount: manifest.redirects.length,
        sourceBlogCommit: SOURCE_BLOG_COMMIT,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
