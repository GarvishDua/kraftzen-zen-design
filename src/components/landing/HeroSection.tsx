import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/kraftzen-logo.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sand/60 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Floating leaves */}
      <motion.div
        className="absolute top-32 right-[15%] text-primary/20"
        animate={{ y: [-10, 10, -10], rotate: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Leaf size={40} />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-[10%] text-primary/15"
        animate={{ y: [10, -15, 10], rotate: [0, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <Leaf size={28} />
      </motion.div>
      <motion.div
        className="absolute top-[60%] right-[5%] text-sand/80"
        animate={{ y: [5, -20, 5], rotate: [10, -5, 10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Leaf size={32} />
      </motion.div>

      <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Leaf size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">Engineering Harmony</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] text-foreground">
            Krafting Tools.{" "}
            <span className="text-gradient-green">Delivering Zen.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
            We engineer advanced digital toolcraft and AI innovations that eliminate workflow chaos. Build faster, work smarter, and find your focus.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 text-base font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105 group"
            >
              Explore Our Ecosystem
              <ArrowRight size={18} className="ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 text-base font-medium border-foreground/20 text-foreground hover:bg-foreground/5 transition-all hover:scale-105"
            >
              See the Tech
            </Button>
          </div>
        </motion.div>

        {/* Right - Logo graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-sand/30 to-transparent rounded-full blur-3xl scale-125" />
            <motion.img
              src={logo}
              alt="Kraftzen"
              className="relative w-72 md:w-96 lg:w-[420px] h-auto drop-shadow-2xl"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
