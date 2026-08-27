import { defineField, defineType } from "sanity";

export const expertNote = defineType({
  name: "expertNote",
  title: "Expert note",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Tatkal Claims expert note",
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
