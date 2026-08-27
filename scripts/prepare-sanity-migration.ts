import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";\n\n// Deterministic migration parser: source changes must fail baseline hash validation.

type LegacyPost = {
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

type Warning = {
  code: string;
  slug: string;
  line: number | null;
  message: string;
};

type Span = {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
};

type MarkDef = {
  _type: "link";
  _key: string;
  href: string;
};

type TextBlock = {
  _type: "block";
  _key: string;
  style: "normal" | "h2" | "h3" | "blockquote" | "hr";
  markDefs: MarkDef[];
  children: Span[];
  listItem?: "bullet" | "number";
  level?: number;
};

type TableBlock = {
  _type: "articleTable";
  _key: string;
  hasHeaderRow: boolean;
  rows: Array<{
    _type: "tableRow";
    _key: string;
    cells: string[];
  }>;
};

const BASELINE_EXPORT = "migration/baseline/effective-blogs.json";
const BASELINE_MANIFEST = "migration/baseline/manifest.json";
const OUTPUT_DIR = "migration/sanity";
const NDJSON = OUTPUT_DIR + "/dry-run.ndjson";
const REPORT = OUTPUT_DIR + "/report.json";
const EXPECTED_ARTICLES = 57;
const DEPRECATED_SLUG =
  "what-to-do-if-insurance-claim-is-rejected-complete-guide";

function hash(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function makeKey(seed: string) {
  return hash(seed).slice(0, 12);
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function documentId(prefix: string, value: string) {
  const readable = slugify(value);
  const suffix = hash(value).slice(0, 10);
  const maxReadable = Math.max(1, 110 - prefix.length - suffix.length);
  return prefix + "." + readable.slice(0, maxReadable) + "." + suffix;
}

function parseReadTime(value: string, slug: string) {
  const match = value.match(/(\d+)\s*min/i);
  assert(match, "Could not parse reading time for " + slug + ": " + value);
  return Number(match[1]);
}

function publishedAt(date: string, slug: string) {
  assert(/^\d{4}-\d{2}-\d{2}$/.test(date), "Invalid date for " + slug + ": " + date);
  return date + "T00:00:00.000Z";
}

function isTableLine(line: string) {
  const value = line.trim();
  return value.startsWith("|") && value.endsWith("|") && value.length >= 3;
}

function splitTableRow(line: string) {
  return line.trim().slice(1, -1).split("|").map((cell) => cell.trim());
}

function isDividerCell(cell: string) {
  return /^:?-{3,}:?$/.test(cell.trim());
}

function parseInline(
  text: string,
  slug: string,
  line: number,
  warnings: Warning[],
  seed: string
) {
  const children: Span[] = [];
  const markDefs: MarkDef[] = [];
  const strongCount = text.match(/\*\*/g)?.length ?? 0;

  if (strongCount % 2 !== 0) {
    warnings.push({
      code: "UNBALANCED_STRONG_MARKER",
      slug,
      line,
      message: "Unbalanced ** marker preserved as literal text.",
    });
  }

  if ((text.includes("](") || text.includes("[")) &&
      !/\[[^\]]+\]\([^)]+\)/.test(text)) {
    warnings.push({
      code: "POSSIBLE_MALFORMED_LINK",
      slug,
      line,
      message: "Possible Markdown link syntax could not be parsed; source text was preserved.",
    });
  }

  const tokenRegex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let cursor = 0;
  let tokenIndex = 0;
  let match: RegExpExecArray | null;

  function pushSpan(value: string, marks: string[]) {
    if (!value) return;
    children.push({
      _type: "span",
      _key: makeKey(seed + ":span:" + children.length + ":" + value),
      text: value,
      marks,
    });
  }

  while ((match = tokenRegex.exec(text))) {
    if (match.index > cursor) {
      pushSpan(text.slice(cursor, match.index), []);
    }

    const token = match[0];
    if (token.startsWith("**")) {
      pushSpan(token.slice(2, -2), ["strong"]);
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (!link) {
        pushSpan(token, []);
      } else {
        const markKey = makeKey(seed + ":link:" + tokenIndex + ":" + link[2]);
        markDefs.push({
          _type: "link",
          _key: markKey,
          href: link[2],
        });
        pushSpan(link[1], [markKey]);
      }
    }

    cursor = match.index + token.length;
    tokenIndex += 1;
  }

  if (cursor < text.length) {
    pushSpan(text.slice(cursor), []);
  }

  if (children.length === 0) {
    pushSpan(text, []);
  }

  return { children, markDefs };
}

function textBlock(args: {
  text: string;
  slug: string;
  line: number;
  warnings: Warning[];
  seed: string;
  style?: "normal" | "h2" | "h3" | "blockquote" | "hr";
  listItem?: "bullet" | "number";
}): TextBlock {
  const inline = parseInline(
    args.text,
    args.slug,
    args.line,
    args.warnings,
    args.seed
  );

  const block: TextBlock = {
    _type: "block",
    _key: makeKey(args.seed),
    style: args.style ?? "normal",
    markDefs: inline.markDefs,
    children: inline.children,
  };

  if (args.listItem) {
    block.listItem = args.listItem;
    block.level = 1;
  }

  return block;
}

function parseBody(post: LegacyPost) {
  const warnings: Warning[] = [];
  const blocks: Array<TextBlock | TableBlock> = [];
  const lines = post.content.split(/\r?\n/);
  let tables = 0;
  let bullets = 0;
  let numberedItems = 0;
  let headings = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index];
    const value = raw.trim();
    const line = index + 1;

    if (!value) continue;

    if (isTableLine(raw)) {
      const tableLines: Array<{ raw: string; line: number }> = [];
      let cursor = index;

      while (cursor < lines.length && isTableLine(lines[cursor])) {
        tableLines.push({ raw: lines[cursor], line: cursor + 1 });
        cursor += 1;
      }

      const rows = tableLines.map((item) => splitTableRow(item.raw));
      const columnCounts = new Set(rows.map((row) => row.length));
      const hasEscapedPipe = tableLines.some((item) => item.raw.includes("\\|"));
      const hasHeader =
        rows.length >= 2 && rows[1].length > 0 && rows[1].every(isDividerCell);

      if (hasEscapedPipe || columnCounts.size !== 1) {
        warnings.push({
          code: "MALFORMED_TABLE_PRESERVED_AS_TEXT",
          slug: post.slug,
          line,
          message: hasEscapedPipe
            ? "Table uses escaped pipes; rows were preserved as paragraphs."
            : "Table column counts differ; rows were preserved as paragraphs.",
        });

        for (const item of tableLines) {
          blocks.push(
            textBlock({
              text: item.raw.trim(),
              slug: post.slug,
              line: item.line,
              warnings,
              seed: post.slug + ":table-fallback:" + item.line,
            })
          );
        }
      } else {
        if (!hasHeader) {
          warnings.push({
            code: "TABLE_WITHOUT_MARKDOWN_SEPARATOR",
            slug: post.slug,
            line,
            message: "Pipe table has no Markdown separator row; imported with hasHeaderRow=false.",
          });
        }

        const dataRows = rows.filter((_, rowIndex) => !(hasHeader && rowIndex === 1));

        if (dataRows.some((row) =>
          row.some((cell) => /\*\*|\[[^\]]+\]\([^)]+\)/.test(cell))
        )) {
          warnings.push({
            code: "TABLE_CELL_MARKDOWN_PRESERVED",
            slug: post.slug,
            line,
            message: "Markdown markers inside table cells were preserved literally.",
          });
        }

        blocks.push({
          _type: "articleTable",
          _key: makeKey(post.slug + ":table:" + line),
          hasHeaderRow: hasHeader,
          rows: dataRows.map((cells, rowIndex) => ({
            _type: "tableRow",
            _key: makeKey(post.slug + ":table:" + line + ":row:" + rowIndex),
            cells,
          })),
        });
        tables += 1;
      }

      index = cursor - 1;
      continue;
    }

    if (/^##\s+/.test(value)) {
      blocks.push(
        textBlock({
          text: value.replace(/^##\s+/, ""),
          slug: post.slug,
          line,
          style: "h2",
          warnings,
          seed: post.slug + ":h2:" + line,
        })
      );
      headings += 1;
      continue;
    }

    if (/^###\s+/.test(value)) {
      blocks.push(
        textBlock({
          text: value.replace(/^###\s+/, ""),
          slug: post.slug,
          line,
          style: "h3",
          warnings,
          seed: post.slug + ":h3:" + line,
        })
      );
      headings += 1;
      continue;
    }

    if (/^-\s+/.test(value)) {
      if (/^\s+/.test(raw)) {
        warnings.push({
          code: "LIST_INDENT_NORMALIZED",
          slug: post.slug,
          line,
          message: "Indented bullet normalized to level 1.",
        });
      }
      blocks.push(
        textBlock({
          text: value.replace(/^-\s+/, ""),
          slug: post.slug,
          line,
          listItem: "bullet",
          warnings,
          seed: post.slug + ":bullet:" + line,
        })
      );
      bullets += 1;
      continue;
    }

    if (/^\d+\.\s+/.test(value)) {
      if (/^\s+/.test(raw)) {
        warnings.push({
          code: "LIST_INDENT_NORMALIZED",
          slug: post.slug,
          line,
          message: "Indented numbered item normalized to level 1.",
        });
      }
      blocks.push(
        textBlock({
          text: value.replace(/^\d+\.\s+/, ""),
          slug: post.slug,
          line,
          listItem: "number",
          warnings,
          seed: post.slug + ":number:" + line,
        })
      );
      numberedItems += 1;
      continue;
    }

    if (/^>\s?/.test(value)) {
      blocks.push(
        textBlock({
          text: value.replace(/^>\s?/, ""),
          slug: post.slug,
          line,
          style: "blockquote",
          warnings,
          seed: post.slug + ":blockquote:" + line,
        })
      );
      continue;
    }

    if (/^-{3,}$/.test(value)) {
      blocks.push(
        textBlock({
          text: value,
          slug: post.slug,
          line,
          style: "hr",
          warnings,
          seed: post.slug + ":hr:" + line,
        })
      );
      continue;
    }

    if (
      /^#\s+/.test(value) ||
      /^####+\s+/.test(value) ||
      /^\x60{3}/.test(value)
    ) {
      warnings.push({
        code: "UNSUPPORTED_BLOCK_SYNTAX_PRESERVED",
        slug: post.slug,
        line,
        message: "Unsupported block-level Markdown preserved as a normal paragraph.",
      });
    }

    blocks.push(
      textBlock({
        text: value,
        slug: post.slug,
        line,
        warnings,
        seed: post.slug + ":paragraph:" + line,
      })
    );
  }

  assert(blocks.length > 0, "Parsed body is empty for " + post.slug);

  return {
    blocks,
    warnings,
    stats: {
      blocks: blocks.length,
      tables,
      bullets,
      numberedItems,
      headings,
    },
  };
}

