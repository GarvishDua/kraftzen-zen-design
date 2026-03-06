import { motion } from "framer-motion";
import { ArrowRight, Leaf, Sparkles, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/kraftzen-logo.webp";

const floatingIcons = [
  { Icon: Leaf, className: "absolute top-32 right-[15%] text-primary/20 hidden md:block", size: 40, anim: { y: [-10, 10, -10], rotate: [0, 15, 0] }, dur: 7 },
  { Icon: Leaf, className: "absolute bottom-32 left-[10%] text-primary/15 hidden md:block", size: 28, anim: { y: [10, -15, 10], rotate: [0, -10, 0] }, dur: 9 },
  { Icon: Sparkles, className: "absolute top-[25%] right-[8%] text-sand/60 hidden lg:block", size: 24, anim: { y: [-8, 12, -8], scale: [1, 1.2, 1] }, dur: 5 },
  { Icon: Zap, className: "absolute top-[70%] left-[5%] text-primary/15 hidden lg:block", size: 22, anim: { y: [5, -10, 5], rotate: [-5, 10, -5] }, dur: 8 },
  { Icon: Star, className: "absolute top-[15%] left-[20%] text-sand/40 hidden md:block", size: 18, anim: { y: [-5, 8, -5], scale: [1, 1.3, 1] }, dur: 6 },
  { Icon: Leaf, className: "absolute top-[60%] right-[5%] text-sand/80 hidden lg:block", size: 32, anim: { y: [5, -20, 5], rotate: [10, -5, 10] }, dur: 6 },
  { Icon: Sparkles, className: "absolute bottom-[20%] right-[25%] text-primary/10 hidden md:block", size: 20, anim: { y: [0, -12, 0], rotate: [0, 20, 0] }, dur: 10 },
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
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-sand/60 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-10 right-[30%] w-32 md:w-52 h-32 md:h-52 bg-green-400/8 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-[30%] left-[20%] w-40 md:w-64 h-40 md:h-64 bg-blue-400/6 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "3s" }} />
        <div className="absolute top-[40%] right-[10%] w-28 md:w-40 h-28 md:h-40 bg-sand/30 rounded-full blur-2xl animate-pulse-glow" style={{ animationDelay: "4s" }} />

        {/* Mesh grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] hidden md:block"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial glow behind content */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-gradient-radial from-primary/8 to-transparent rounded-full" />
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex justify-center mt-8 lg:mt-0"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-sand/30 to-transparent rounded-full blur-3xl scale-125" />
            {/* Animated ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/20 scale-110"
              animate={{ scale: [1.1, 1.15, 1.1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img
              src={logo}
              alt="Kraftzen AI tools and digital automation platform logo"
              className="relative w-52 sm:w-72 md:w-96 lg:w-[420px] h-auto drop-shadow-2xl"
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
