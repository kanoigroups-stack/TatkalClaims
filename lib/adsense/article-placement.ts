type PortableItem = {
  _type?: string;
  style?: string;
};

export type ArticleAdBoundaries = {
  primary: number | null;
  secondary: number | null;
};

function isUnsafeNeighbour(body: PortableItem[], index: number) {
  const nearby = body.slice(Math.max(0, index - 2), index + 1);
  return nearby.some((item) => item?._type === "articleCta");
}

function pickBoundary(
  candidates: number[],
  target: number,
  minimum: number
) {
  const eligible = candidates.filter((index) => index >= minimum);
  if (!eligible.length) return null;

  return eligible.reduce((best, current) =>
    Math.abs(current - target) < Math.abs(best - target) ? current : best
  );
}

export function getArticleAdBoundaries(body: unknown[]): ArticleAdBoundaries {
  const items = body as PortableItem[];
  const length = items.length;

  if (length < 18) {
    return { primary: null, secondary: null };
  }

  const minimumStart = Math.max(6, Math.ceil(length * 0.2));
  const maximumEnd = length - Math.max(6, Math.ceil(length * 0.12));

  const candidates = items
    .map((item, index) => ({ item, index }))
    .filter(
      ({ item, index }) =>
        item?._type === "block" &&
        item?.style === "h2" &&
        index >= minimumStart &&
        index <= maximumEnd &&
        !isUnsafeNeighbour(items, index)
    )
    .map(({ index }) => index);

  if (!candidates.length) {
    return { primary: null, secondary: null };
  }

  const primary = pickBoundary(
    candidates,
    Math.round(length * 0.35),
    minimumStart
  );

  if (primary === null) {
    return { primary: null, secondary: null };
  }

  const secondary = pickBoundary(
    candidates.filter((index) => index >= primary + 8),
    Math.round(length * 0.68),
    primary + 8
  );

  return { primary, secondary };
}
