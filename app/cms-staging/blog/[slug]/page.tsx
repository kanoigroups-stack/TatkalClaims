import { notFound } from "next/navigation";
import { Clock, User, Calendar } from "lucide-react";
import Link from "next/link";
import PortableArticleBody from "@/components/blog/PortableArticleBody";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import {
  buildArticleMetadata,
  getPublicArticlePath,
} from "@/lib/content/seo";
import { formatDate } from "@/utils/date";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug, "sanity");
  if (!post) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }

  return buildArticleMetadata(post, { noIndex: true });
}

export default async function CmsStagingArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const [post, posts] = await Promise.all([
    getPostBySlug(params.slug, "sanity"),
    getAllPosts("sanity"),
  ]);

  if (!post) notFound();

  const relatedPosts = posts
    .filter((candidate) => candidate.slug !== post.slug)
    .slice(0, 2);

  return (
    <main className="min-h-screen bg-white pt-20">
      <div className="border-b border-amber-300 bg-amber-50">
        <div className="container-main px-4 py-3 text-sm text-amber-950">
          <strong>Phase 6 staging:</strong> Sanity body inside the current production
          article shell. Noindex. Target public URL: {getPublicArticlePath(post)}
        </div>
      </div>

      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container-main px-4 py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-slate-600 flex-wrap">
              <li><Link href="/" className="hover:text-primary-700 transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/cms-staging/blog/" className="hover:text-primary-700 transition-colors">Knowledge Center</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-slate-900 font-medium line-clamp-1 max-w-[200px]">{post.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="relative h-64 md:h-96 overflow-hidden bg-slate-900">
        <img
          src={post.image.url}
          alt={post.image.alt}
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container-main">
            <span className="bg-accent-500 text-white text-sm font-semibold px-4 py-1 rounded-full inline-block mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2 max-w-3xl">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container-main px-4 py-12">
        <div className="flex items-center gap-6 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200 flex-wrap">
          <span className="flex items-center gap-2"><User className="w-4 h-4" aria-hidden="true" />{post.author}</span>
          <span className="flex items-center gap-2"><Calendar className="w-4 h-4" aria-hidden="true" />{formatDate(post.date)}</span>
          <span className="flex items-center gap-2"><Clock className="w-4 h-4" aria-hidden="true" />{post.readTime}</span>
        </div>

        <article className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <PortableArticleBody value={post.body} />
          </div>
        </article>

        <div className="max-w-3xl mx-auto mt-16 p-8 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl border border-primary-100">
          <h3 className="text-xl font-bold text-primary-900 mb-2">Facing a similar issue?</h3>
          <p className="text-slate-600 mb-6">Our experts can help you resolve your insurance dispute. Get a free case evaluation today.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="btn-primary text-center">Get Free Case Evaluation</Link>
            <a href="tel:+917207382073" className="btn-secondary text-center">Call Our Experts</a>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-16">
          <h3 className="text-xl font-bold text-slate-900 mb-6">More Articles</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/cms-staging/blog/${relatedPost.slug}/`}
                className="group p-4 bg-slate-50 rounded-xl hover:bg-primary-50 transition-colors border border-slate-100"
              >
                <span className="text-xs font-semibold text-primary-700">{relatedPost.category}</span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 group-hover:text-primary-700 transition-colors line-clamp-2">
                  {relatedPost.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
