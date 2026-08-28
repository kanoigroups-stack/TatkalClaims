"use client";

import { useMemo, useState } from "react";
import { BookOpen, Newspaper, Search, X } from "lucide-react";
import KnowledgeArticleCard, {
  type KnowledgeArticleSummary,
} from "./KnowledgeArticleCard";

const PAGE_SIZE = 12;

type TypeFilter = "all" | "guides" | "news";

function matchesType(article: KnowledgeArticleSummary, filter: TypeFilter) {
  if (filter === "all") return true;
  const newsLike =
    article.contentType === "news" ||
    article.contentType === "regulatoryUpdate";
  return filter === "news" ? newsLike : !newsLike;
}

export default function KnowledgeCentreBrowser({
  articles,
}: {
  articles: KnowledgeArticleSummary[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
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
      const typeMatch = matchesType(article, typeFilter);
      const searchMatch =
        !normalized ||
        [
          article.title,
          article.excerpt,
          article.category,
          article.author,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      return categoryMatch && typeMatch && searchMatch;
    });
  }, [articles, category, query, typeFilter]);

  function resetVisibleCount() {
    setVisibleCount(PAGE_SIZE);
  }

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setTypeFilter("all");
    resetVisibleCount();
  }

  const hasFilters =
    query.trim().length > 0 || category !== "all" || typeFilter !== "all";
  const shown = Math.min(visibleCount, filtered.length);

  return (
    <section className="container-main px-4 py-14 md:py-20">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
            Explore the library
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950 md:text-4xl">
            Find the guidance you need
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Search by issue, insurer problem, ruling, or topic and narrow the\n            library to the guidance most relevant to you.
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
            placeholder="Search claim rejection, IRDAI, health insurance, rulings..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100"
          />
        </label>

        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Content type
          </p>
          <div className="flex flex-wrap gap-2">
            {([
              ["all", "All content"],
              ["guides", "Guides & explainers"],
              ["news", "News & updates"],
            ] as const).map(([value, label]) => {
              const active = typeFilter === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setTypeFilter(value);
                    resetVisibleCount();
                  }}
                  className={
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition " +
                    (active
                      ? "border-primary-800 bg-primary-800 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:text-primary-800")
                  }
                  aria-pressed={active}
                >
                  {value === "news" ? (
                    <Newspaper className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                  )}
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Issue
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setCategory("all");
                resetVisibleCount();
              }}
              className={
                "rounded-full border px-4 py-2 text-sm font-medium transition " +
                (category === "all"
                  ? "border-primary-200 bg-primary-50 text-primary-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-primary-300")
              }
              aria-pressed={category === "all"}
            >
              All issues
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
                      ? "border-primary-200 bg-primary-50 text-primary-800"
                      : "border-slate-200 bg-white text-slate-700 hover:border-primary-300")
                  }
                  aria-pressed={active}
                >
                  {item.name}
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
          <h3 className="text-xl font-bold text-slate-900">No articles found</h3>
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
  );
}
