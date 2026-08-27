import { defineField, defineType } from "sanity";

export const articleChart = defineType({
  name: "articleChart",
  title: "Chart",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Chart title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "chartType",
      title: "Chart type",
      type: "string",
      options: {
        list: [
          { title: "Bar", value: "bar" },
          { title: "Line", value: "line" },
          { title: "Pie", value: "pie" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "data",
      title: "Data",
      type: "array",
      of: [
        {
          name: "chartDataPoint",
          title: "Data point",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "number",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { label: "label", value: "value" },
            prepare({ label, value }) {
              return { title: `${label}: ${value}` };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "unit",
      title: "Unit",
      type: "string",
      description: "Examples: %, claims, days, INR crore.",
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
    }),
    defineField({
      name: "sourceUrl",
      title: "Source URL",
      type: "url",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 3,
    }),
  ],
});
