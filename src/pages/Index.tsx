import HeroSection from "@/components/landing/HeroSection";
import MarqueeSection from "@/components/landing/MarqueeSection";
import AboutBlockSection from "@/components/landing/AboutBlockSection";
import ServicesSection from "@/components/landing/ServicesSection";
import ProductsStackSection from "@/components/landing/ProductsStackSection";
import Footer3D from "@/components/three-d/Footer3D";

const Index = () => {
  return (
    <main className="min-h-screen bg-[#0C0C0C]" style={{ overflowX: "clip" }}>
      <HeroSection />
      <MarqueeSection />
      <AboutBlockSection />
      <ServicesSection />
      <ProductsStackSection />
      <div className="relative z-30 bg-[#0C0C0C]">
        <Footer3D />
      </div>
    </main>
  );
};

export default Index;
