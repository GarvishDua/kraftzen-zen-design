import { motion } from "framer-motion";
import { Heart, Target, Lightbulb, Leaf, Shield, Zap } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FounderSection from "@/components/landing/FounderSection";

const values = [
  { icon: Lightbulb, title: "Innovation First", description: "We push boundaries with AI-driven solutions that redefine how teams work and create." },
  { icon: Heart, title: "Human-Centered", description: "Technology should serve people. Every tool we build starts with empathy and ends with impact." },
  { icon: Shield, title: "Trust & Transparency", description: "We believe in honest products, clear communication, and respecting our users' data and time." },
  { icon: Zap, title: "Relentless Efficiency", description: "Eliminating friction is our obsession. We craft workflows that feel effortless." },
];


const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const } }),
};

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 sm:pt-28 pb-12 sm:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-48 md:w-72 h-48 md:h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 md:w-96 h-64 md:h-96 bg-sand/40 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Leaf size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Our Story</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground">About <span className="text-gradient-green">Kraftzen</span></h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed px-4">We're a team of engineers, designers, and dreamers building AI tools that bring clarity to creative chaos. Our mission: craft digital tools that deliver zen.</p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Target size={14} className="text-primary" />
                <span className="text-xs font-medium text-primary">Our Mission</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">Engineering Harmony in Every Workflow</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Founded with the belief that powerful tools shouldn't be complex, Kraftzen builds AI-first platforms that eliminate workflow chaos. We blend cutting-edge machine learning with thoughtful design to create products that feel intuitive yet deliver extraordinary results.</p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">From our flagship Bro AI ecosystem to our digital toolcraft innovations, every product embodies our core philosophy: technology should amplify human creativity, not replace it.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-sand/30 rounded-3xl blur-2xl" />
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format" alt="Kraftzen team collaborating on AI tools" className="relative rounded-3xl shadow-2xl w-full object-cover h-56 sm:h-72 md:h-80" loading="lazy" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-16 space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">Our Core Values</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">The principles that guide every decision we make and every product we ship.</p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {values.map((v, i) => (
              <motion.div key={v.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="p-4 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                  <v.icon size={20} className="text-primary sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-sm sm:text-lg font-display font-semibold text-foreground mb-1 sm:mb-2">{v.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <FounderSection />

      <Footer />
    </div>
  );
}
