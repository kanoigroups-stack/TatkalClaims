import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";

type Props = {
  value: unknown[];
};

export const PORTABLE_TEXT_RENDERER_COVERAGE = {
  blockStyles: ["normal", "h2", "h3", "blockquote", "hr"] as const,
  listItems: ["bullet", "number"] as const,
  marks: ["strong", "em", "link"] as const,
  customTypes: [
    "articleImage",
    "articleTable",
    "articleChart",
    "keyTakeaway",
    "importantRule",
    "expertNote",
    "warningBlock",
    "faqBlock",
    "sourceCitation",
    "articleCta",
  ] as const,
};

function imageUrl(value: any) {
  if (value?.externalUrl) return value.externalUrl;

  if (value?.image) {
    try {
      return urlFor(value.image).width(1400).fit("max").url();
    } catch {
      return "";
    }
  }

  return "";
}

function renderTableCell(cell: string) {
  const parts = cell.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

const components: any = {
  block: {
    normal: ({ children }: any) => (
      <p className="mb-5 text-slate-700 leading-8">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="mt-12 mb-5 text-2xl md:text-3xl font-bold text-slate-900 scroll-mt-24">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="mt-9 mb-4 text-xl md:text-2xl font-semibold text-slate-900 scroll-mt-24">
        {children}
      </h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-7 border-l-4 border-primary-600 bg-slate-50 px-5 py-4 text-slate-700 italic">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-10 border-slate-200" />,
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="mb-6 list-disc space-y-2 pl-6 text-slate-700">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="mb-6 list-decimal space-y-2 pl-6 text-slate-700">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li className="leading-7">{children}</li>,
    number: ({ children }: any) => <li className="leading-7">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-slate-900">{children}</strong>
    ),
    em: ({ children }: any) => <em>{children}</em>,
    link: ({ children, value }: any) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const external = /^https?:\/\//.test(href);

      return (
        <a
          href={href}
          className="font-medium text-primary-700 underline underline-offset-2 hover:text-primary-800"
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    articleImage: ({ value }: any) => {
      const src = imageUrl(value);
      if (!src) return null;

      return (
        <figure
          className={
            value?.displaySize === "full"
              ? "my-10"
              : value?.displaySize === "wide"
              ? "my-10 md:-mx-12"
              : "my-8"
          }
        >
          <img
            src={src}
            alt={value?.alt || ""}
            className="w-full rounded-2xl border border-slate-200 object-cover"
            loading="lazy"
          />
          {(value?.caption || value?.credit) && (
            <figcaption className="mt-2 text-sm text-slate-500">
              {value?.caption}
              {value?.caption && value?.credit ? " · " : ""}
              {value?.credit}
            </figcaption>
          )}
        </figure>
      );
    },
    articleTable: ({ value }: any) => {
      const rows = Array.isArray(value?.rows) ? value.rows : [];
      if (!rows.length) return null;

      const headerRow = value?.hasHeaderRow ? rows[0] : null;
      const bodyRows = value?.hasHeaderRow ? rows.slice(1) : rows;

      return (
        <figure className="my-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {value?.title && (
            <div className="border-b border-slate-200 px-5 py-4 font-semibold text-slate-900">
              {value.title}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              {headerRow && (
                <thead className="bg-slate-100 text-slate-900">
                  <tr>
                    {(headerRow.cells || []).map((cell: string, index: number) => (
                      <th
                        key={index}
                        scope="col"
                        className="border-b border-slate-200 px-4 py-3 font-semibold"
                      >
                        {renderTableCell(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {bodyRows.map((row: any, rowIndex: number) => (
                  <tr key={row?._key || rowIndex} className="border-b border-slate-100 last:border-b-0">
                    {(row?.cells || []).map((cell: string, cellIndex: number) => (
                      <td key={cellIndex} className="px-4 py-3 align-top text-slate-700">
                        {renderTableCell(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {value?.caption && (
            <figcaption className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    articleChart: ({ value }: any) => {
      const data = Array.isArray(value?.data) ? value.data : [];

      return (
        <figure className="my-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4">
            <p className="font-semibold text-slate-900">{value?.title || "Chart"}</p>
            {value?.description && (
              <p className="mt-1 text-sm text-slate-600">{value.description}</p>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="pb-2 pr-6 font-medium">Label</th>
                  <th className="pb-2 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {data.map((point: any, index: number) => (
                  <tr key={point?._key || index} className="border-t border-slate-200">
                    <td className="py-2 pr-6 text-slate-700">{point?.label}</td>
                    <td className="py-2 font-medium text-slate-900">
                      {point?.value}
                      {value?.unit ? " " + value.unit : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(value?.source || value?.sourceUrl) && (
            <figcaption className="mt-4 text-xs text-slate-500">
              Source:{" "}
              {value?.sourceUrl ? (
                <a
                  href={value.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {value?.source || value.sourceUrl}
                </a>
              ) : (
                value.source
              )}
            </figcaption>
          )}
        </figure>
      );
    },
    keyTakeaway: ({ value }: any) => (
      <aside className="my-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <p className="font-semibold text-primary-900">
          {value?.title || "Key takeaway"}
        </p>
        <p className="mt-2 leading-7 text-slate-700">{value?.body}</p>
      </aside>
    ),
    importantRule: ({ value }: any) => (
      <aside className="my-8 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="font-semibold text-slate-900">{value?.title}</p>
        <p className="mt-2 leading-7 text-slate-700">{value?.body}</p>
        {value?.source && (
          <p className="mt-3 text-xs text-slate-500">Source: {value.source}</p>
        )}
      </aside>
    ),
    expertNote: ({ value }: any) => (
      <aside className="my-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-semibold text-slate-900">
          {value?.title || "Tatkal Claims expert note"}
        </p>
        <p className="mt-2 leading-7 text-slate-700">{value?.body}</p>
      </aside>
    ),
    warningBlock: ({ value }: any) => (
      <aside className="my-8 rounded-2xl border border-amber-300 bg-amber-50 p-5">
        <p className="font-semibold text-amber-950">{value?.title || "Important"}</p>
        <p className="mt-2 leading-7 text-slate-700">{value?.body}</p>
      </aside>
    ),
    faqBlock: ({ value }: any) => {
      const items = Array.isArray(value?.items) ? value.items : [];

      return (
        <section className="my-10">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Frequently asked questions</h2>
          <div className="space-y-4">
            {items.map((item: any, index: number) => (
              <details
                key={item?._key || index}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <summary className="cursor-pointer font-semibold text-slate-900">
                  {item?.question}
                </summary>
                <div className="mt-4">
                  <PortableText
                    value={Array.isArray(item?.answer) ? item.answer : []}
                    components={components}
                  />
                </div>
              </details>
            ))}
          </div>
        </section>
      );
    },
    sourceCitation: ({ value }: any) => (
      <aside className="my-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <span className="font-semibold text-slate-800">Source: </span>
        {value?.url ? (
          <a
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {value?.sourceTitle || value?.sourceName || value.url}
          </a>
        ) : (
          value?.sourceTitle || value?.sourceName
        )}
        {value?.publicationDate ? " · " + value.publicationDate : ""}
      </aside>
    ),
    articleCta: ({ value }: any) => {
      const labels: Record<string, string> = {
        caseEvaluation: "Case evaluation",
        callExpert: "Call an expert",
        claimRejectionHelp: "Claim rejection help",
        claimDelayHelp: "Claim delay help",
        misSellingHelp: "Mis-selling help",
      };

      return (
        <aside className="my-10 rounded-2xl bg-primary-900 p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-200">
            Preview CTA
          </p>
          <p className="mt-2 text-xl font-bold">
            {labels[value?.ctaType] || "Tatkal Claims assistance"}
          </p>
          <p className="mt-2 text-sm text-primary-100">
            CTA presentation is controlled by the Next.js frontend, not by article HTML.
          </p>
        </aside>
      );
    },
  },
  unknownType: ({ value }: any) => (
    <aside className="my-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">
      Unsupported Portable Text block in preview: {value?._type || "unknown"}
    </aside>
  ),
};

export default function PortableArticleBody({ value }: Props) {
  return <PortableText value={value as any} components={components} />;
}
