import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import founderImg from "@/assets/founder-garv.jpeg";

export default function FounderSection() {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-[10%] w-48 md:w-72 h-48 md:h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[10%] w-64 md:w-80 h-64 md:h-80 bg-sand/40 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Leaf size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">The Visionary</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
            Meet the <span className="text-gradient-green">Founder</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center max-w-5xl mx-auto">
          {/* Photo - slides in from left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/30 via-sand/20 to-primary/10 blur-xl opacity-70" />
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/40 to-sand/30 opacity-50" />
              <img
                src={founderImg}
                alt="Garvish Dua, Founder & CEO of Kraftzen"
                className="relative w-60 h-72 sm:w-72 sm:h-80 md:w-80 md:h-96 object-cover rounded-3xl shadow-2xl border-2 border-border"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Text - slides in from right */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="space-y-5 text-center md:text-left"
          >
            <div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                Garvish Dua
              </h3>
              <p className="text-primary font-medium mt-1">Founder &amp; CEO</p>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Driven by the belief that powerful technology should feel effortless, Garvish founded Kraftzen to bridge the gap between cutting-edge AI and everyday creative workflows. His vision: build tools so intuitive they disappear into the process, leaving only results.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              From conceptualising Bro AI as an omni-studio command deck to assembling a team obsessed with craft and clarity, Garvish leads Kraftzen with a relentless focus on engineering harmony — one product at a time.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
