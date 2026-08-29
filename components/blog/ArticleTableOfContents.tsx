import type { ArticleHeading } from "@/lib/content/article-navigation";

function TocLinks({ headings }: { headings: ArticleHeading[] }) {
  return (
    <ol className="space-y-2.5">
      {headings.map((heading) => (
        <li key={heading.key}>
          <a
            href={"#" + heading.id}
            className={
              "block text-sm leading-5 text-slate-600 transition-colors hover:text-primary-700 " +
              (heading.level === 3 ? "pl-4" : "font-medium")
            }
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function ArticleTableOfContents({
  headings,
}: {
  headings: ArticleHeading[];
}) {
  if (headings.length < 2) return null;

  return (
    <>
      <details className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:hidden">
        <summary className="cursor-pointer font-semibold text-slate-900">
          On this page
          <span className="ml-2 text-sm font-normal text-slate-500">
            ({headings.length} sections)
          </span>
        </summary>
        <nav aria-label="Article table of contents" className="mt-4 max-h-80 overflow-y-auto pr-2">
          <TocLinks headings={headings} />
        </nav>
      </details>

      <aside className="hidden lg:block">
        <div className="sticky top-28 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="font-semibold text-slate-900">On this page</p>
          <nav
            aria-label="Article table of contents"
            className="mt-4 max-h-[calc(100vh-11rem)] overflow-y-auto pr-2"
          >
            <TocLinks headings={headings} />
          </nav>
        </div>
      </aside>
    </>
  );
}
