import { defineField, defineType } from "sanity";

export const sourceCitation = defineType({
  name: "sourceCitation",
  title: "Source / citation",
  type: "object",
  fields: [
    defineField({
      name: "sourceName",
      title: "Source name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sourceTitle",
      title: "Source title",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publicationDate",
      title: "Publication date",
      type: "date",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 3,
    }),
  ],
});
