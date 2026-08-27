import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description: "Optional. Falls back to the article title.",
      validation: (Rule) =>
        Rule.max(60).warning("Aim for about 60 characters or fewer in search results."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      description: "Optional. Falls back to the article excerpt.",
      validation: (Rule) =>
        Rule.max(160).warning("Aim for about 160 characters or fewer in search results."),
    }),
    defineField({
      name: "canonicalOverride",
      title: "Canonical override",
      type: "url",
      description:
        "Advanced only. Leave empty to use https://tatkalclaims.com/blog/[slug]/.",
    }),
    defineField({
      name: "noIndex",
      title: "No index",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "noFollow",
      title: "No follow",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "ogTitle",
      title: "Open Graph title",
      type: "string",
    }),
    defineField({
      name: "ogDescription",
      title: "Open Graph description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
