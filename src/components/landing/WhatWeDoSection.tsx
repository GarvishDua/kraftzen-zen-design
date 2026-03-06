import { motion } from "framer-motion";
import { Wrench, Brain, Scale } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const cards = [
  {
    icon: Wrench,
    title: "Digital Toolcraft",
    description: "We build the invisible foundations of advanced automation. Custom architecture designed to scale seamlessly.",
    accent: "bg-blue-500/10 group-hover:bg-blue-500/20",
    iconColor: "text-blue-600",
  },
  {
    icon: Brain,
    title: "AI Innovations",
    description: "Developing ethical, highly specialized AI systems that integrate directly into your daily operations.",
    accent: "bg-purple-500/10 group-hover:bg-purple-500/20",
    iconColor: "text-purple-600",
  },
  {
    icon: Scale,
    title: "Seamless Harmony",
    description: "Technology that removes the friction from your workflow, elevating human potential without the headache.",
    accent: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    iconColor: "text-emerald-600",
  },
];

export default function WhatWeDoSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="innovations" className="py-16 md:py-24 lg:py-32 bg-secondary relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-0 right-0 w-60 md:w-80 h-60 md:h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      {/* Decorative divider dots */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/20" />
        ))}
      </div>

      <div ref={ref} className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-sm font-medium text-primary mb-4 tracking-wider uppercase"
          >
            What We Do
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-foreground"
          >
            Precision Engineering for a Complex World.
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className="group bg-background rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${card.accent} flex items-center justify-center mb-4 sm:mb-6 transition-colors`}>
                <card.icon size={24} className={`${card.iconColor} sm:w-7 sm:h-7`} />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-semibold text-foreground mb-2 sm:mb-3">
                {card.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
