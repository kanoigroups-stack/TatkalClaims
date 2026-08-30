import Link from "next/link";
import { BookOpenCheck, Newspaper } from "lucide-react";
import { getAllPosts } from "@/lib/content";
import {
  selectEssentialKnowledgePosts,
  sortPostsNewestFirst,
} from "@/lib/content/knowledge";
import KnowledgeArticleCard, {
  type KnowledgeArticleSummary,
} from "@/components/blog/KnowledgeArticleCard";
import KnowledgeCentreBrowser from "@/components/blog/KnowledgeCentreBrowser";
import {
  buildAuthorSchema,
  ORGANIZATION_ID,
} from "@/lib/content/seo";

export const revalidate = 60;

export const metadata = {
  title: "Knowledge Center",
  description:
    "Expert insights on insurance claim rejection, delays, mis-selling, and dispute resolution. Read our latest guides and case studies.",
  alternates: {
    canonical: "/blog/",
  },
  openGraph: {
    title: "Knowledge Center | Tatkal Claims",
    description:
      "Expert insights on insurance claim rejection, delays, mis-selling, and dispute resolution.",
    url: "https://tatkalclaims.com/blog/",
    type: "website",
  },
};

function summarizePost(
  post: Awaited<ReturnType<typeof getAllPosts>>[number]
): KnowledgeArticleSummary & { topics: string[] } {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    topics: post.topics,
    contentType: post.contentType,
    author: post.author,
    date: post.date,
    publishedAt: post.publishedAt,
    readTime: post.readTime,
    image: {
      url: post.image.url,
      alt: post.image.alt,
    },
  };
}

export default async function BlogListPage() {
  const posts = await getAllPosts();
  const newestPosts = sortPostsNewestFirst(posts);
  const essentialPosts = selectEssentialKnowledgePosts(posts, 3);
  const latestPosts = newestPosts.slice(0, 6);

  const allArticles = newestPosts.map(summarizePost);
  const essentialArticles = essentialPosts.map(summarizePost);
  const latestArticles = latestPosts.map(summarizePost);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Tatkal Claims Knowledge Center",
    url: "https://tatkalclaims.com/blog/",
    description: "Expert insights on insurance claim disputes and resolution.",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: "https://tatkalclaims.com/blog/" + post.slug + "/",
      datePublished: post.date,
      author: buildAuthorSchema(post.authorEntity),
      publisher: {
        "@id": ORGANIZATION_ID,
      },
      image: post.image.url,
      keywords: [post.category, ...post.topics],
    })),
  };

  const newsCount = posts.filter(
    (post) =>
      post.contentType === "news" ||
      post.contentType === "regulatoryUpdate"
  ).length;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-white pt-20 font-body">
        <nav
          aria-label="Breadcrumb"
          className="border-b border-slate-200 bg-white"
        >
          <div className="container-main px-4 py-3">
            <ol className="flex items-center gap-2 text-sm text-slate-500">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-primary-700"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li
                aria-current="page"
                className="font-medium text-slate-900"
              >
                Knowledge Center
              </li>
            </ol>
          </div>
        </nav>

        <section className="overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white">
          <div className="container-main px-4 py-10 md:py-12">
            <div className="max-w-4xl">
              <div className="mb-4 inline-flex items-center rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-primary-100">
                Tatkal Claims Knowledge Center
              </div>
              <h1 className="text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-5xl">
                Understand your insurance rights before you need to fight for them
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-primary-100 md:text-lg">
                Practical guides, real claim decisions, and policyholder-focused
                updates on claim rejection, delays, mis-selling, health insurance,
                and changing IRDAI rules.
              </p>

              <div className="mt-5 flex flex-wrap gap-2 text-xs sm:text-sm">
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                  {posts.length} published articles
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                  <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
                  Guides & explainers
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                  <Newspaper className="h-4 w-4" aria-hidden="true" />
                  {newsCount} news & updates
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="container-main px-4 py-10 md:py-12">
            <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold text-primary-700">
                  Latest articles
                </p>
                <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
                  What policyholders should know now
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-slate-600 md:text-right">
                The newest guidance, decisions and regulatory updates, shown first
                so fresh information is easy to reach.
              </p>
            </div>

            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <KnowledgeArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>

        <KnowledgeCentreBrowser articles={allArticles}>
          <section className="border-b border-slate-200 bg-slate-50">
            <div className="container-main px-4 py-10 md:py-12">
              <div className="mb-7 max-w-3xl">
                <p className="mb-2 text-sm font-semibold text-accent-600">
                  Start here
                </p>
                <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">
                  Essential guides for common insurance disputes
                </h2>
                <p className="text-base leading-7 text-slate-600 md:text-lg">
                  Foundational guidance for rejection, delay and mis-selling when
                  you need a clear first step.
                </p>
              </div>

              <div className="grid gap-7 md:grid-cols-3">
                {essentialArticles.map((article) => (
                  <KnowledgeArticleCard
                    key={article.slug}
                    article={article}
                    emphasis
                  />
                ))}
              </div>
            </div>
          </section>
        </KnowledgeCentreBrowser>
      </main>
    </>
  );
}
