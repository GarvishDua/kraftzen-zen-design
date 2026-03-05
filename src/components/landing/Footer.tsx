import { Send, Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/kraftzen-logo.png";

const quickLinks = ["Privacy Policy", "Terms of Service", "Support", "Careers"];
const socialIcons = [
  { icon: Twitter, label: "Twitter" },
  { icon: Github, label: "GitHub" },
  { icon: Linkedin, label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-navy py-16 border-t border-navy-foreground/10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Logo + tagline */}
          <div className="space-y-4">
            <img src={logo} alt="Kraftzen" className="h-10 w-auto brightness-0 invert" />
            <p className="text-navy-foreground/50 text-sm leading-relaxed max-w-xs">
              Krafting Tools. Delivering Zen.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-display font-semibold text-navy-foreground/80 mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-navy-foreground/50 hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + newsletter */}
          <div className="space-y-6">
            <div className="flex gap-3">
              {socialIcons.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className="w-10 h-10 rounded-full bg-navy-foreground/5 border border-navy-foreground/10 flex items-center justify-center text-navy-foreground/50 hover:text-primary hover:border-primary/30 transition-all"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>

            <div>
              <p className="text-sm text-navy-foreground/60 mb-3">Stay in the loop with our latest innovations.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2 rounded-full bg-navy-foreground/5 border border-navy-foreground/10 text-sm text-navy-foreground placeholder:text-navy-foreground/30 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <Button size="icon" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-10 shadow-lg shadow-primary/20">
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-foreground/10 text-center">
          <p className="text-xs text-navy-foreground/30">
            © {new Date().getFullYear()} Kraftzen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