function migrationContentType(post: LegacyPost) {
  return post.category === "News" ? "news" : "explainer";
}

async function main() {
  const baseline = JSON.parse(await readFile(BASELINE_EXPORT, "utf8"));
  const manifest = JSON.parse(await readFile(BASELINE_MANIFEST, "utf8"));

  assert(baseline.articleCount === EXPECTED_ARTICLES, "Frozen export article count changed");
  assert(baseline.posts.length === EXPECTED_ARTICLES, "Frozen export post count changed");
  assert(manifest.articleCount === EXPECTED_ARTICLES, "Manifest article count changed");
  assert(manifest.expectedArticleCount === EXPECTED_ARTICLES, "Manifest expected count changed");
  assert(manifest.duplicateSlugCount === 0, "Baseline contains duplicate slugs");
  assert(manifest.missingProtectedSlugs.length === 0, "Baseline is missing protected slugs");
  assert(!manifest.deprecatedSlugPresent, "Deprecated slug is present in baseline");

  const manifestBySlug = new Map(
    manifest.articles.map((article: any) => [article.slug, article])
  );

  for (const post of baseline.posts as LegacyPost[]) {
    const frozen: any = manifestBySlug.get(post.slug);
    assert(frozen, "Manifest record missing for " + post.slug);
    assert(hash(post.content) === frozen.contentSha256, "Content hash mismatch for " + post.slug);
    assert(post.title === frozen.title, "Title mismatch for " + post.slug);
    assert(post.excerpt === frozen.excerpt, "Excerpt mismatch for " + post.slug);
    assert(post.date === frozen.publishedDate, "Date mismatch for " + post.slug);
    assert(post.author === frozen.author, "Author mismatch for " + post.slug);
    assert(post.category === frozen.category, "Category mismatch for " + post.slug);
  }

  const posts = baseline.posts as LegacyPost[];
  assert(!posts.some((post) => post.slug === DEPRECATED_SLUG), "Deprecated slug cannot be prepared");

  const authors = [...new Set(posts.map((post) => post.author))].sort();
  const categories = [...new Set(posts.map((post) => post.category))].sort();

  const authorIds = new Map(authors.map((name) => [name, documentId("author", name)]));
  const categoryIds = new Map(categories.map((name) => [name, documentId("category", name)]));

  const authorDocs = authors.map((name) => ({
    _id: authorIds.get(name),
    _type: "author",
    name,
    slug: { _type: "slug", current: slugify(name) },
  }));

  const categoryDocs = categories.map((title) => ({
    _id: categoryIds.get(title),
    _type: "category",
    title,
    slug: { _type: "slug", current: slugify(title) },
  }));

  const warnings: Warning[] = [];
  const articleReports: any[] = [];

  const articleDocs = posts.map((post) => {
    const parsed = parseBody(post);
    warnings.push(...parsed.warnings);

    const document = {
      _id: documentId("article", post.slug),
      _type: "article",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      excerpt: post.excerpt,
      contentType: migrationContentType(post),
      category: {
        _type: "reference",
        _ref: categoryIds.get(post.category),
      },
      topics: [],
      author: {
        _type: "reference",
        _ref: authorIds.get(post.author),
      },
      featuredImage: {
        _type: "articleImage",
        externalUrl: post.image,
        alt: post.title,
        displaySize: "normal",
      },
      publishedAt: publishedAt(post.date, post.slug),
      readingTimeMinutes: parseReadTime(post.readTime, post.slug),
      body: parsed.blocks,
      featured: false,
      cornerstone: false,
      relatedArticles: [],
      monetization: "none",
    };

    articleReports.push({
      slug: post.slug,
      documentId: document._id,
      sourceContentSha256: hash(post.content),
      bodySha256: hash(JSON.stringify(document.body)),
      contentType: document.contentType,
      ...parsed.stats,
      warnings: parsed.warnings,
    });

    return document;
  });

  assert(articleDocs.length === EXPECTED_ARTICLES, "Wrong generated article count");
  assert(new Set(articleDocs.map((doc) => doc.slug.current)).size === EXPECTED_ARTICLES, "Generated slug collision");
  assert(
    articleDocs.every((doc) => manifest.slugs.includes(doc.slug.current)),
    "Generated article contains unexpected slug"
  );

  const documents = [...authorDocs, ...categoryDocs, ...articleDocs];
  const ids = documents.map((doc) => String(doc._id));
  assert(new Set(ids).size === ids.length, "Generated Sanity document ID collision");

  const validRefs = new Set(
    [...authorDocs, ...categoryDocs].map((doc) => String(doc._id))
  );

  for (const article of articleDocs) {
    assert(validRefs.has(String(article.author._ref)), "Missing author ref for " + article.slug.current);
    assert(validRefs.has(String(article.category._ref)), "Missing category ref for " + article.slug.current);
  }

  const warningCounts = warnings.reduce<Record<string, number>>((acc, item) => {
    acc[item.code] = (acc[item.code] ?? 0) + 1;
    return acc;
  }, {});

  const report = {
    schemaVersion: 1,
    source: {
      baselineExport: BASELINE_EXPORT,
      baselineManifest: BASELINE_MANIFEST,
      sourceBlogCommit: baseline.source.sourceBlogCommit,
    },
    policy: {
      articleCountGate: EXPECTED_ARTICLES,
      contentType:
        'Legacy category "News" maps to "news"; every other legacy category maps to the neutral "explainer" placeholder pending editorial review.',
      topics:
        "No topics are inferred because the legacy source has no structured topic field.",
      publishedAt:
        "Legacy date-only values use 00:00:00.000Z on the same calendar date; updatedAt is intentionally omitted.",
      images:
        "Existing remote image URL is preserved in featuredImage.externalUrl; article title is used as alt text to match legacy frontend behavior.",
      monetization:
        'Migrated articles default to "none" so migration cannot accidentally introduce ads.',
      relatedArticles:
        "No related-article relationships are inferred during migration.",
      parsing:
        "H2, H3, blockquotes, dividers, bullets, numbered lists, inline strong, Markdown links and valid pipe tables are parsed. Unsupported or malformed syntax is preserved and reported.",
    },
    summary: {
      articles: articleDocs.length,
      authors: authorDocs.length,
      categories: categoryDocs.length,
      topics: 0,
      documents: documents.length,
      warnings: warnings.length,
      warningCounts,
      tables: articleReports.reduce((sum, article) => sum + Number(article.tables), 0),
      bullets: articleReports.reduce((sum, article) => sum + Number(article.bullets), 0),
      numberedItems: articleReports.reduce(
        (sum, article) => sum + Number(article.numberedItems),
        0
      ),
      parserErrors: 0,
    },
    authors,
    categories,
    warnings,
    articles: articleReports,
  };

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(
    NDJSON,
    documents.map((document) => JSON.stringify(document)).join("\n") + "\n",
    "utf8"
  );
  await writeFile(REPORT, JSON.stringify(report, null, 2) + "\n", "utf8");

  console.log(JSON.stringify(report.summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
