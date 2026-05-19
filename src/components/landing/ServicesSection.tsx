import FadeIn from "@/components/three-d/FadeIn";

const services = [
  { n: "01", name: "AI Tooling", desc: "Custom AI agents and intelligent workflows that automate repetitive tasks and supercharge creativity across your team." },
  { n: "02", name: "Workflow Automation", desc: "End-to-end automation pipelines that eliminate friction and let your team focus on what actually matters." },
  { n: "03", name: "Brand & Web Design", desc: "Cohesive visual identities and conversion-focused websites with meticulous attention to typography and user experience." },
  { n: "04", name: "Content Systems", desc: "Automated content pipelines — from SEO-optimized blogs to social-ready creatives — running on autopilot." },
  { n: "05", name: "Custom Integrations", desc: "Bespoke integrations that connect the tools you already use into a single, harmonious workflow." },
];

export default function ServicesSection() {
  return (
    <section className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-10">
      <FadeIn>
        <h2 className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28" style={{ fontSize: "clamp(3rem, 12vw, 160px)", lineHeight: 1 }}>
          Services
        </h2>
      </FadeIn>
      <div className="max-w-5xl mx-auto">
        {services.map((s, i) => (
          <FadeIn key={s.n} delay={i * 0.1}>
            <div className="flex items-center gap-6 sm:gap-10 py-8 sm:py-10 md:py-12 border-b" style={{ borderColor: "rgba(12,12,12,0.15)" }}>
              <span className="font-black text-[#0C0C0C] leading-none flex-shrink-0" style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}>{s.n}</span>
              <div className="flex-1">
                <h3 className="text-[#0C0C0C] font-medium uppercase" style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}>{s.name}</h3>
                <p className="font-light leading-relaxed max-w-2xl text-[#0C0C0C] mt-2" style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)", opacity: 0.6 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
