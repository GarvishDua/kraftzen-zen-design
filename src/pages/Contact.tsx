import Navbar3D from "@/components/three-d/Navbar3D";
import Footer3D from "@/components/three-d/Footer3D";
import FadeIn from "@/components/three-d/FadeIn";
import AnimatedText from "@/components/three-d/AnimatedText";
import BookingWizard from "@/components/booking/BookingWizard";
import { Mail, Phone, MapPin } from "lucide-react";

const contactInfo = [
  { icon: Mail, label: "Email", value: "officialkraftzen@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 9310367672" },
  { icon: MapPin, label: "Office", value: "Delhi, India" },
];

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#0C0C0C]" style={{ overflowX: "clip" }}>
      <Navbar3D />

      <section className="px-6 md:px-10 pt-16 md:pt-20 pb-6 text-center">
        <FadeIn delay={0.1} y={40}>
          <h1
            className="hero-heading font-black uppercase tracking-tight leading-none"
            style={{ fontSize: "clamp(2.5rem, 11vw, 160px)" }}
          >
            Book a Call
          </h1>
        </FadeIn>
        <FadeIn delay={0.25} y={20}>
          <div className="max-w-xl mx-auto mt-4">
            <AnimatedText
              text="Pick a service, a date, and a time that works. We'll handle the rest."
              className="text-[#D7E2EA]/70 font-light"
            />
          </div>
        </FadeIn>
      </section>

      <section className="px-4 sm:px-6 md:px-10 pb-16">
        <BookingWizard />
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
