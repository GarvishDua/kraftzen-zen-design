import Navbar3D from "@/components/three-d/Navbar3D";
import FadeIn from "@/components/three-d/FadeIn";
import Magnet from "@/components/three-d/Magnet";
import ContactButton from "@/components/three-d/ContactButton";
import hero3d from "@/assets/hero-3d.png";

export default function HeroSection() {
  return (
    <section className="h-screen flex flex-col bg-[#0C0C0C] relative" style={{ overflowX: "clip" }}>
      <FadeIn delay={0} y={-20} duration={0.6}>
        <Navbar3D />
      </FadeIn>

      <div className="flex-1 flex flex-col justify-between relative">
        {/* Heading */}
        <div className="overflow-hidden mt-6 sm:mt-4 md:-mt-5 px-2">
          <FadeIn delay={0.15} y={40}>
            <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center" style={{ fontSize: "clamp(3rem, 16vw, 17.5vw)" }}>
              Kraftzen
            </h1>
          </FadeIn>
        </div>

        {/* Portrait */}
        <Magnet padding={150} strength={3} className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 z-10">
          <FadeIn delay={0.6} y={30}>
            <img
              src={hero3d}
              alt="Kraftzen — 3D zen sphere centerpiece"
              loading="eager"
              // @ts-ignore
              fetchPriority="high"
              width={520}
              height={520}
              className="w-[260px] sm:w-[340px] md:w-[420px] lg:w-[500px] h-auto drop-shadow-2xl select-none pointer-events-none"
            />
          </FadeIn>
        </Magnet>

        {/* Bottom bar */}
        <div className="flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 relative z-20">
          <FadeIn delay={0.35} y={20}>
            <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[280px]" style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}>
              Advanced AI toolcraft engineered to eliminate workflow chaos
            </p>
          </FadeIn>
          <FadeIn delay={0.5} y={20}>
            <ContactButton label="Get in Touch" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
