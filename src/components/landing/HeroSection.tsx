import { motion } from "framer-motion";
import { ArrowRight, Leaf, Sparkles, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/kraftzen-logo.webp";

const floatingIcons = [
  { Icon: Leaf, className: "absolute top-32 right-[15%] text-primary/20 hidden md:block", size: 40, anim: { y: [-10, 10, -10], rotate: [0, 15, 0] }, dur: 7 },
  { Icon: Sparkles, className: "absolute top-[25%] right-[8%] text-sand/60 hidden lg:block", size: 24, anim: { y: [-8, 12, -8], scale: [1, 1.2, 1] }, dur: 5 },
  { Icon: Leaf, className: "absolute top-[60%] right-[5%] text-sand/80 hidden lg:block", size: 32, anim: { y: [5, -20, 5], rotate: [10, -5, 10] }, dur: 6 },
  { Icon: Star, className: "absolute top-[15%] left-[20%] text-sand/40 hidden md:block", size: 18, anim: { y: [-5, 8, -5], scale: [1, 1.3, 1] }, dur: 6 },
];

const particles = Array.from({ length: 12 }, (_, i) => ({
  left: `${8 + (i * 7.5) % 85}%`,
  top: `${10 + (i * 13) % 80}%`,
  delay: i * 0.4,
  dur: 4 + (i % 3) * 2,
  size: 2 + (i % 3),
}));

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-20 -left-20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full blur-[100px] opacity-60"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.25), transparent 70%)" }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-10 -right-10 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full blur-[120px] opacity-50"
          style={{ background: "radial-gradient(circle, hsl(var(--sand) / 0.7), transparent 70%)" }}
          animate={{ x: [0, -30, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[30%] right-[20%] w-[200px] md:w-[400px] h-[200px] md:h-[400px] rounded-full blur-[80px] opacity-40"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.15), hsl(var(--sand) / 0.1), transparent 70%)" }}
          animate={{ x: [0, -20, 20, 0], y: [0, 20, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[60%] left-[15%] w-[180px] md:w-[320px] h-[180px] md:h-[320px] rounded-full blur-[90px] opacity-30"
          style={{ background: "radial-gradient(circle, hsl(115 50% 45% / 0.2), transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

        {/* Mesh grid */}
        <div
          className="absolute inset-0 opacity-[0.04] hidden md:block"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.2) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.2) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Diagonal accent lines */}
        <div className="absolute inset-0 opacity-[0.02] hidden lg:block" style={{
          backgroundImage: `repeating-linear-gradient(45deg, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.3) 1px, transparent 1px, transparent 120px)`,
        }} />

        {/* Central radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[900px] h-[500px] md:h-[900px] rounded-full"
          style={{ background: "radial-gradient(ellipse, hsl(var(--primary) / 0.06), hsl(var(--sand) / 0.03) 50%, transparent 70%)" }}
        />
      </div>

      {/* Floating particles - hidden on small screens */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/20 pointer-events-none hidden md:block"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [-10, 10, -10], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}

      {/* Floating icons */}
      {floatingIcons.map(({ Icon, className, size, anim, dur }, i) => (
        <motion.div
          key={i}
          className={className}
          animate={anim}
          transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

      <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 md:space-y-8 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Leaf size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">Engineering Harmony</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] text-foreground">
            Krafting Tools.{" "}
            <span className="text-gradient-green">Delivering Zen.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed mx-auto lg:mx-0">
            We engineer advanced digital toolcraft and AI innovations that eliminate workflow chaos. Build faster, work smarter, and find your focus.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 sm:px-8 text-sm sm:text-base font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105 group"
              asChild
            >
              <Link to="/products">
                Explore Our Ecosystem
                <ArrowRight size={18} className="ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-6 sm:px-8 text-sm sm:text-base font-medium border-foreground/20 text-foreground hover:bg-foreground/5 transition-all hover:scale-105"
              asChild
            >
              <Link to="/about">See the Tech</Link>
            </Button>
          </div>
        </motion.div>

        {/* Right - Logo graphic */}
        <motion.div
          initial={{ opacity: 0.8, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex justify-center mt-8 lg:mt-0"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-sand/30 to-transparent rounded-full blur-3xl scale-125" />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/20 scale-110"
              animate={{ scale: [1.1, 1.15, 1.1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img
              src={logo}
              alt="Kraftzen AI tools and digital automation platform logo"
              className="relative w-52 sm:w-72 md:w-96 lg:w-[420px] h-auto drop-shadow-2xl will-change-transform"
              loading="eager"
              // @ts-ignore
              fetchPriority="high"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
