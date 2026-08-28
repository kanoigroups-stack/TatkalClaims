import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, User } from "lucide-react";
import PortableArticleBody from "@/components/blog/PortableArticleBody";
import {
  getPreviewSanityFetchDiagnostics,
  getPreviewSanityPostBySlug,
} from "@/lib/content/sanity-preview";
import { buildArticleMetadata } from "@/lib/content/seo";
import { formatDate } from "@/utils/date";

export const dynamic = "force-dynamic";

function inspectPortableBody(value: unknown[]) {
  let textBlocks = 0;
  let articleImages = 0;
  let articleTables = 0;
  let linkMarkDefs = 0;
  let markedLinkSpans = 0;
  let firstLinkHref = "";
  let firstLinkedText = "";

  for (const item of value) {
    if (!item || typeof item !== "object") continue;

    const block = item as any;

    if (block._type === "articleImage") {
      articleImages += 1;
      continue;
    }

    if (block._type === "articleTable") {
      articleTables += 1;
      continue;
    }

    if (block._type !== "block") continue;
    textBlocks += 1;

    const linkDefs = Array.isArray(block.markDefs)
      ? block.markDefs.filter(
          (mark: any) =>
            mark?._type === "link" &&
            typeof mark?._key === "string" &&
            typeof mark?.href === "string"
        )
      : [];

    linkMarkDefs += linkDefs.length;

    if (!linkDefs.length) continue;

    const linkKeys = new Set(linkDefs.map((mark: any) => mark._key));
    if (!firstLinkHref) firstLinkHref = linkDefs[0].href;

    const children = Array.isArray(block.children) ? block.children : [];

    for (const child of children) {
      const marks = Array.isArray(child?.marks) ? child.marks : [];
      if (!marks.some((mark: string) => linkKeys.has(mark))) continue;

      markedLinkSpans += 1;
      if (!firstLinkedText && typeof child?.text === "string") {
        firstLinkedText = child.text;
      }
    }
  }

  return {
    totalBlocks: value.length,
    textBlocks,
    articleImages,
    articleTables,
    linkMarkDefs,
    markedLinkSpans,
    firstLinkHref,
    firstLinkedText,
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const post = await getPreviewSanityPostBySlug(params.slug);

    if (!post) {
      return {
        title: "Article Not Found",
        robots: { index: false, follow: false },
      };
    }

    return buildArticleMetadata(post, { noIndex: true });
  } catch {
    return {
      title: "CMS Editorial Preview",
      robots: { index: false, follow: false, nocache: true },
    };
  }
}

export default async function CmsPreviewArticlePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { debug?: string };
}) {
  let post;

  try {
    post = await getPreviewSanityPostBySlug(params.slug);
  } catch (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-24">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
            Sanity editorial preview
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Preview unavailable</h1>
          <p className="mt-4 text-slate-600">
            This noindex route could not read the authenticated draft. The public
            article is unaffected.
          </p>
          <pre className="mt-5 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
            {error instanceof Error ? error.message : "Unknown Sanity preview error"}
          </pre>
        </div>
      </main>
    );
  }

  if (!post) {
    notFound();
  }

  const debug =
    searchParams?.debug === "1" ? inspectPortableBody(post.body) : null;

  const fetchDebug =
    searchParams?.debug === "1"
      ? await getPreviewSanityFetchDiagnostics(params.slug)
      : null;

  const rawDebug = fetchDebug?.raw.map((document) => ({
    id: document._id,
    originalId: document._originalId || "",
    ...inspectPortableBody(Array.isArray(document.body) ? document.body : []),
  }));

  const previewDraftsDebug = fetchDebug?.previewDrafts.map((document) => ({
    id: document._id,
    originalId: document._originalId || "",
    ...inspectPortableBody(Array.isArray(document.body) ? document.body : []),
  }));

  return (
    <main className="min-h-screen bg-slate-50 pb-20 pt-20">
      <div className="border-b border-amber-300 bg-amber-50">
        <div className="container-main px-4 py-4 text-sm text-amber-950">
          <strong>CMS editorial preview:</strong> production dataset, draft-first
          perspective, noindex. This does not replace the published article.
          {debug && (
            <div className="mt-3 rounded-lg border border-amber-300 bg-white/80 p-3 font-mono text-xs leading-5">
              <strong className="font-semibold">Preview diagnostic v2</strong>
              <div>
                body={debug.totalBlocks} blocks · text={debug.textBlocks} ·
                images={debug.articleImages} · tables={debug.articleTables} ·
                linkDefs={debug.linkMarkDefs} · markedSpans={debug.markedLinkSpans}
              </div>
              <div>
                firstLinkedText={JSON.stringify(debug.firstLinkedText || null)}
              </div>
              <div className="break-all">
                firstHref={JSON.stringify(debug.firstLinkHref || null)}
              </div>

              <div className="mt-3 border-t border-amber-200 pt-2">
                <strong>raw + no-store</strong>
                {(rawDebug || []).map((entry) => (
                  <div key={entry.id} className="mt-1 break-all">
                    id={entry.id} · originalId={entry.originalId || "null"} ·
                    body={entry.totalBlocks} · images={entry.articleImages} ·
                    tables={entry.articleTables} · linkDefs={entry.linkMarkDefs} ·
                    markedSpans={entry.markedLinkSpans} ·
                    firstLinkedText={JSON.stringify(entry.firstLinkedText || null)}
                  </div>
                ))}
                {rawDebug?.length === 0 && <div>no documents</div>}
              </div>

              <div className="mt-3 border-t border-amber-200 pt-2">
                <strong>previewDrafts + no-store</strong>
                {(previewDraftsDebug || []).map((entry) => (
                  <div key={entry.id + entry.originalId} className="mt-1 break-all">
                    id={entry.id} · originalId={entry.originalId || "null"} ·
                    body={entry.totalBlocks} · images={entry.articleImages} ·
                    tables={entry.articleTables} · linkDefs={entry.linkMarkDefs} ·
                    markedSpans={entry.markedLinkSpans} ·
                    firstLinkedText={JSON.stringify(entry.firstLinkedText || null)}
                  </div>
                ))}
                {previewDraftsDebug?.length === 0 && <div>no documents</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      <article>
        <header className="bg-white">
          <div className="container-main px-4 py-10 md:py-14">
            <Link
              href="/cms-preview/blog/"
              className="text-sm font-semibold text-primary-700 hover:underline"
            >
              ← All CMS preview articles
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-primary-700">
              {post.category}
            </p>
            <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight text-slate-950 md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              {post.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post.date)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
            <p className="mt-5 text-xs text-slate-400">
              Target public URL: /blog/{post.slug}/
            </p>
          </div>

          <div className="container-main px-4">
            <img
              src={post.image.url}
              alt={post.image.alt}
              className="max-h-[520px] w-full rounded-2xl border border-slate-200 object-cover"
            />
            {(post.image.caption || post.image.credit) && (
              <p className="mt-2 text-sm text-slate-500">
                {post.image.caption}
                {post.image.caption && post.image.credit ? " · " : ""}
                {post.image.credit}
              </p>
            )}
          </div>
        </header>

        <div className="container-main px-4 py-12">
          <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm md:p-10">
            <PortableArticleBody value={post.body} />
          </div>
        </div>
      </article>
    </main>
  );
}
