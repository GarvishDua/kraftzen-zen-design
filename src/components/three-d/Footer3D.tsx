import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

export default function Footer3D() {
  return (
    <footer className="bg-[#0C0C0C] text-[#D7E2EA] border-t border-white/10 px-6 md:px-10 py-12 md:py-16">
      <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <h3 className="text-2xl font-black uppercase tracking-tight">Kraftzen</h3>
          <p className="text-sm text-[#D7E2EA]/60 leading-relaxed max-w-xs">
            Krafting tools. Delivering zen. Advanced AI toolcraft engineered to eliminate workflow chaos.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-[#D7E2EA]/50 mb-3">Navigate</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:opacity-70">Home</Link></li>
            <li><Link to="/products" className="hover:opacity-70">Products</Link></li>
            <li><Link to="/about" className="hover:opacity-70">About</Link></li>
            <li><Link to="/contact" className="hover:opacity-70">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-[#D7E2EA]/50 mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:opacity-70">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:opacity-70">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-[#D7E2EA]/50 mb-3">Connect</h4>
          <div className="flex gap-3">
            <a href="mailto:officialkraftzen@gmail.com" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"><Mail size={16} /></a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 text-xs text-[#D7E2EA]/40 uppercase tracking-widest text-center">
        © {new Date().getFullYear()} Kraftzen — All rights reserved
      </div>
    </footer>
  );
}
