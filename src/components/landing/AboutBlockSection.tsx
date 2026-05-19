import FadeIn from "@/components/three-d/FadeIn";
import AnimatedText from "@/components/three-d/AnimatedText";
import ContactButton from "@/components/three-d/ContactButton";
import leaf from "@/assets/decor/leaf.png";
import stones from "@/assets/decor/stones.png";
import orb from "@/assets/decor/orb.png";
import cluster from "@/assets/decor/cluster.png";

export default function AboutBlockSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 bg-[#0C0C0C] overflow-hidden">
      {/* Decor */}
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%]">
        <img src={leaf} alt="" loading="lazy" className="w-[120px] sm:w-[160px] md:w-[210px]" />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]">
        <img src={stones} alt="" loading="lazy" className="w-[100px] sm:w-[140px] md:w-[180px]" />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%]">
        <img src={orb} alt="" loading="lazy" className="w-[120px] sm:w-[160px] md:w-[210px]" />
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]">
        <img src={cluster} alt="" loading="lazy" className="w-[130px] sm:w-[170px] md:w-[220px]" />
      </FadeIn>

      <FadeIn delay={0} y={40} className="w-full flex flex-col items-center gap-10 sm:gap-14 md:gap-16 relative z-10">
        <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
          About Kraftzen
        </h2>
      </FadeIn>

      <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24 mt-10 sm:mt-14 md:mt-16 relative z-10">
        <AnimatedText
          text="We are a studio of engineers, designers, and dreamers building AI-first tools that bring clarity to creative chaos. With years of experience across automation, design, and machine learning, we craft platforms that feel intuitive yet deliver extraordinary results. Let's build something incredible together."
          className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[640px]"
        />
        <FadeIn delay={0.2}>
          <ContactButton label="Get in Touch" />
        </FadeIn>
      </div>
    </section>
  );
}
