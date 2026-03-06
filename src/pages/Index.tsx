import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import WhatWeDoSection from "@/components/landing/WhatWeDoSection";
import BroAISection from "@/components/landing/BroAISection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FounderSection from "@/components/landing/FounderSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <WhatWeDoSection />
      <BroAISection />
      <TestimonialsSection />
      <FounderSection />
      <Footer />
    </div>
  );
};

export default Index;
