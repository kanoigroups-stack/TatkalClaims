import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ProcessSection from "@/components/sections/ProcessSection";
import TrustSection from "@/components/sections/TrustSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import KnowledgeSection from "@/components/sections/KnowledgeSection";
import CTABannerSection from "@/components/sections/CTABannerSection";
import FAQSection from "@/components/sections/FAQSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <TrustSection />
      <TestimonialsSection />
      <KnowledgeSection />
      <CTABannerSection />
      <FAQSection />
    </>
  );
}
