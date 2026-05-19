import Navbar3D from "@/components/three-d/Navbar3D";
import Footer3D from "@/components/three-d/Footer3D";
import FadeIn from "@/components/three-d/FadeIn";
import AnimatedText from "@/components/three-d/AnimatedText";
import ContactButton from "@/components/three-d/ContactButton";
import Magnet from "@/components/three-d/Magnet";
import founderPhoto from "@/assets/founder-garv.jpeg";

const values = [
  { n: "01", name: "Innovation First", desc: "We push boundaries with AI-driven solutions that redefine how teams work and create." },
  { n: "02", name: "Human-Centered", desc: "Technology should serve people. Every tool we build starts with empathy and ends with impact." },
  { n: "03", name: "Trust & Transparency", desc: "We believe in honest products, clear communication, and respect for our users' data and time." },
  { n: "04", name: "Relentless Efficiency", desc: "Eliminating friction is our obsession. We craft workflows that feel effortless." },
];

export default function About() {
  return (
    <main className="min-h-screen bg-[#0C0C0C]" style={{ overflowX: "clip" }}>
      <Navbar3D />

      <section className="px-6 md:px-10 pt-16 md:pt-20 pb-16 text-center">
        <FadeIn delay={0.1} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none" style={{ fontSize: "clamp(3rem, 14vw, 200px)" }}>
            About Us
          </h1>
        </FadeIn>
      </section>

      <section className="px-6 md:px-10 py-16 max-w-3xl mx-auto">
        <AnimatedText
          text="Kraftzen is a studio of engineers, designers and dreamers building AI-first tools that bring clarity to creative chaos. Founded with the belief that powerful tools shouldn't be complex, we blend cutting-edge machine learning with thoughtful design to create products that feel intuitive yet deliver extraordinary results."
          className="text-[#D7E2EA] font-medium text-center leading-relaxed"
        />
      </section>

      <section className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
        <FadeIn>
          <h2 className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28" style={{ fontSize: "clamp(3rem, 12vw, 160px)", lineHeight: 1 }}>
            Values
          </h2>
        </FadeIn>
        <div className="max-w-5xl mx-auto">
          {values.map((v, i) => (
            <FadeIn key={v.n} delay={i * 0.1}>
              <div className="flex items-center gap-6 sm:gap-10 py-8 sm:py-10 md:py-12 border-b" style={{ borderColor: "rgba(12,12,12,0.15)" }}>
                <span className="font-black text-[#0C0C0C] leading-none flex-shrink-0" style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}>{v.n}</span>
                <div className="flex-1">
                  <h3 className="text-[#0C0C0C] font-medium uppercase" style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}>{v.name}</h3>
                  <p className="font-light leading-relaxed max-w-2xl text-[#0C0C0C] mt-2" style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)", opacity: 0.6 }}>{v.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-6 md:px-10 py-24 md:py-32">
        <FadeIn>
          <h2 className="hero-heading font-black uppercase text-center leading-none" style={{ fontSize: "clamp(2.5rem, 10vw, 140px)" }}>
            Founder
          </h2>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 max-w-5xl mx-auto mt-16 items-center">
          <FadeIn delay={0.2} x={-40}>
            <Magnet padding={120} strength={4}>
              <img src={founderPhoto} alt="Kraftzen founder Garv" loading="lazy" className="w-full rounded-[40px] border-2 border-[#D7E2EA]/30 object-cover" />
            </Magnet>
          </FadeIn>
          <FadeIn delay={0.3} x={40} className="space-y-6">
            <p className="text-[#D7E2EA]/50 uppercase tracking-widest text-xs">Founder & CEO</p>
            <h3 className="text-[#D7E2EA] font-medium uppercase" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>Garv</h3>
            <p className="text-[#D7E2EA]/70 font-light leading-relaxed" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)" }}>
              Garv founded Kraftzen with one mission: build AI tools that feel as quiet and intentional as they are powerful. From product strategy to engineering, he leads with the conviction that great toolcraft eliminates noise instead of adding it.
            </p>
            <ContactButton label="Get in Touch" />
          </FadeIn>
        </div>
      </section>

      <Footer3D />
    </main>
  );
}
