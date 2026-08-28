import { preferDraftArticleDocuments } from "../lib/content/sanity-preview";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const published = {
  _id: "article-phase8-preview-test",
  slug: "phase8-preview-test",
  title: "Published title",
  excerpt: "Published excerpt",
  publishedAt: "2026-08-28T00:00:00.000Z",
  legacyOrder: 10,
  body: [
    {
      _type: "block",
      _key: "heading",
      style: "h2",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "published-span",
          text: "The Myth That Could Cost You Your Claim",
          marks: [],
        },
      ],
    },
  ],
};

const draft = {
  ...published,
  _id: "drafts.article-phase8-preview-test",
  title: "Draft title",
  body: [
    {
      _type: "block",
      _key: "heading",
      style: "h2",
      markDefs: [
        {
          _type: "link",
          _key: "a67ee63b4042",
          href: "https://tatkalclaims.com/blog/linked-article/",
        },
      ],
      children: [
        {
          _type: "span",
          _key: "draft-span-1",
          text: "The",
          marks: ["a67ee63b4042"],
        },
        {
          _type: "span",
          _key: "draft-span-2",
          text: " Myth That Could Cost You Your Claim",
          marks: [],
        },
      ],
    },
  ],
};

const publishedOnly = {
  ...published,
  _id: "article-published-only",
  slug: "published-only",
  title: "Published only",
  legacyOrder: 11,
};

const releaseVersion = {
  ...draft,
  _id: "versions.release-test.article-phase8-preview-test",
  title: "Release version must not override draft preview",
};

const selected = preferDraftArticleDocuments(
  [published, releaseVersion, publishedOnly, draft] as any
);

assert(selected.length === 2, "Preview selection did not deduplicate document variants");
assert(
  selected[0]._id === "drafts.article-phase8-preview-test",
  "Preview did not prefer the draft document over the published twin"
);
assert(
  selected[0].title === "Draft title",
  "Preview selected published article fields instead of draft fields"
);

const linkedHeading = (selected[0].body as any[])[0];
assert(
  linkedHeading.markDefs?.[0]?._key === "a67ee63b4042" &&
    linkedHeading.children?.[0]?.marks?.[0] === "a67ee63b4042",
  "Preview draft selection lost the Portable Text link annotation"
);
assert(
  selected[1]._id === "article-published-only",
  "Preview did not fall back to a published document when no draft exists"
);

console.log("Sanity raw preview selection prefers drafts and preserves link marks.");
