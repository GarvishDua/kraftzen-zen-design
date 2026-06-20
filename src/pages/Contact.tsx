import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Phone } from "lucide-react";
import Navbar3D from "@/components/three-d/Navbar3D";
import Footer3D from "@/components/three-d/Footer3D";
import FadeIn from "@/components/three-d/FadeIn";
import AnimatedText from "@/components/three-d/AnimatedText";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const contactInfo = [
  { icon: Mail, label: "Email", value: "officialkraftzen@gmail.com" },
  { icon: MapPin, label: "Office", value: "Delhi, India" },
  { icon: Phone, label: "Phone", value: "+91 9310367672" },
];

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      subject: String(data.get("subject") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };
    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", { body: payload });
      if (error) throw error;
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
      form.reset();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to send", description: "Please try again or email us directly.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0C0C0C]" style={{ overflowX: "clip" }}>
      <Navbar3D />

      <section className="px-6 md:px-10 pt-16 md:pt-20 pb-10 text-center">
        <FadeIn delay={0.1} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none" style={{ fontSize: "clamp(3rem, 14vw, 200px)" }}>
            Let's Build
          </h1>
        </FadeIn>
      </section>

      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-10 md:gap-16">
          {/* Left */}
          <div className="md:col-span-2 space-y-8">
            <AnimatedText
              text="Have a project in mind? A workflow to automate? An AI tool you wish existed? We'd love to hear from you."
              className="text-[#D7E2EA] font-light leading-relaxed"
            />
            <div className="space-y-4">
              {contactInfo.map((c) => (
                <FadeIn key={c.label} delay={0.1}>
                  <div className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <c.icon size={16} className="text-[#D7E2EA]" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#D7E2EA]/50">{c.label}</p>
                      <p className="text-sm text-[#D7E2EA]">{c.value}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="md:col-span-3 space-y-5 p-6 sm:p-8 md:p-10 rounded-[32px] border-2 border-[#D7E2EA]/30 bg-white/[0.02]"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field id="name" label="Name" placeholder="Your name" />
              <Field id="email" type="email" label="Email" placeholder="you@example.com" />
            </div>
            <Field id="subject" label="Subject" placeholder="How can we help?" />
            <div>
              <label htmlFor="message" className="block text-xs uppercase tracking-widest text-[#D7E2EA]/50 mb-2">Message</label>
              <textarea id="message" required rows={5} placeholder="Tell us more..." className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-[#D7E2EA]/40" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-contact-gradient w-full rounded-full py-4 text-white uppercase tracking-widest text-sm font-medium disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {loading ? "Sending..." : "Send Message"} <Send size={16} />
            </button>
          </motion.form>
        </div>
      </section>

      <Footer3D />
    </main>
  );
}

function Field({ id, label, placeholder, type = "text" }: { id: string; label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs uppercase tracking-widest text-[#D7E2EA]/50 mb-2">{label}</label>
      <input id={id} type={type} required placeholder={placeholder} className="w-full bg-white/[0.04] border border-white/10 rounded-full px-4 py-3 text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-[#D7E2EA]/40" />
    </div>
  );
}
