import { motion } from "framer-motion";
import { Palette, Film, BookOpen, LayoutDashboard, ArrowRight, Leaf, Sparkles, PenTool, Clock, Tags, BarChart3, Mail, ExternalLink, Code, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import broLogo from "@/assets/bro-ai-logo.svg";

const broTools = [
  {
    icon: Palette,
    name: "Designer Bro",
    tagline: "AI-Powered Design Studio",
    description: "Generate stunning ad creatives, social media graphics, and brand assets in seconds. Designer Bro understands your brand language and produces on-brand visuals at scale.",
    features: ["Brand-aware generation", "Template library", "Batch export", "Style transfer"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&auto=format",
    accent: "bg-primary/10",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Film,
    name: "Animator Bro",
    tagline: "Motion Made Effortless",
    description: "Transform static ideas into dynamic motion graphics and animations. No timeline expertise needed — just describe what you want and Animator Bro brings it to life.",
    features: ["Text-to-animation", "Scene transitions", "Character animation", "Export to MP4/GIF"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format",
    accent: "bg-primary/10",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: BookOpen,
    name: "Study Bro",
    tagline: "Research Accelerator",
    description: "Distill complex topics into digestible insights. Study Bro reads, summarizes, and organizes research so you can focus on understanding, not searching.",
    features: ["Paper summarization", "Topic mapping", "Citation management", "Knowledge graphs"],
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format",
    accent: "bg-primary/10",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: LayoutDashboard,
    name: "Command Deck",
    tagline: "Unified Control Center",
    description: "One dashboard to orchestrate all your AI workflows. Command Deck connects every Bro tool into a seamless pipeline with monitoring, scheduling, and team collaboration.",
    features: ["Workflow automation", "Team management", "Analytics dashboard", "API integrations"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format",
    accent: "bg-primary/10",
    color: "from-orange-500/20 to-yellow-500/20",
  },
];

const aniversexFeatures = [
  { icon: PenTool, label: "AI-generated SEO content" },
  { icon: Clock, label: "Automated publishing schedule" },
  { icon: Tags, label: "Category & tag management" },
  { icon: BarChart3, label: "View tracking & analytics" },
  { icon: Mail, label: "Newsletter integration" },
];

const serviceFeatures = [
  { icon: Palette, label: "Custom design & branding" },
  { icon: Sparkles, label: "AI-powered SEO optimization" },
  { icon: Clock, label: "Automated publishing pipeline" },
  { icon: BarChart3, label: "Built-in analytics dashboard" },
  { icon: Code, label: "React or WordPress" },
  { icon: Globe, label: "Fully managed hosting" },
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
              <Leaf size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Our Products</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground">
              Products by <span className="text-gradient-green">Kraftzen</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mt-4 px-4">
              From AI-powered creative suites to automated blogging platforms — we build tools that eliminate friction and supercharge your workflow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Bro AI Section ── */}
      <section className="pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex flex-col sm:flex-row items-center gap-4 justify-center p-6 rounded-2xl bg-primary/5 border border-primary/10 max-w-2xl mx-auto">
            <img src={broLogo} alt="Bro AI" className="h-12 w-12" />
            <div className="text-center sm:text-left">
              <h2 className="font-display font-bold text-foreground">Bro AI Platform</h2>
              <p className="text-sm text-muted-foreground">Four powerful tools. One unified ecosystem.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 lg:px-8 space-y-16 sm:space-y-24">
          {broTools.map((p, i) => (
            <motion.div key={p.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className={`space-y-4 sm:space-y-6 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${p.accent} flex items-center justify-center`}>
                  <p.icon size={24} className="text-primary sm:w-7 sm:h-7" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Bro AI Tool</p>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground">{p.name}</h3>
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

      {/* ── AniVerseX Section ── */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute bottom-0 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          {/* AniVerseX badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Sparkles size={14} className="text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">New Product</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground">
              Ani<span className="text-gradient-green">VerseX</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              AI-automated blog posting platform that publishes high-quality, SEO-optimized content on autopilot.
            </p>
          </motion.div>

          {/* AniVerseX content */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-5xl mx-auto">
            {/* Details */}
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                AniVerseX takes the pain out of content marketing. Powered by advanced AI, it generates well-researched, SEO-optimized blog posts and publishes them automatically on a schedule you set. No manual writing, no missed deadlines — just consistent, high-quality content that drives organic traffic.
              </p>
              <ul className="space-y-3">
                {aniversexFeatures.map((f) => (
                  <li key={f.label} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <f.icon size={16} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    {f.label}
                  </li>
                ))}
              </ul>
              <Button asChild className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground group text-sm">
                <a href="https://aniblogs.vercel.app" target="_blank" rel="noopener noreferrer">
                  Visit AniVerseX <ExternalLink size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 to-primary/10 rounded-3xl blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl bg-card">
                <div className="h-8 bg-muted/50 flex items-center gap-1.5 px-4 border-b border-border/50">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  <span className="ml-2 text-[10px] text-muted-foreground">aniblogs.vercel.app</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format"
                  alt="AniVerseX — AI automated blogging platform"
                  className="w-full h-56 sm:h-64 md:h-72 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Automated Blogging Service CTA ── */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative rounded-3xl overflow-hidden max-w-5xl mx-auto">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--sand)/0.15),transparent_60%)]" />

            <div className="relative z-10 p-8 sm:p-12 md:p-16 grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary-foreground">
                  Want Your Own Automated Blog?
                </h2>
                <p className="text-primary-foreground/80 leading-relaxed text-sm sm:text-base">
                  Kraftzen builds custom AI-automated blogging websites for businesses and creators. Available in both <strong className="text-primary-foreground">React</strong> and <strong className="text-primary-foreground">WordPress</strong> — fully branded, SEO-ready, and publishing on autopilot from day one.
                </p>
                <Button asChild variant="secondary" className="rounded-full px-8 text-sm font-semibold group">
                  <Link to="/contact">
                    Get in Touch <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>

              <ul className="grid grid-cols-2 gap-3 sm:gap-4">
                {serviceFeatures.map((f) => (
                  <li key={f.label} className="flex items-center gap-2.5 text-xs sm:text-sm text-primary-foreground/90">
                    <div className="w-8 h-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                      <f.icon size={14} className="text-primary-foreground" />
                    </div>
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
