import Navbar3D from "@/components/three-d/Navbar3D";
import Footer3D from "@/components/three-d/Footer3D";
import FadeIn from "@/components/three-d/FadeIn";
import ContactButton from "@/components/three-d/ContactButton";
import ProductsStackSection from "@/components/landing/ProductsStackSection";

export default function Products() {
  return (
    <main className="min-h-screen bg-[#0C0C0C]" style={{ overflowX: "clip" }}>
      <Navbar3D />

      <section className="px-6 md:px-10 pt-16 md:pt-24 pb-10 text-center">
        <FadeIn delay={0.1} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none" style={{ fontSize: "clamp(3rem, 14vw, 200px)" }}>
            Toolcraft
          </h1>
        </FadeIn>
        <FadeIn delay={0.3} y={20}>
          <p className="mt-6 text-[#D7E2EA]/70 max-w-2xl mx-auto font-light uppercase tracking-wide" style={{ fontSize: "clamp(0.85rem, 1.4vw, 1.25rem)" }}>
            From AI-powered creative suites to automated blogging platforms — tools that eliminate friction and supercharge your workflow.
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <div className="mt-8 flex justify-center">
            <ContactButton label="Start a Project" />
          </div>
        </FadeIn>
      </section>

      <ProductsStackSection />

      <Footer3D />
    </main>
  );
}
