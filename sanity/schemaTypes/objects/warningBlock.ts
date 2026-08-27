import { defineField, defineType } from "sanity";

export const warningBlock = defineType({
  name: "warningBlock",
  title: "Warning",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Important",
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
