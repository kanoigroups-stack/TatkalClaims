import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { buildArticleHeadingNavigation } from "@/lib/content/article-navigation";

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

function formatChartValue(value: number, unit?: string) {
  return String(value) + (unit ? " " + unit : "");
}

function ChartVisual({ value }: { value: any }) {
  const data = Array.isArray(value?.data)
    ? value.data.filter((point: any) => Number.isFinite(point?.value))
    : [];

  if (!data.length) return null;

  const chartType = value?.chartType || "bar";
  const values = data.map((point: any) => Number(point.value));
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const palette = [
    "#1E3A8A",
    "#2563EB",
    "#F59E0B",
    "#0F766E",
    "#7C3AED",
    "#BE123C",
  ];

  if (chartType === "line") {
    const points = data
      .map((point: any, index: number) => {
        const x =
          data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
        const y = 45 - ((Number(point.value) - min) / range) * 40;
        return x + "," + y;
      })
      .join(" ");

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <svg
          viewBox="0 0 100 50"
          role="img"
          aria-label={value?.title || "Line chart"}
          className="h-56 w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <line x1="0" y1="45" x2="100" y2="45" stroke="#CBD5E1" strokeWidth="0.5" />
          <polyline
            points={points}
            fill="none"
            stroke="#1E3A8A"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {data.map((point: any, index: number) => {
            const x =
              data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
            const y = 45 - ((Number(point.value) - min) / range) * 40;
            return (
              <circle
                key={point?._key || index}
                cx={x}
                cy={y}
                r="1.4"
                fill="#F59E0B"
              />
            );
          })}
        </svg>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {data.map((point: any, index: number) => (
            <div
              key={point?._key || index}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="text-slate-600">{point?.label}</span>
              <span className="font-semibold text-slate-900">
                {formatChartValue(point.value, value?.unit)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (chartType === "pie" && values.every((item: number) => item >= 0)) {
    const total = values.reduce((sum: number, item: number) => sum + item, 0);
    let cursor = 0;
    const stops =
      total > 0
        ? data.map((point: any, index: number) => {
            const start = cursor;
            const end = cursor + (Number(point.value) / total) * 100;
            cursor = end;
            return `${palette[index % palette.length]} ${start}% ${end}%`;
          })
        : [];

    return (
      <div className="grid items-center gap-6 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-[180px_1fr]">
        <div
          className="mx-auto aspect-square w-40 rounded-full"
          role="img"
          aria-label={value?.title || "Pie chart"}
          style={{
            background:
              stops.length > 0
                ? "conic-gradient(" + stops.join(", ") + ")"
                : "#E2E8F0",
          }}
        />
        <div className="space-y-3">
          {data.map((point: any, index: number) => (
            <div
              key={point?._key || index}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2 text-slate-600">
                <span
                  className="h-3 w-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: palette[index % palette.length] }}
                  aria-hidden="true"
                />
                <span className="truncate">{point?.label}</span>
              </span>
              <span className="font-semibold text-slate-900">
                {formatChartValue(point.value, value?.unit)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const absoluteMax = Math.max(...values.map((item: number) => Math.abs(item)), 1);

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      {data.map((point: any, index: number) => (
        <div key={point?._key || index}>
          <div className="mb-1.5 flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-600">{point?.label}</span>
            <span className="font-semibold text-slate-900">
              {formatChartValue(point.value, value?.unit)}
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-primary-800"
              style={{
                width:
                  Math.max(
                    2,
                    (Math.abs(Number(point.value)) / absoluteMax) * 100
                  ) + "%",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function createComponents(headingIds: Record<string, string>) {
  let components: any;

  components = {
    block: {
      normal: ({ children }: any) => (
        <p className="mb-6 text-[17px] leading-8 text-slate-700 md:text-lg">
          {children}
        </p>
      ),
      h2: ({ children, value }: any) => (
        <h2
          id={value?._key ? headingIds[value._key] : undefined}
          className="mb-5 mt-12 scroll-mt-28 text-2xl font-bold text-slate-900 md:text-3xl"
        >
          {children}
        </h2>
      ),
      h3: ({ children, value }: any) => (
        <h3
          id={value?._key ? headingIds[value._key] : undefined}
          className="mb-4 mt-9 scroll-mt-28 text-xl font-semibold text-slate-900 md:text-2xl"
        >
          {children}
        </h3>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="my-8 rounded-r-xl border-l-4 border-primary-600 bg-slate-50 px-5 py-5 text-[17px] leading-8 text-slate-700 italic md:text-lg">
          {children}
        </blockquote>
      ),
      hr: () => <hr className="my-10 border-slate-200" />,
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="mb-7 list-disc space-y-2.5 pl-6 text-[17px] text-slate-700 md:text-lg">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="mb-7 list-decimal space-y-2.5 pl-6 text-[17px] text-slate-700 md:text-lg">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => <li className="leading-8">{children}</li>,
      number: ({ children }: any) => <li className="leading-8">{children}</li>,
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
            className="font-medium text-primary-700 underline decoration-primary-300 underline-offset-2 hover:text-primary-800"
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
                ? "my-10 lg:-mx-24"
                : value?.displaySize === "wide"
                ? "my-10 md:-mx-12"
                : "my-9"
            }
          >
            <img
              src={src}
              alt={value?.alt || ""}
              className="w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
              loading="lazy"
            />
            {(value?.caption || value?.credit) && (
              <figcaption className="mt-2.5 text-sm leading-5 text-slate-500">
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
          <figure className="my-9 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {value?.title && (
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 font-semibold text-slate-900">
                {value.title}
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                {headerRow && (
                  <thead className="bg-slate-100 text-slate-900">
                    <tr>
                      {(headerRow.cells || []).map(
                        (cell: string, index: number) => (
                          <th
                            key={index}
                            scope="col"
                            className="border-b border-slate-200 px-4 py-3 font-semibold"
                          >
                            {renderTableCell(cell)}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {bodyRows.map((row: any, rowIndex: number) => (
                    <tr
                      key={row?._key || rowIndex}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      {(row?.cells || []).map(
                        (cell: string, cellIndex: number) => (
                          <td
                            key={cellIndex}
                            className="px-4 py-3 align-top leading-6 text-slate-700"
                          >
                            {renderTableCell(cell)}
                          </td>
                        )
                      )}
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
        if (!data.length) return null;

        return (
          <figure className="my-9 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
            <div className="mb-5">
              <p className="text-lg font-bold text-slate-900">
                {value?.title || "Chart"}
              </p>
              {value?.description && (
                <p className="mt-1.5 text-sm leading-6 text-slate-600">
                  {value.description}
                </p>
              )}
            </div>

            <ChartVisual value={value} />

            {(value?.source || value?.sourceUrl || value?.notes) && (
              <figcaption className="mt-4 text-xs leading-5 text-slate-500">
                {(value?.source || value?.sourceUrl) && (
                  <>
                    Source:{" "}
                    {value?.sourceUrl ? (
                      <a
                        href={value.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                      >
                        {value?.source || value.sourceUrl}
                      </a>
                    ) : (
                      value.source
                    )}
                  </>
                )}
                {value?.notes && (
                  <span className="block mt-1">{value.notes}</span>
                )}
              </figcaption>
            )}

            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-primary-700">
                View chart data
              </summary>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500">
                      <th className="pb-2 pr-6 font-medium">Label</th>
                      <th className="pb-2 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((point: any, index: number) => (
                      <tr
                        key={point?._key || index}
                        className="border-t border-slate-200"
                      >
                        <td className="py-2 pr-6 text-slate-700">
                          {point?.label}
                        </td>
                        <td className="py-2 font-medium text-slate-900">
                          {formatChartValue(point?.value, value?.unit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </figure>
        );
      },
      keyTakeaway: ({ value }: any) => (
        <aside className="my-9 rounded-2xl border border-primary-200 bg-primary-50 p-5 md:p-6">
          <p className="font-semibold text-primary-900">
            {value?.title || "Key takeaway"}
          </p>
          <p className="mt-2 text-[17px] leading-7 text-slate-700">
            {value?.body}
          </p>
        </aside>
      ),
      importantRule: ({ value }: any) => (
        <aside className="my-9 rounded-2xl border border-blue-200 bg-blue-50 p-5 md:p-6">
          <p className="font-semibold text-slate-900">{value?.title}</p>
          <p className="mt-2 text-[17px] leading-7 text-slate-700">
            {value?.body}
          </p>
          {value?.source && (
            <p className="mt-3 text-xs text-slate-500">
              Source:{" "}
              {value?.sourceUrl ? (
                <a
                  href={value.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  {value.source}
                </a>
              ) : (
                value.source
              )}
            </p>
          )}
        </aside>
      ),
      expertNote: ({ value }: any) => (
        <aside className="my-9 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 md:p-6">
          <p className="font-semibold text-slate-900">
            {value?.title || "Tatkal Claims expert note"}
          </p>
          <p className="mt-2 text-[17px] leading-7 text-slate-700">
            {value?.body}
          </p>
        </aside>
      ),
      warningBlock: ({ value }: any) => (
        <aside className="my-9 rounded-2xl border border-amber-300 bg-amber-50 p-5 md:p-6">
          <p className="font-semibold text-amber-950">
            {value?.title || "Important"}
          </p>
          <p className="mt-2 text-[17px] leading-7 text-slate-700">
            {value?.body}
          </p>
        </aside>
      ),
      faqBlock: ({ value }: any) => {
        const items = Array.isArray(value?.items) ? value.items : [];

        return (
          <section className="my-10">
            <h2 className="mb-5 text-2xl font-bold text-slate-900">
              Frequently asked questions
            </h2>
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
        <aside className="my-7 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          <span className="font-semibold text-slate-800">Source: </span>
          {value?.url ? (
            <a
              href={value.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              {value?.sourceTitle || value?.sourceName || value.url}
            </a>
          ) : (
            value?.sourceTitle || value?.sourceName
          )}
          {value?.publicationDate ? " · " + value.publicationDate : ""}
          {value?.notes && (
            <span className="mt-1 block text-xs">{value.notes}</span>
          )}
        </aside>
      ),
      articleCta: ({ value }: any) => {
        const labels: Record<string, string> = {
          caseEvaluation: "Get your claim reviewed",
          callExpert: "Speak with an insurance claim expert",
          claimRejectionHelp: "Get help with a rejected claim",
          claimDelayHelp: "Get help with a delayed claim",
          misSellingHelp: "Get help with insurance mis-selling",
        };

        const descriptions: Record<string, string> = {
          caseEvaluation:
            "Tell us what happened and our team will review the issue with you.",
          callExpert:
            "Discuss your situation with the Tatkal Claims team and understand the next practical step.",
          claimRejectionHelp:
            "If your insurer has rejected the claim, we can help you review the reason and available dispute routes.",
          claimDelayHelp:
            "If your settlement is being delayed, we can help you understand the applicable process and escalation options.",
          misSellingHelp:
            "If a policy was sold under misleading or unsuitable terms, we can help you assess the complaint path.",
        };

        const key = value?.ctaType || "caseEvaluation";

        return (
          <aside className="my-10 rounded-2xl bg-primary-900 p-6 text-white md:p-7">
            <p className="text-xl font-bold">
              {labels[key] || "Get help with your insurance dispute"}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-primary-100">
              {descriptions[key] ||
                "Our team can help you understand the next practical step."}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#contact-form"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary-900 transition hover:bg-primary-50"
              >
                Get Free Case Evaluation
              </Link>
              <a
                href="tel:+917207382073"
                className="inline-flex items-center justify-center rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Call Our Experts
              </a>
            </div>
          </aside>
        );
      },
    },
    unknownType: () => null,
  };

  return components;
}

export default function PortableArticleBody({ value }: Props) {
  const { headingIds } = buildArticleHeadingNavigation(value);

  return (
    <PortableText
      value={value as any}
      components={createComponents(headingIds)}
    />
  );
}
