import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "entityType",
      title: "Structured data entity type",
      type: "string",
      options: {
        list: [
          { title: "Person", value: "Person" },
          { title: "Organization / team", value: "Organization" },
        ],
        layout: "radio",
      },
      description:
        "Optional. Used for author structured data. Legacy authors use a conservative frontend fallback until this is set.",
    }),
    defineField({
      name: "schemaName",
      title: "Structured data name",
      type: "string",
      description:
        "Optional. Use the clean person or organization name without a role/title suffix. The visible byline remains unchanged.",
    }),
    defineField({
      name: "role",
      title: "Role / job title",
      type: "string",
    }),
    defineField({
      name: "credentials",
      title: "Credentials",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn",
      type: "url",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "image",
    },
  },
});
