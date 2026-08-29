import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  RefreshCw,
  User,
} from "lucide-react";
import Link from "next/link";
import ReadingProgress from "@/components/blog/ReadingProgress";
import PortableArticleBody from "@/components/blog/PortableArticleBody";
import ArticleTableOfContents from "@/components/blog/ArticleTableOfContents";
import KnowledgeArticleCard from "@/components/blog/KnowledgeArticleCard";
import AdSenseScript from "@/components/ads/AdSenseScript";
import ArticleMonetizationProvider from "@/components/ads/ArticleMonetizationProvider";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/content";
import { buildArticleHeadingNavigation } from "@/lib/content/article-navigation";
import {
  buildArticleMetadata,
  buildArticleSchema,
  buildBreadcrumbSchema,
} from "@/lib/content/seo";
import {
  getKnowledgeTopicByTitle,
  getKnowledgeTopicPath,
} from "@/lib/content/topics";
import { formatDate } from "@/utils/date";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }

  return buildArticleMetadata(post);
}

function contentTypeLabel(contentType?: string) {
  const labels: Record<string, string> = {
    guide: "Guide",
    explainer: "Explainer",
    news: "News",
    regulatoryUpdate: "Regulatory Update",
    caseStudy: "Case Study",
    judgment: "Judgment",
  };

  return contentType ? labels[contentType] || contentType : null;
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const [post, relatedPosts] = await Promise.all([
    getPostBySlug(params.slug),
    getRelatedPosts(params.slug, 3),
  ]);

  if (!post) {
    notFound();
  }

  const primaryTopic = post.topics[0]
    ? getKnowledgeTopicByTitle(post.topics[0])
    : undefined;
  const breadcrumbSchema = buildBreadcrumbSchema(post);
  const articleSchema = buildArticleSchema(post);
  const { headings } = buildArticleHeadingNavigation(post.body);
  const typeLabel = contentTypeLabel(post.contentType);
  const adPreviewProfile =
    process.env.VERCEL_ENV === "preview" ? "standard" : undefined;

  return (
    <div className="min-h-screen bg-white pt-20 font-body">
      <ReadingProgress targetId="article-content" />
      <AdSenseScript
        profile={post.monetization}
        preview={Boolean(adPreviewProfile)}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="border-b border-slate-200 bg-white">
        <div className="container-main px-4 py-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-primary-700"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/blog/"
                  className="transition-colors hover:text-primary-700"
                >
                  Knowledge Center
                </Link>
              </li>
              {primaryTopic && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href={getKnowledgeTopicPath(primaryTopic)}
                      className="transition-colors hover:text-primary-700"
                    >
                      {primaryTopic.title}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li
                aria-current="page"
                className="max-w-[220px] truncate font-medium text-slate-900 sm:max-w-md"
              >
                {post.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <header className="bg-gradient-to-b from-primary-50/70 to-white">
        <div className="container-main px-4 pb-10 pt-10 md:pb-12 md:pt-14">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary-100 px-3.5 py-1.5 text-sm font-semibold text-primary-800">
                {post.category}
              </span>
              {post.topics.map((topicTitle) => {
                const topic = getKnowledgeTopicByTitle(topicTitle);
                return topic ? (
                  <Link
                    key={topic.slug}
                    href={getKnowledgeTopicPath(topic)}
                    className="rounded-full border border-accent-200 bg-accent-50 px-3.5 py-1.5 text-sm font-semibold text-accent-700 transition hover:border-accent-300 hover:bg-accent-100"
                  >
                    {topic.title}
                  </Link>
                ) : null;
              })}
              {typeLabel && (
                <span className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600">
                  {typeLabel}
                </span>
              )}
            </div>

            <h1 className="mt-6 text-3xl font-bold leading-[1.15] text-slate-900 md:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
              {post.excerpt}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200 pt-6 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4" aria-hidden="true" />
                {post.author}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Published {formatDate(post.date)}
              </span>
              {post.updatedAt && (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Updated {formatDate(post.updatedAt)}
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </header>

      <figure className="container-main px-4">
        <div className="relative mx-auto aspect-[16/9] max-w-6xl overflow-hidden rounded-2xl bg-slate-100 shadow-card">
          <Image
            src={post.image.url}
            alt={post.image.alt}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
        {(post.image.caption || post.image.credit) && (
          <figcaption className="mx-auto mt-3 max-w-6xl text-sm leading-5 text-slate-500">
            {post.image.caption}
            {post.image.caption && post.image.credit ? " · " : ""}
            {post.image.credit}
          </figcaption>
        )}
      </figure>

      <div className="container-main px-4 pb-16 pt-12 md:pb-24 md:pt-16">
        <div className="mx-auto max-w-6xl">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
            <div className="lg:hidden">
              <ArticleTableOfContents headings={headings} variant="mobile" />
            </div>

            <ArticleMonetizationProvider
              profile={post.monetization}
              previewProfile={adPreviewProfile}
            >
              <article id="article-content" className="min-w-0 max-w-3xl">
                <PortableArticleBody value={post.body} />
              </article>
            </ArticleMonetizationProvider>

            <ArticleTableOfContents headings={headings} variant="desktop" />
          </div>

          <section className="mt-16 max-w-3xl rounded-2xl border border-primary-100 bg-gradient-to-r from-primary-50 to-accent-50 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-primary-900">
              Facing a similar insurance issue?
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Share what happened and our team can help you understand the next
              practical step for your claim or complaint.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Link href="/#contact-form" className="btn-primary text-center">
                Get Free Case Evaluation
              </Link>
              <a
                href="tel:+917207382073"
                className="btn-secondary text-center"
              >
                Call Our Experts
              </a>
            </div>
          </section>

          {relatedPosts.length > 0 && (
            <section className="mt-16 border-t border-slate-200 pt-12">
              <div className="mb-8 max-w-3xl">
                <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
                  Related articles
                </h2>
                <p className="mt-3 text-lg text-slate-600">
                  Continue with guidance and updates most closely related to
                  this topic.
                </p>
              </div>

              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <KnowledgeArticleCard
                    key={relatedPost.slug}
                    article={{
                      slug: relatedPost.slug,
                      title: relatedPost.title,
                      excerpt: relatedPost.excerpt,
                      category: relatedPost.category,
                      contentType: relatedPost.contentType,
                      author: relatedPost.author,
                      date: relatedPost.date,
                      publishedAt: relatedPost.publishedAt,
                      readTime: relatedPost.readTime,
                      image: {
                        url: relatedPost.image.url,
                        alt: relatedPost.image.alt,
                      },
                    }}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
