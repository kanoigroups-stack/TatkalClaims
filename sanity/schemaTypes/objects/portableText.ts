import { defineField, defineType } from "sanity";

export const portableText = defineType({
  name: "portableText",
  title: "Article body",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (Rule) =>
                  Rule.uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              }),
            ],
          },
        ],
      },
    },
    { type: "articleImage" },
    { type: "articleTable" },
    { type: "articleChart" },
    { type: "keyTakeaway" },
    { type: "importantRule" },
    { type: "expertNote" },
    { type: "warningBlock" },
    { type: "faqBlock" },
    { type: "sourceCitation" },
    { type: "articleCta" },
  ],
});
