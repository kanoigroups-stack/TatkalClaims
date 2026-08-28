"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  BadgeAlert,
  BookOpen,
  Clock3,
  HeartPulse,
  Newspaper,
  Search,
  ShieldX,
  X,
} from "lucide-react";
import KnowledgeArticleCard, {
  type KnowledgeArticleSummary,
} from "./KnowledgeArticleCard";

const PAGE_SIZE = 12;

type TypeFilter = "all" | "guides" | "news";

const CATEGORY_DETAILS: Record<
  string,
  { description: string; icon: typeof ShieldX }
> = {
  "Claim Rejection": {
    description: "Rejected claims, denial reasons, appeals and consumer rulings.",
    icon: ShieldX,
  },
  "Claim Delay": {
    description: "Settlement timelines, document delays and insurer obligations.",
    icon: Clock3,
  },
  "Mis-selling": {
    description: "Wrong policies, bank sales, dark patterns and complaint routes.",
    icon: BadgeAlert,
  },
  "Health Insurance": {
    description: "Cashless treatment, hospitalisation and health-claim problems.",
    icon: HeartPulse,
  },
  News: {
    description: "IRDAI, courts, policy changes and insurance developments.",
    icon: Newspaper,
  },
};

function matchesType(article: KnowledgeArticleSummary, filter: TypeFilter) {
  if (filter === "all") return true;
  const newsLike =
    article.contentType === "news" ||
    article.contentType === "regulatoryUpdate";
  return filter === "news" ? newsLike : !newsLike;
}

export default function KnowledgeCentreBrowser({
  articles,
  children,
}: {
  articles: KnowledgeArticleSummary[];
  children: ReactNode;
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

  function chooseCategory(name: string) {
    setCategory(name);
    setTypeFilter("all");
    setQuery("");
    resetVisibleCount();
    window.requestAnimationFrame(() => {
      document
        .getElementById("article-library")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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
    <>
      <section className="border-b border-slate-200 bg-slate-50 font-body">
        <div className="container-main px-4 py-12 md:py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary-700 mb-3">
              Browse by issue
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              What problem are you trying to solve?
            </h2>
            <p className="text-lg md:text-xl text-slate-600">
              Choose the issue closest to your situation. We will take you
              directly to the matching articles in the library.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((item) => {
              const details = CATEGORY_DETAILS[item.name] || {
                description: "Guidance and updates for policyholders.",
                icon: BookOpen,
              };
              const Icon = details.icon;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => chooseCategory(item.name)}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-primary-300 hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-800">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {item.count}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-900 transition-colors group-hover:text-primary-700">
                    {item.name === "News" ? "News & Updates" : item.name}
                  </h3>
                  <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-600">
                    {details.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {children}

      <section
        id="article-library"
        className="container-main scroll-mt-24 px-4 py-14 md:py-20 font-body"
      >
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary-700 mb-3">
              Full library
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Search all articles
            </h2>
            <p className="max-w-2xl text-lg md:text-xl text-slate-600">
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
                    {item.name === "News" ? "News & Updates" : item.name}
                    <span className="ml-1.5 text-xs opacity-70">
                      {item.count}
                    </span>
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
