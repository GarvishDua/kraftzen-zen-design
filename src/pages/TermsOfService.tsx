import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const sections = [
  { title: "Acceptance of Terms", content: "By accessing or using Kraftzen's website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services." },
  { title: "Use of Services", content: "You may use our services only for lawful purposes and in accordance with these terms. You agree not to misuse, reverse engineer, or attempt to gain unauthorized access to our platform or systems." },
  { title: "User Accounts", content: "When you create an account, you are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account." },
  { title: "Intellectual Property", content: "All content, trademarks, and intellectual property on the Kraftzen platform are owned by Kraftzen or its licensors. You may not copy, modify, or distribute our content without prior written consent." },
  { title: "Limitation of Liability", content: "Kraftzen shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability is limited to the amount you paid for the services in question." },
  { title: "Termination", content: "We reserve the right to suspend or terminate your access to our services at any time, with or without cause, and with or without notice." },
  { title: "Governing Law", content: "These terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles." },
  { title: "Changes to Terms", content: "We may modify these terms at any time. Continued use of our services after changes constitutes acceptance of the updated terms." },
  { title: "Contact", content: "For questions about these terms, please contact us at legal@kraftzen.com." },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: March 5, 2026</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-8">
            <p className="text-muted-foreground leading-relaxed">Please read these Terms of Service carefully before using the Kraftzen website and services.</p>
            {sections.map((s, i) => (
              <div key={i} className="space-y-3">
                <h2 className="text-xl font-display font-semibold text-foreground">{s.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{s.content}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
