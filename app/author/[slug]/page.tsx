import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  BookOpenCheck,
  ExternalLink,
  GraduationCap,
  UserRound,
  Users,
} from "lucide-react";
import KnowledgeArticleCard from "@/components/blog/KnowledgeArticleCard";
import {
  getAllAuthors,
  getAuthorBySlug,
  getPostsByAuthorSlug,
} from "@/lib/content";
import {
  buildAuthorProfileMetadata,
  buildAuthorProfileSchema,
  getAuthorUrl,
  SITE_URL,
} from "@/lib/content/seo";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const authors = await getAllAuthors();

  return authors.map((author) => ({
    slug: author.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const author = await getAuthorBySlug(params.slug);

  if (!author) {
    return {
      title: "Author Not Found",
      robots: { index: false, follow: false },
    };
  }

  return buildAuthorProfileMetadata(author);
}

export default async function AuthorProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const [author, posts] = await Promise.all([
    getAuthorBySlug(params.slug),
    getPostsByAuthorSlug(params.slug),
  ]);

  if (!author) {
    notFound();
  }

  const profileUrl = getAuthorUrl(author);
  const profileSchema = buildAuthorProfileSchema(author, posts);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL + "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Knowledge Center",
        item: SITE_URL + "/blog/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: author.schemaName,
        item: profileUrl,
      },
    ],
  };
  const AuthorIcon = author.entityType === "Person" ? UserRound : Users;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
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
                  {author.schemaName}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <header className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white">
          <div className="container-main px-4 py-14 md:py-20">
            <div className="max-w-4xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                <AuthorIcon className="h-8 w-8 text-primary-100" aria-hidden="true" />
              </div>
              <p className="mt-6 text-sm font-semibold text-primary-200">
                Tatkal Claims author
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                {author.schemaName}
              </h1>
              {author.role && (
                <p className="mt-4 inline-flex items-center gap-2 text-base font-semibold text-primary-100">
                  <BadgeCheck className="h-5 w-5" aria-hidden="true" />
                  {author.role}
                </p>
              )}
              {author.bio && (
                <p className="mt-6 max-w-3xl text-lg leading-8 text-primary-100 md:text-xl">
                  {author.bio}
                </p>
              )}
              <div className="mt-7 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
                  <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
                  {posts.length} {posts.length === 1 ? "article" : "articles"}
                </span>
                {author.linkedin && (
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 font-semibold transition hover:bg-white/15"
                  >
                    LinkedIn
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {(author.credentials?.length || author.entityType === "Organization") && (
          <section className="border-b border-slate-200 bg-slate-50/70">
            <div className="container-main px-4 py-8">
              <div className="max-w-4xl">
                {author.credentials?.length ? (
                  <>
                    <p className="text-sm font-semibold text-accent-600">
                      Credentials
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {author.credentials.map((credential) => (
                        <span
                          key={credential}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
                        >
                          <GraduationCap
                            className="h-4 w-4 text-primary-700"
                            aria-hidden="true"
                          />
                          {credential}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="max-w-3xl text-sm leading-6 text-slate-600">
                    This is a Tatkal Claims team author profile. It represents the
                    named editorial or claims-review team rather than an invented
                    individual identity.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="container-main px-4 py-14 md:py-20">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold text-accent-600">
              Author archive
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Articles by {author.schemaName}
            </h2>
            <p className="mt-3 text-lg leading-7 text-slate-600">
              Published guidance, explainers, judgments, news, and regulatory
              updates attributed to this Tatkal Claims author profile.
            </p>
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
                This author profile is published, but no public articles are
                currently attributed to it.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
