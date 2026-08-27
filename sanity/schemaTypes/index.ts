import { article } from "./documents/article";
import { author } from "./documents/author";
import { category } from "./documents/category";
import { topic } from "./documents/topic";
import { articleChart } from "./objects/articleChart";
import { articleCta } from "./objects/articleCta";
import { articleImage } from "./objects/articleImage";
import { articleTable } from "./objects/articleTable";
import { expertNote } from "./objects/expertNote";
import { faqBlock } from "./objects/faqBlock";
import { importantRule } from "./objects/importantRule";
import { keyTakeaway } from "./objects/keyTakeaway";
import { portableText } from "./objects/portableText";
import { seo } from "./objects/seo";
import { sourceCitation } from "./objects/sourceCitation";
import { warningBlock } from "./objects/warningBlock";

export const schemaTypes = [
  article,
  author,
  category,
  topic,
  seo,
  portableText,
  articleImage,
  articleTable,
  articleChart,
  keyTakeaway,
  importantRule,
  expertNote,
  warningBlock,
  faqBlock,
  sourceCitation,
  articleCta,
];
