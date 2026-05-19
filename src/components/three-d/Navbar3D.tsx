import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar3D() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <header className="relative z-50">
      <div className="flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8">
        <nav className="hidden md:flex flex-1 items-center justify-between text-[#D7E2EA] text-sm md:text-lg lg:text-[1.4rem] font-medium uppercase tracking-wider">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="transition-opacity duration-200 hover:opacity-70"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile bar */}
        <div className="md:hidden flex items-center justify-between w-full">
          <Link to="/" className="text-[#D7E2EA] uppercase tracking-widest font-medium">Kraftzen</Link>
          <button onClick={() => setOpen(!open)} className="text-[#D7E2EA]">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0C0C0C]/95 backdrop-blur-xl border-y border-white/10 animate-fade-in">
          <nav className="flex flex-col items-center gap-4 py-6 text-[#D7E2EA] uppercase tracking-wider">
            {links.map((l) => (
              <Link key={l.label} to={l.to} className="text-base hover:opacity-70">{l.label}</Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
