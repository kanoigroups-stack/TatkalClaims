"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  BookOpen,
  Search,
  X,
} from "lucide-react";
import KnowledgeArticleCard, {
  type KnowledgeArticleSummary,
} from "./KnowledgeArticleCard";

const PAGE_SIZE = 12;

type TopicAwareKnowledgeArticleSummary = KnowledgeArticleSummary & {
  topics: string[];
};

export default function KnowledgeCentreBrowser({
  articles,
  children,
}: {
  articles: TopicAwareKnowledgeArticleSummary[];
  children: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const article of articles) {
      counts.set(article.category, (counts.get(article.category) || 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [articles]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return articles.filter((article) => {
      const categoryMatch =
        category === "all" || article.category === category;
      const searchMatch =
        !normalized ||
        [
          article.title,
          article.excerpt,
          article.category,
          article.author,
          ...article.topics,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      return categoryMatch && searchMatch;
    });
  }, [articles, category, query]);

  function resetVisibleCount() {
    setVisibleCount(PAGE_SIZE);
  }

  function clearFilters() {
    setQuery("");
    setCategory("all");
    resetVisibleCount();
  }

  const hasFilters =
    query.trim().length > 0 ||
    category !== "all";
  const shown = Math.min(visibleCount, filtered.length);

  return (
    <>
      {children}

      <section
        id="article-library"
        className="container-main scroll-mt-24 px-4 py-14 md:py-20 font-body"
      >
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold text-primary-700">
              Full library
            </p>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl lg:text-5xl">
              Search all articles
            </h2>
            <p className="max-w-2xl text-lg text-slate-600 md:text-xl">
              Search by issue, insurer problem, ruling, or topic and narrow the
              library to the guidance most relevant to you.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <label className="relative block">
            <span className="sr-only">Search Knowledge Centre articles</span>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                resetVisibleCount();
              }}
              placeholder="Search claim rejection, IRDAI, health, motor, life, rulings..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100"
            />
          </label>

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-slate-600">
              Article type
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setCategory("all");
                  resetVisibleCount();
                }}
                className={
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition " +
                  (category === "all"
                    ? "border-primary-800 bg-primary-800 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:text-primary-800")
                }
                aria-pressed={category === "all"}
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                All articles
              </button>

              {categories.map((item) => {
                const active = category === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setCategory(item.name);
                      resetVisibleCount();
                    }}
                    className={
                      "rounded-full border px-4 py-2 text-sm font-medium transition " +
                      (active
                        ? "border-primary-800 bg-primary-800 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:text-primary-800")
                    }
                    aria-pressed={active}
                  >
                    {item.name === "News" ? "News & Updates" : item.name}
                    <span className="ml-1.5 text-xs opacity-70">{item.count}</span>
                  </button>
                );
              })}
            </div>
          </div>



          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-900"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
            <h3 className="text-xl font-bold text-slate-900">
              No articles found
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Try a broader search or clear one of the filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="btn-secondary mt-6"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article, index) => (
                <div
                  key={article.slug}
                  className={index < visibleCount ? "h-full" : "hidden"}
                >
                  <KnowledgeArticleCard article={article} />
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
              <p className="text-sm text-slate-500">
                Showing {shown} of {filtered.length} articles
              </p>
              {visibleCount < filtered.length && (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((current) => current + PAGE_SIZE)
                  }
                  className="btn-secondary"
                >
                  Show more articles
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}
