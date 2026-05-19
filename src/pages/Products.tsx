import Navbar3D from "@/components/three-d/Navbar3D";
import Footer3D from "@/components/three-d/Footer3D";
import ProductsStackSection from "@/components/landing/ProductsStackSection";

export default function Products() {
  return (
    <main className="min-h-screen bg-[#0C0C0C]" style={{ overflowX: "clip" }}>
      <Navbar3D />
      <ProductsStackSection />
      <div className="relative z-30 bg-[#0C0C0C]">
        <Footer3D />
      </div>
    </main>
  );
}

