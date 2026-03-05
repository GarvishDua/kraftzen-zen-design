import { motion } from "framer-motion";
import { Palette, BookOpen, Film, Terminal, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  { icon: Palette, label: "Designer Bro", desc: "Generate professional, on-brand graphics and ad creatives instantly." },
  { icon: Film, label: "Animator Bro", desc: "Bring static ideas to life with dynamic motion and animation." },
  { icon: BookOpen, label: "Study Bro", desc: "Accelerate research and distill complex topics in seconds." },
  { icon: Terminal, label: "Command Deck", desc: "Unified control center for all your AI-powered workflows." },
];

export default function BroAISection() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="bro-ai" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-sand/50 rounded-full blur-3xl" />

      <div ref={ref} className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            <div className="relative rounded-2xl bg-navy p-1 shadow-2xl shadow-navy/30">
              <div className="rounded-xl bg-gradient-to-br from-navy via-[hsl(213,80%,12%)] to-navy p-6 space-y-4">
                {/* Title bar */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  <span className="ml-3 text-xs text-navy-foreground/50 font-mono">bro-ai-command-deck</span>
                </div>

                {/* Dashboard grid */}
                <div className="grid grid-cols-2 gap-3">
                  {features.map((f, i) => (
                    <motion.div
                      key={f.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                      className="rounded-lg bg-navy-foreground/5 backdrop-blur border border-navy-foreground/10 p-4 hover:bg-navy-foreground/10 transition-colors group cursor-pointer"
                    >
                      <f.icon size={20} className="text-primary mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-medium text-navy-foreground/90">{f.label}</p>
                      <p className="text-xs text-navy-foreground/40 mt-1">{f.desc.slice(0, 40)}…</p>
                    </motion.div>
                  ))}
                </div>

                {/* Status bar */}
                <div className="flex items-center justify-between pt-2 border-t border-navy-foreground/10">
                  <div className="flex items-center gap-2">
                    <Sparkles size={12} className="text-primary" />
                    <span className="text-xs text-navy-foreground/40">All systems online</span>
                  </div>
                  <span className="text-xs text-primary/80 font-mono">v2.0</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="order-1 lg:order-2 space-y-6"
          >
            <span className="inline-block text-sm font-medium text-primary tracking-wider uppercase">
              Flagship Product
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
              Meet <span className="text-gradient-green">Bro AI.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Omni-Studio Command Deck that puts a team of specialized AI experts right at your fingertips. Design, animate, research, and command—all from one interface.
            </p>

            <div className="space-y-4 pt-2">
              {features.map((f) => (
                <div key={f.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <f.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-foreground">{f.label}</h4>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 text-base font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105 group mt-4"
            >
              Launch Bro AI
              <ArrowRight size={18} className="ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
