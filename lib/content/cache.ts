export const PUBLIC_REVALIDATE_SECONDS = 43_200;

export const SANITY_ARTICLE_SUMMARIES_TAG = "sanity:article-summaries";
export const SANITY_ARTICLES_FULL_TAG = "sanity:articles-full";
export const SANITY_AUTHORS_TAG = "sanity:authors";

export function getSanityArticleTag(slug: string) {
  return `sanity:article:${slug}`;
}

export function getSanityAuthorTag(slug: string) {
  return `sanity:author:${slug}`;
}
