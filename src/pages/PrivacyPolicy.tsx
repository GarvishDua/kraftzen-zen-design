import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const sections = [
  { title: "Information We Collect", content: "We collect information you provide directly, such as your name, email address, and any messages you send through our contact form. We also collect usage data including browser type, device information, and pages visited to improve our services." },
  { title: "How We Use Your Information", content: "We use collected information to provide and improve our services, communicate with you about updates and support, analyze usage patterns to enhance user experience, and ensure the security of our platform." },
  { title: "Data Sharing", content: "We do not sell your personal information. We may share data with trusted service providers who assist in operating our platform, and when required by law or to protect our legal rights." },
  { title: "Cookies & Tracking", content: "We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings." },
  { title: "Data Security", content: "We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits." },
  { title: "Your Rights", content: "You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time by contacting us or using the unsubscribe link in our emails." },
  { title: "Changes to This Policy", content: "We may update this privacy policy from time to time. We will notify you of any material changes by posting the updated policy on this page with a revised effective date." },
  { title: "Contact Us", content: "If you have questions about this privacy policy, please contact us at privacy@kraftzen.com." },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: March 5, 2026</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-8">
            <p className="text-muted-foreground leading-relaxed">At Kraftzen, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you visit our website or use our services.</p>
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
