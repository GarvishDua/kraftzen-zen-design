import { FeatureSteps } from "@/components/ui/feature-steps";
import broLogo from "@/assets/bro-ai-logo.svg";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Bot } from "lucide-react";

const broFeatures = [
  {
    step: "Designer Bro",
    title: "Designer Bro",
    content: "Generate professional, on-brand graphics and ad creatives instantly. Your dedicated visual expert.",
    image: "/designerbro.png",
  },
  {
    step: "Animator Bro",
    title: "Animator Bro",
    content: "Bring static ideas to life with dynamic motion and animation. Create stunning visuals effortlessly.",
    image: "/Animatorbro.png",
  },
  {
    step: "Portfolio Bro",
    title: "Portfolio Bro",
    content: "Design your customized, stunning portfolio within one click. Showcase your work beautifully with AI.",
    image: "/PortfolioBro.png",
  },
  {
    step: "Emailer Bro",
    title: "Emailer Bro",
    content: "Design professional promotional emails within one click with AI. Craft campaigns that convert.",
    image: "/Emailerbro.png",
  },
];

export default function BroAISection() {
  return (
    <section id="bro-ai" className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-sand/50 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-primary/8 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Bro AI badge */}
        <div className="flex flex-col items-center gap-3 mb-6 px-4">
          <img src={broLogo} alt="Bro AI" className="h-12 w-12 md:h-14 md:w-14" />
          <p className="text-sm md:text-base text-muted-foreground text-center max-w-md">
            Your AI-powered creative platform — a suite of specialized tools working together.
          </p>
        </div>

        <FeatureSteps
          features={broFeatures}
          title="Meet Bro AI."
          autoPlayInterval={4000}
          imageHeight="h-[280px] sm:h-[350px] md:h-[400px] lg:h-[500px]"
          ctaContent={
            <div className="relative rounded-2xl overflow-hidden group">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-emerald-700" />
              {/* Radial glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--sand)/0.2),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15),transparent_60%)]" />
              {/* Subtle dot pattern */}
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

              <div className="relative z-10 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Bot size={28} className="text-white" />
                  </div>
                </div>

                {/* Text content */}
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
                    <Sparkles size={11} className="text-amber-300" />
                    <span className="text-[10px] font-medium text-white/90 tracking-wide uppercase">Custom Solutions</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-bold text-white leading-tight">
                    Want Custom AI Agents or Workflows?
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                    We build tailor-made AI agents & intelligent workflows for your business.
                  </p>
                </div>

                {/* CTA button */}
                <div className="flex-shrink-0">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-primary font-semibold text-sm hover:bg-white/90 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 group/btn"
                  >
                    Contact Us
                    <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}
