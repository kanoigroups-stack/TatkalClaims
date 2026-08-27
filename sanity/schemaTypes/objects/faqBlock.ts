import { defineField, defineType } from "sanity";

export const faqBlock = defineType({
  name: "faqBlock",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [
        {
          name: "faqItem",
          title: "FAQ item",
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "array",
              of: [
                {
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
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
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "question" },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
});
