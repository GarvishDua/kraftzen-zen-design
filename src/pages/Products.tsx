import { motion } from "framer-motion";
import { Palette, Film, BookOpen, LayoutDashboard, ArrowRight, Leaf, Sparkles, PenTool, Clock, Tags, BarChart3, Mail, ExternalLink, Code, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import broLogo from "@/assets/bro-ai-logo.svg";
import aniversexScreenshot from "@/assets/aniversex-screenshot.png";

const broTools = [
  {
    icon: Palette,
    name: "Designer Bro",
    tagline: "AI-Powered Design Studio",
    description: "Generate stunning ad creatives, social graphics, and brand assets in seconds.",
    features: ["Brand-aware generation", "Template library", "Batch export", "Style transfer"],
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Film,
    name: "Animator Bro",
    tagline: "Motion Made Effortless",
    description: "Transform static ideas into dynamic motion graphics and animations instantly.",
    features: ["Text-to-animation", "Scene transitions", "Character animation", "Export MP4/GIF"],
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: BookOpen,
    name: "Study Bro",
    tagline: "Research Accelerator",
    description: "Distill complex topics into digestible insights. Read, summarize, organize.",
    features: ["Paper summarization", "Topic mapping", "Citation management", "Knowledge graphs"],
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: LayoutDashboard,
    name: "Command Deck",
    tagline: "Unified Control Center",
    description: "One dashboard to orchestrate all your AI workflows with monitoring & scheduling.",
    features: ["Workflow automation", "Team management", "Analytics dashboard", "API integrations"],
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

export default function Products() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 sm:pt-28 pb-8 sm:pb-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-sand/50 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Leaf size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Our Products</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground">
              Products by <span className="text-gradient-green">Kraftzen</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-3 px-4">
              From AI-powered creative suites to automated blogging platforms — tools that eliminate friction and supercharge your workflow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Bro AI Section ── */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Bro AI Header */}
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-3 justify-center mb-8">
            <img src={broLogo} alt="Bro AI" className="h-10 w-10" loading="eager" />
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">Bro AI Platform</h2>
              <p className="text-xs text-muted-foreground">Four powerful tools. One unified ecosystem.</p>
            </div>
          </motion.div>

          {/* 2x2 Card Grid */}
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
            {broTools.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group relative rounded-2xl border border-border/50 bg-card p-5 sm:p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <tool.icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground text-sm sm:text-base">{tool.name}</h3>
                      <p className="text-xs text-primary">{tool.tagline}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                  <ul className="grid grid-cols-2 gap-1.5">
                    {tool.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
                        <Leaf size={10} className="text-primary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AniVerseX Section ── */}
      <section className="py-10 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl -translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <Sparkles size={14} className="text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">New Product</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
              Ani<span className="text-gradient-green">VerseX</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-xl mx-auto">
              AI-automated blog posting platform — high-quality, SEO-optimized content on autopilot.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid md:grid-cols-2 gap-6 md:gap-10 items-center max-w-5xl mx-auto">
            {/* Details */}
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                AniVerseX takes the pain out of content marketing. Powered by advanced AI, it generates well-researched, SEO-optimized blog posts and publishes them automatically on your schedule.
              </p>
              <ul className="space-y-2.5">
                {aniversexFeatures.map((f) => (
                  <li key={f.label} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <f.icon size={14} className="text-emerald-600 dark:text-emerald-400" />
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

            {/* Screenshot */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 to-primary/10 rounded-2xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-card">
                <div className="h-7 bg-muted/50 flex items-center gap-1.5 px-3 border-b border-border/50">
                  <div className="w-2 h-2 rounded-full bg-destructive/60" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                  <span className="ml-2 text-[10px] text-muted-foreground">aniblogs.vercel.app</span>
                </div>
                <img
                  src={aniversexScreenshot}
                  alt="AniVerseX — AI automated blogging platform screenshot"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Automated Blogging Service CTA ── */}
      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative rounded-2xl overflow-hidden max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--sand)/0.15),transparent_60%)]" />

            <div className="relative z-10 p-6 sm:p-10 md:p-12 grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-primary-foreground">
                  Want Your Own Automated Blog?
                </h2>
                <p className="text-primary-foreground/80 leading-relaxed text-xs sm:text-sm">
                  Kraftzen builds custom AI-automated blogging websites for businesses and creators. Available in both <strong className="text-primary-foreground">React</strong> and <strong className="text-primary-foreground">WordPress</strong> — fully branded, SEO-ready, and publishing on autopilot from day one.
                </p>
                <Button asChild variant="secondary" className="rounded-full px-6 text-sm font-semibold group">
                  <Link to="/contact">
                    Get in Touch <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>

              <ul className="grid grid-cols-2 gap-2.5">
                {serviceFeatures.map((f) => (
                  <li key={f.label} className="flex items-center gap-2 text-xs text-primary-foreground/90">
                    <div className="w-7 h-7 rounded-lg bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                      <f.icon size={12} className="text-primary-foreground" />
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
