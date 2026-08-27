import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { getAllPosts } from "@/lib/content";
import { formatDate } from "@/utils/date";

export const dynamic = "force-dynamic";

export default async function CmsPreviewBlogPage() {
  let posts;

  try {
    posts = await getAllPosts("sanity");
  } catch (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-24">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
            Sanity migration preview
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Preview unavailable</h1>
          <p className="mt-4 text-slate-600">
            The public Tatkal Claims blog is unaffected. This isolated preview could not
            read the Sanity migration dataset.
          </p>
          <pre className="mt-5 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
            {error instanceof Error ? error.message : "Unknown Sanity error"}
          </pre>
        </div>
      </main>
    );
  }

  const parityOk = posts.length === 57;

  return (
    <main className="min-h-screen bg-slate-50 pb-20 pt-20">
      <div className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="container-main px-4 py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            Noindex · migration dataset · not production
          </p>
          <h1 className="mt-2 text-3xl font-bold">Sanity CMS article preview</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            This route reads Sanity directly through the new content adapter. Public
            /blog/ pages still use the legacy JSON/TypeScript source.
          </p>
          <div
            className={
              "mt-5 inline-flex rounded-full px-4 py-2 text-sm font-semibold " +
              (parityOk
                ? "bg-emerald-500/20 text-emerald-200"
                : "bg-red-500/20 text-red-200")
            }
          >
            {posts.length} / 57 articles
          </div>
        </div>
      </div>

      <div className="container-main px-4 py-10">
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <Link href={"/cms-preview/blog/" + post.slug + "/"} className="block">
                <div className="h-44 overflow-hidden bg-slate-100">
                  <img
                    src={post.image.url}
                    alt={post.image.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                    {post.category}
                  </p>
                  <h2 className="mt-2 line-clamp-2 text-lg font-bold text-slate-900">
                    {post.title}
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(post.date)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
