import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    quote: "Before Kraftzen's tools, our automation was a tangled mess. They delivered exactly what they promised: total operational zen.",
    name: "Arjun Mehta",
    role: "CTO, NovaTech Solutions",
  },
  {
    quote: "Bro AI has become the creative backbone of our team. Designer Bro alone saved us 40+ hours a month on ad creatives.",
    name: "Priya Sharma",
    role: "Head of Marketing, PixelForge",
  },
  {
    quote: "Kraftzen's engineering philosophy is unlike anything we've seen. It feels like they built our tools specifically for us.",
    name: "Liam Chen",
    role: "VP Engineering, CloudScale",
  },
  {
    quote: "The Command Deck changed how we collaborate. Every AI tool we need, unified under one beautiful interface.",
    name: "Sofia Andersen",
    role: "Product Lead, Horizon AI",
  },
];

export default function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="about" className="py-24 md:py-32 bg-navy relative overflow-hidden">
      {/* Glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sand/10 rounded-full blur-3xl" />

      <div ref={ref} className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-sm font-medium text-primary mb-4 tracking-wider uppercase"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-bold text-navy-foreground"
          >
            From Chaos to Clarity.
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="rounded-2xl bg-navy-foreground/5 backdrop-blur border border-navy-foreground/10 p-6 hover:bg-navy-foreground/10 transition-all duration-300 group"
            >
              <Quote size={24} className="text-primary/60 mb-4" />
              <p className="text-navy-foreground/80 text-sm leading-relaxed mb-6">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-sm">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-foreground/90">{t.name}</p>
                  <p className="text-xs text-navy-foreground/50">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
