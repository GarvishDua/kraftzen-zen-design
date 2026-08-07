import { useState } from "react";
import Navbar3D from "@/components/three-d/Navbar3D";
import Footer3D from "@/components/three-d/Footer3D";
import FadeIn from "@/components/three-d/FadeIn";
import AnimatedText from "@/components/three-d/AnimatedText";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const CONTACT_EMAIL = "officialkraftzen@gmail.com";

const contactInfo = [
  { icon: Mail, label: "Email", value: CONTACT_EMAIL },
  { icon: Phone, label: "Phone", value: "+91 9310367672" },
  { icon: MapPin, label: "Office", value: "Delhi, India" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      form.subject || "Kraftzen enquiry"
    )}&body=${encodeURIComponent(body)}`;
  };

  const field =
    "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#D7E2EA] placeholder:text-[#D7E2EA]/35 outline-none focus:border-white/30 transition";

  return (
    <main className="min-h-screen bg-[#0C0C0C]" style={{ overflowX: "clip" }}>
      <Navbar3D />

      <section className="px-6 md:px-10 pt-16 md:pt-20 pb-6 text-center">
        <FadeIn delay={0.1} y={40}>
          <h1
            className="hero-heading font-black uppercase tracking-tight leading-none"
            style={{ fontSize: "clamp(2.5rem, 11vw, 160px)" }}
          >
            Get In Touch
          </h1>
        </FadeIn>
        <FadeIn delay={0.25} y={20}>
          <div className="max-w-xl mx-auto mt-4">
            <AnimatedText
              text="Tell us what you're building. We'll get back to you within one business day."
              className="text-[#D7E2EA]/70 font-light"
            />
          </div>
        </FadeIn>
      </section>

      <section className="px-4 sm:px-6 md:px-10 pb-16">
        <FadeIn delay={0.15} y={30}>
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl mx-auto rounded-[28px] border-2 border-[#D7E2EA]/20 bg-white/[0.02] p-6 sm:p-8 md:p-10 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                required
                className={field}
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                required
                type="email"
                className={field}
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <input
              className={field}
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <textarea
              required
              rows={6}
              className={field + " resize-none"}
              placeholder="Tell us about your project"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D7E2EA] text-[#0C0C0C] text-sm uppercase tracking-widest font-semibold hover:bg-white transition"
            >
              Send message <ArrowRight size={14} />
            </button>
          </form>
        </FadeIn>
      </section>

      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-3">
          {contactInfo.map((c) => (
            <FadeIn key={c.label} delay={0.1}>
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <c.icon size={14} className="text-[#D7E2EA]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-[#D7E2EA]/50">{c.label}</p>
                  <p className="text-xs text-[#D7E2EA] truncate">{c.value}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <Footer3D />
    </main>
  );
}
