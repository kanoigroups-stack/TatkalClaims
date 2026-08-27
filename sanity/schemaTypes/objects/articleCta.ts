import { defineField, defineType } from "sanity";

export const articleCta = defineType({
  name: "articleCta",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({
      name: "ctaType",
      title: "CTA type",
      type: "string",
      options: {
        list: [
          { title: "Case evaluation", value: "caseEvaluation" },
          { title: "Call an expert", value: "callExpert" },
          { title: "Claim rejection help", value: "claimRejectionHelp" },
          { title: "Claim delay help", value: "claimDelayHelp" },
          { title: "Mis-selling help", value: "misSellingHelp" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
});
