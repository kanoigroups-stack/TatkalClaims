import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpenCheck } from "lucide-react";
import KnowledgeArticleCard from "@/components/blog/KnowledgeArticleCard";
import { getAllPosts } from "@/lib/content";
import {
  KNOWLEDGE_TOPICS,
  getKnowledgeTopicBySlug,
  getKnowledgeTopicPath,
} from "@/lib/content/topics";

export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return KNOWLEDGE_TOPICS.map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const topic = getKnowledgeTopicBySlug(params.slug);

  if (!topic) {
    return {
      title: "Topic Not Found",
      robots: { index: false, follow: false },
    };
  }

  const path = getKnowledgeTopicPath(topic);

  return {
    title: topic.title,
    description: topic.landingDescription,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${topic.title} | Tatkal Claims`,
      description: topic.landingDescription,
      url: `https://tatkalclaims.com${path}`,
      type: "website",
    },
  };
}

export default async function TopicLandingPage({
  params,
}: {
  params: { slug: string };
}) {
  const topic = getKnowledgeTopicBySlug(params.slug);

  if (!topic) {
    notFound();
  }

  const posts = (await getAllPosts())
    .filter((post) => post.topics.includes(topic.title))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const path = getKnowledgeTopicPath(topic);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://tatkalclaims.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Knowledge Center",
        item: "https://tatkalclaims.com/blog/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: topic.title,
        item: `https://tatkalclaims.com${path}`,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: topic.title,
    description: topic.landingDescription,
    url: `https://tatkalclaims.com${path}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://tatkalclaims.com/blog/${post.slug}/`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <main className="min-h-screen bg-white pt-20 font-body">
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
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-medium text-slate-900">
                  {topic.title}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <header className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white">
          <div className="container-main px-4 py-14 md:py-20">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold text-primary-200">
                Insurance claim topic
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                {topic.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-primary-100 md:text-xl">
                {topic.landingDescription}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
                  <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
                  {posts.length} {posts.length === 1 ? "article" : "articles"}
                </span>
              </div>
            </div>
          </div>
        </header>

        <section className="container-main px-4 py-14 md:py-20">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-accent-600">
                Topic collection
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
                Latest guidance and updates
              </h2>
              <p className="mt-3 text-lg leading-7 text-slate-600">
                {topic.description}
              </p>
            </div>
            <Link
              href="/blog/#article-library"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Browse full library
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <KnowledgeArticleCard
                  key={post.slug}
                  article={{
                    slug: post.slug,
                    title: post.title,
                    excerpt: post.excerpt,
                    category: post.category,
                    contentType: post.contentType,
                    author: post.author,
                    date: post.date,
                    publishedAt: post.publishedAt,
                    readTime: post.readTime,
                    image: {
                      url: post.image.url,
                      alt: post.image.alt,
                    },
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <h2 className="text-xl font-bold text-slate-900">
                No published articles yet
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                This topic remains available in the Knowledge Centre taxonomy.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
