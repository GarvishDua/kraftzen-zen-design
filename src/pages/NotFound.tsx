import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import ContactButton from "@/components/three-d/ContactButton";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0C0C0C] px-6 text-center">
      <div className="space-y-6">
        <h1 className="hero-heading font-black uppercase leading-none" style={{ fontSize: "clamp(5rem, 20vw, 18rem)" }}>404</h1>
        <p className="text-[#D7E2EA]/70 uppercase tracking-widest text-sm">This page drifted into the void</p>
        <div className="flex justify-center">
          <ContactButton to="/" label="Return Home" />
        </div>
      </div>
    </main>
  );
};

export default NotFound;
