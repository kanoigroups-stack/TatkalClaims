import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { formatDate } from "@/utils/date";

export type KnowledgeArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  contentType?: string;
  author: string;
  date: string;
  publishedAt: string;
  readTime: string;
  image: {
    url: string;
    alt: string;
    displaySize?: "normal" | "wide" | "full";
  };
};

export default function KnowledgeArticleCard({
  article,
  emphasis = false,
}: {
  article: KnowledgeArticleSummary;
  emphasis?: boolean;
}) {
  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white font-body shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <Link href={"/blog/" + article.slug + "/"} className="flex h-full flex-col">
        <div className="relative aspect-video overflow-hidden bg-slate-100">
          <Image
            src={article.image.url}
            alt={article.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={
              article.image.displaySize === "full"
                ? "object-contain"
                : "object-cover transition-transform duration-500 group-hover:scale-105"
            }
          />
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="mb-3">
            <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-800 ring-1 ring-inset ring-primary-200">
              {article.category}
            </span>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDate(article.date)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {article.readTime}
            </span>
          </div>

          <h3
            className={
              "font-bold text-slate-950 transition-colors group-hover:text-primary-700 " +
              (emphasis ? "text-xl leading-7" : "text-lg leading-6")
            }
          >
            {article.title}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
            {article.excerpt}
          </p>

          <div className="mt-auto flex items-center justify-between gap-4 pt-5">
            <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
              <User className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{article.author}</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-700">
              Read
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
