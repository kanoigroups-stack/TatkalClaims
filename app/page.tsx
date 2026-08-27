import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ProcessSection from "@/components/sections/ProcessSection";
import TrustSection from "@/components/sections/TrustSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import KnowledgeSection from "@/components/sections/KnowledgeSection";
import CTABannerSection from "@/components/sections/CTABannerSection";
import FAQSection from "@/components/sections/FAQSection";
import { getAllPosts } from "@/lib/content";
import { getLiveContentSource } from "@/lib/content/live";

export const revalidate = 60;

export default async function Home() {
  const posts = await getAllPosts(getLiveContentSource());
  const knowledgeArticles = posts.slice(0, 3).map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    readTime: post.readTime,
    author: post.author,
    image: {
      url: post.image.url,
      alt: post.image.alt,
    },
  }));

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <TrustSection />
      <TestimonialsSection />
      <KnowledgeSection articles={knowledgeArticles} />
      <CTABannerSection />
      <FAQSection />
    </>
  );
}
