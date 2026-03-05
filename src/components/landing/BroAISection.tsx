import { FeatureSteps } from "@/components/ui/feature-steps";

const broFeatures = [
  {
    step: "Designer Bro",
    title: "Designer Bro",
    content: "Generate professional, on-brand graphics and ad creatives instantly. Your dedicated visual expert.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop",
  },
  {
    step: "Animator Bro",
    title: "Animator Bro",
    content: "Bring static ideas to life with dynamic motion and animation. Create stunning visuals effortlessly.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
  },
  {
    step: "Study Bro",
    title: "Study Bro",
    content: "Accelerate research and distill complex topics in seconds. Your AI-powered knowledge companion.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073&auto=format&fit=crop",
  },
  {
    step: "Command Deck",
    title: "Command Deck",
    content: "Unified control center for all your AI-powered workflows. One interface, total command.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function BroAISection() {
  return (
    <section id="bro-ai" className="py-24 md:py-32 relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-sand/50 rounded-full blur-3xl" />

      <div className="relative z-10">
        <FeatureSteps
          features={broFeatures}
          title="Meet Bro AI."
          autoPlayInterval={4000}
          imageHeight="h-[400px] md:h-[500px]"
        />
      </div>
    </section>
  );
}
