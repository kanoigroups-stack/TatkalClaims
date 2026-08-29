import { defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "organization", title: "Organization" },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 120 },
      description:
        "Migrated article slugs are locked to protect existing public URLs. New article slugs may be generated from the title before publication.",
      readOnly: ({ document }) => typeof document?.legacyOrder === "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 4,
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contentType",
      title: "Content type",
      type: "string",
      group: "organization",
      options: {
        list: [
          { title: "Guide", value: "guide" },
          { title: "Explainer", value: "explainer" },
          { title: "News", value: "news" },
          { title: "Regulatory Update", value: "regulatoryUpdate" },
          { title: "Case Study", value: "caseStudy" },
          { title: "Judgment", value: "judgment" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      group: "organization",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      group: "organization",
      of: [{ type: "reference", to: [{ type: "topic" }] }],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      group: "organization",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredImage",
      title: "Featured image",
      type: "articleImage",
      group: "media",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "socialImage",
      title: "Social image",
      type: "articleImage",
      group: "media",
      description:
        "Optional. Used for Open Graph and Twitter sharing. If left blank, the featured image is used.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated at",
      type: "datetime",
      group: "content",
    }),
    defineField({
      name: "readingTimeMinutes",
      title: "Reading time (minutes)",
      type: "number",
      group: "content",
      description:
        "Migration-compatible value. The frontend may calculate this automatically for future articles.",
      validation: (Rule) => Rule.integer().min(1),
    }),
    defineField({
      name: "legacyOrder",
      title: "Migration order",
      type: "number",
      group: "settings",
      readOnly: true,
      description:
        "Internal migration parity field retained for historical ordering evidence and rollback verification. Do not use it as current editorial presentation logic.",
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "portableText",
      group: "content",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "settings",
      initialValue: false,
    }),
    defineField({
      name: "cornerstone",
      title: "Cornerstone content",
      type: "boolean",
      group: "settings",
      initialValue: false,
    }),
    defineField({
      name: "seo",
      title: "SEO settings",
      type: "seo",
      group: "seo",
    }),
    defineField({
      name: "relatedArticles",
      title: "Related articles (editorial override)",
      type: "array",
      group: "organization",
      of: [{ type: "reference", to: [{ type: "article" }] }],
    }),
    defineField({
      name: "monetization",
      title: "Monetization profile",
      type: "string",
      group: "settings",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Light", value: "light" },
          { title: "Standard", value: "standard" },
        ],
        layout: "radio",
      },
      initialValue: "none",
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Published date, newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Published date, oldest",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category.title",
      publishedAt: "publishedAt",
      media: "featuredImage.image",
    },
    prepare({ title, category, publishedAt, media }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString("en-IN")
        : "Unpublished";
      return {
        title,
        subtitle: [category, date].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
