export type ArticleHeading = {
  id: string;
  key: string;
  text: string;
  level: 2 | 3;
};

type PortableBlock = {
  _key?: string;
  _type?: string;
  style?: string;
  children?: Array<{ text?: string }>;
};

function getBlockText(block: PortableBlock) {
  return (block.children || [])
    .map((child) => child?.text || "")
    .join("")
    .trim();
}

function slugifyHeading(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
}

export function buildArticleHeadingNavigation(body: unknown[]) {
  const counts = new Map<string, number>();
  const headings: ArticleHeading[] = [];
  const headingIds: Record<string, string> = {};

  body.forEach((item, index) => {
    const block = item as PortableBlock;
    if (
      block?._type !== "block" ||
      (block.style !== "h2" && block.style !== "h3")
    ) {
      return;
    }

    const text = getBlockText(block);
    if (!text) return;

    const base = slugifyHeading(text);
    const occurrence = (counts.get(base) || 0) + 1;
    counts.set(base, occurrence);

    const id = occurrence === 1 ? base : `${base}-${occurrence}`;
    const key = block._key || `heading-${index}`;

    headings.push({
      id,
      key,
      text,
      level: block.style === "h2" ? 2 : 3,
    });

    if (block._key) {
      headingIds[block._key] = id;
    }
  });

  return { headings, headingIds };
}
