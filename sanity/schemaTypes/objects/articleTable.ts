import { defineField, defineType } from "sanity";

export const articleTable = defineType({
  name: "articleTable",
  title: "Table",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Table title",
      type: "string",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "hasHeaderRow",
      title: "First row is a header",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        {
          name: "tableRow",
          title: "Row",
          type: "object",
          fields: [
            defineField({
              name: "cells",
              title: "Cells",
              type: "array",
              of: [{ type: "string" }],
              validation: (Rule) => Rule.min(1),
            }),
          ],
          preview: {
            select: { cells: "cells" },
            prepare({ cells }) {
              return {
                title: Array.isArray(cells) ? cells.join(" | ") : "Table row",
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
});
