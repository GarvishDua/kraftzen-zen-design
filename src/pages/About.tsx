import { motion } from "framer-motion";
import { Heart, Target, Users, Lightbulb, Leaf, Shield, Zap } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const values = [
  { icon: Lightbulb, title: "Innovation First", description: "We push boundaries with AI-driven solutions that redefine how teams work and create." },
  { icon: Heart, title: "Human-Centered", description: "Technology should serve people. Every tool we build starts with empathy and ends with impact." },
  { icon: Shield, title: "Trust & Transparency", description: "We believe in honest products, clear communication, and respecting our users' data and time." },
  { icon: Zap, title: "Relentless Efficiency", description: "Eliminating friction is our obsession. We craft workflows that feel effortless." },
];

const team = [
  { name: "Arjun Mehta", role: "Founder & CEO", avatar: "https://randomuser.me/api/portraits/men/75.jpg" },
  { name: "Priya Sharma", role: "CTO", avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
  { name: "Ravi Patel", role: "Head of AI", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Ananya Das", role: "Head of Design", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
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
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-sand/40 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Leaf size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Our Story</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground">About <span className="text-gradient-green">Kraftzen</span></h1>
            <p className="text-lg text-muted-foreground leading-relaxed">We're a team of engineers, designers, and dreamers building AI tools that bring clarity to creative chaos. Our mission: craft digital tools that deliver zen.</p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Target size={14} className="text-primary" />
                <span className="text-xs font-medium text-primary">Our Mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Engineering Harmony in Every Workflow</h2>
              <p className="text-muted-foreground leading-relaxed">Founded with the belief that powerful tools shouldn't be complex, Kraftzen builds AI-first platforms that eliminate workflow chaos. We blend cutting-edge machine learning with thoughtful design to create products that feel intuitive yet deliver extraordinary results.</p>
              <p className="text-muted-foreground leading-relaxed">From our flagship Bro AI ecosystem to our digital toolcraft innovations, every product embodies our core philosophy: technology should amplify human creativity, not replace it.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-sand/30 rounded-3xl blur-2xl" />
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format" alt="Kraftzen team collaborating on AI tools" className="relative rounded-3xl shadow-2xl w-full object-cover h-80" loading="lazy" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The principles that guide every decision we make and every product we ship.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div key={v.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <v.icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Users size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">The Team</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Meet the Minds Behind Kraftzen</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((m, i) => (
              <motion.div key={m.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center group">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-sand/40 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img src={m.avatar} alt={`${m.name}, ${m.role} at Kraftzen`} className="relative w-32 h-32 rounded-full object-cover border-2 border-border group-hover:border-primary/40 transition-colors" loading="lazy" />
                </div>
                <h3 className="font-display font-semibold text-foreground">{m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
