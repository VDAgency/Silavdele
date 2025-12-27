import Navbar from "../components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyTelegramSection from "@/components/WhyTelegramSection";
import ProgramSection from "@/components/ProgramSection";
import PricingSection from "@/components/PricingSection";
import TechSection from "@/components/TechSection";
import ChooseUsSection from "@/components/ChooseUsSection";
import ResultsSection from "@/components/ResultsSection";
// import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import BonusSection from "@/components/BonusSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <WhyTelegramSection />
      <ProgramSection />
      <AboutSection />
      <BonusSection />
      <PricingSection />
      <TechSection />
      <ChooseUsSection />
      <ResultsSection />
      { /* <TestimonialsSection /> */}
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
