import { defineField, defineType } from "sanity";

export const articleImage = defineType({
  name: "articleImage",
  title: "Article image",
  type: "object",
  validation: (Rule) =>
    Rule.custom((value: any) => {
      if (!value) return true;

      const hasUploadedImage = Boolean(value?.image?.asset?._ref);
      const hasExternalUrl = Boolean(value?.externalUrl);

      return hasUploadedImage || hasExternalUrl
        ? true
        : "Add an uploaded image or an external image URL.";
    }),
  fields: [
    defineField({
      name: "image",
      title: "Uploaded image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "externalUrl",
      title: "External image URL",
      type: "url",
      description:
        "Migration compatibility for existing remote images. New editorial images should normally be uploaded to Sanity.",
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description:
        "Describe the image for accessibility and search. Do not leave this blank.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "credit",
      title: "Credit",
      type: "string",
    }),
    defineField({
      name: "displaySize",
      title: "Display size",
      type: "string",
      options: {
        list: [
          { title: "Normal", value: "normal" },
          { title: "Wide", value: "wide" },
          { title: "Full width", value: "full" },
        ],
        layout: "radio",
      },
      initialValue: "normal",
    }),
  ],
});
