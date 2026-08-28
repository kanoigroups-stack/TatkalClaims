import { Clock, User, Calendar } from "lucide-react";
import Link from "next/link";
import { getAllPosts } from "@/lib/content";
import { formatDate } from "@/utils/date";

export const dynamic = "force-dynamic";

export default async function CmsStagingBlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-screen bg-slate-50/50 pt-20">
      <div className="border-b border-amber-300 bg-amber-50">
        <div className="container-main px-4 py-3 text-sm text-amber-950">
          <strong>CMS published parity:</strong> noindex · Sanity production dataset ·
          migrated archive order preserved · public /blog/ uses the same published adapter
        </div>
      </div>

      <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200">
        <div className="container-main px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-slate-500">
            <li><Link href="/" className="hover:text-primary-700 transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-slate-900 font-medium">Knowledge Center</li>
          </ol>
        </div>
      </nav>

      <div className="bg-gradient-to-r from-primary-800 to-primary-900 text-white py-16 md:py-24">
        <div className="container-main px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Knowledge Center</h1>
          <p className="text-lg text-primary-100 max-w-2xl">Expert insights to help you understand your rights and navigate insurance disputes successfully.</p>
          <p className="mt-4 text-sm text-primary-200">{posts.length} published Sanity articles</p>
        </div>
      </div>

      <div className="container-main px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-100">
              <Link href={`/cms-staging/blog/${post.slug}/`} className="block">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={post.image.url}
                    alt={post.image.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-primary-800 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {post.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" aria-hidden="true" />{formatDate(post.date)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" aria-hidden="true" />{post.readTime}</span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary-700 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <User className="w-3 h-3" aria-hidden="true" />{post.author}
                    </span>
                    <span className="text-primary-700 font-semibold text-sm group-hover:gap-2 gap-1 transition-all inline-flex items-center">Read More <span aria-hidden="true">→</span></span>
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
