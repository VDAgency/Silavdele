import HeroSection from "@/components/HeroSection";
import WhyTelegramSection from "@/components/WhyTelegramSection";
import ProgramSection from "@/components/ProgramSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <WhyTelegramSection />
      <ProgramSection />
      <PricingSection />
      <TestimonialsSection />
      <AboutSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
