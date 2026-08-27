import { defineField, defineType } from "sanity";

export const keyTakeaway = defineType({
  name: "keyTakeaway",
  title: "Key takeaway",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Key takeaway",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
  ],
});
