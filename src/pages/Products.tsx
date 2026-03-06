import { motion } from "framer-motion";
import { Palette, Film, BookOpen, LayoutDashboard, ArrowRight, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import broLogo from "@/assets/bro-ai-logo.svg";

const tools = [
  {
    icon: Palette,
    name: "Designer Bro",
    tagline: "AI-Powered Design Studio",
    description: "Generate stunning ad creatives, social media graphics, and brand assets in seconds. Designer Bro understands your brand language and produces on-brand visuals at scale.",
    features: ["Brand-aware generation", "Template library", "Batch export", "Style transfer"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&auto=format",
    color: "from-purple-500/20 to-pink-500/20",
    accent: "bg-purple-500/10",
  },
  {
    icon: Film,
    name: "Animator Bro",
    tagline: "Motion Made Effortless",
    description: "Transform static ideas into dynamic motion graphics and animations. No timeline expertise needed — just describe what you want and Animator Bro brings it to life.",
    features: ["Text-to-animation", "Scene transitions", "Character animation", "Export to MP4/GIF"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format",
    color: "from-blue-500/20 to-cyan-500/20",
    accent: "bg-blue-500/10",
  },
  {
    icon: BookOpen,
    name: "Study Bro",
    tagline: "Research Accelerator",
    description: "Distill complex topics into digestible insights. Study Bro reads, summarizes, and organizes research so you can focus on understanding, not searching.",
    features: ["Paper summarization", "Topic mapping", "Citation management", "Knowledge graphs"],
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format",
    color: "from-green-500/20 to-emerald-500/20",
    accent: "bg-green-500/10",
  },
  {
    icon: LayoutDashboard,
    name: "Command Deck",
    tagline: "Unified Control Center",
    description: "One dashboard to orchestrate all your AI workflows. Command Deck connects every Bro tool into a seamless pipeline with monitoring, scheduling, and team collaboration.",
    features: ["Workflow automation", "Team management", "Analytics dashboard", "API integrations"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format",
    color: "from-orange-500/20 to-yellow-500/20",
    accent: "bg-orange-500/10",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const } }),
};

export default function Products() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 sm:pt-28 pb-12 sm:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-sand/50 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center space-y-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <img src={broLogo} alt="Bro AI" className="h-5 w-5" />
              <span className="text-xs font-medium text-primary">Bro AI Platform</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground">
              The <span className="text-gradient-green">Bro AI</span> Ecosystem
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mt-4 px-4">
              Bro AI is our flagship AI platform — a suite of specialized tools designed to eliminate creative friction and supercharge your workflow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Platform badge */}
      <section className="pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex flex-col sm:flex-row items-center gap-4 justify-center p-6 rounded-2xl bg-primary/5 border border-primary/10 max-w-2xl mx-auto">
            <img src={broLogo} alt="Bro AI" className="h-12 w-12" />
            <div className="text-center sm:text-left">
              <h3 className="font-display font-bold text-foreground">Bro AI Platform</h3>
              <p className="text-sm text-muted-foreground">Four powerful tools. One unified ecosystem.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 lg:px-8 space-y-16 sm:space-y-24">
          {tools.map((p, i) => (
            <motion.div key={p.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className={`space-y-4 sm:space-y-6 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${p.accent} flex items-center justify-center`}>
                  <p.icon size={24} className="text-primary sm:w-7 sm:h-7" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Bro AI Tool</p>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">{p.name}</h2>
                </div>
                <p className="text-sm font-medium text-primary">{p.tagline}</p>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{p.description}</p>
                <ul className="grid grid-cols-2 gap-2 sm:gap-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Leaf size={12} className="text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground group text-sm">
                  Learn More <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className={`relative ${i % 2 === 1 ? "md:order-1" : ""}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${p.color} rounded-3xl blur-2xl`} />
                <img src={p.image} alt={`${p.name} - ${p.tagline}`} className="relative rounded-3xl shadow-2xl w-full h-56 sm:h-64 md:h-72 object-cover" loading="lazy" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
