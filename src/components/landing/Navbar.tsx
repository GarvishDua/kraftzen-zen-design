import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/kraftzen-logo.webp";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Our Products", to: "/products" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl shadow-sm border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Kraftzen logo" className="h-10 w-auto" loading="eager" fetchPriority="high" decoding="async" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`text-sm font-medium transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-primary after:transition-transform after:duration-300 ${
                location.pathname === link.to
                  ? "text-foreground after:scale-x-100"
                  : "text-foreground/70 hover:text-foreground after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 font-medium shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:scale-105" asChild>
            <Link to="/contact">Get Started</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border animate-fade-in">
          <nav className="flex flex-col items-center gap-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`font-medium ${location.pathname === link.to ? "text-foreground" : "text-foreground/70 hover:text-foreground"}`}
              >
                {link.label}
              </Link>
            ))}
            <Button className="bg-primary text-primary-foreground rounded-full px-6 mt-2" asChild>
              <Link to="/contact">Get Started</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
