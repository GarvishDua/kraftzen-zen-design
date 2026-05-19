import FadeIn from "@/components/three-d/FadeIn";
import StackingCardList from "@/components/three-d/StackingCard";
import aniversex from "@/assets/aniversex-screenshot.png";
import hero3d from "@/assets/hero-3d.png";
import cluster from "@/assets/decor/cluster.png";

const designerBro = "/designerbro.png";
const animatorBro = "/Animatorbro.png";
const portfolioBro = "/PortfolioBro.png";
const emailerBro = "/Emailerbro.png";

const projects = [
  {
    number: "01",
    category: "Platform",
    name: "Bro AI",
    cta: { label: "Explore Bro AI", to: "/products" },
    images: { col1Top: designerBro, col1Bottom: animatorBro, col2: portfolioBro },
    blurb: "An omni-studio command deck — Designer Bro, Animator Bro, Portfolio Bro, Emailer Bro and more, all under one roof.",
  },
  {
    number: "02",
    category: "Product",
    name: "AniVerseX",
    cta: { label: "Visit AniVerseX", href: "https://aniblogs.vercel.app" },
    images: { col1Top: aniversex, col1Bottom: aniversex, col2: aniversex },
    blurb: "AI-automated blog publishing platform — high-quality, SEO-optimized content delivered on autopilot.",
  },
  {
    number: "03",
    category: "Service",
    name: "Automated Blogging Service",
    cta: { label: "Get in Touch", to: "/contact" },
    images: { col1Top: emailerBro, col1Bottom: portfolioBro, col2: aniversex },
    blurb: "We build custom AI-automated blog websites for businesses — in React or WordPress, fully branded, publishing on autopilot.",
  },
  {
    number: "04",
    category: "Service",
    name: "Custom AI Solutions",
    cta: { label: "Start a Project", to: "/contact" },
    images: { col1Top: hero3d, col1Bottom: cluster, col2: hero3d },
    blurb: "Tailor-made AI agents, integrations and intelligent workflows engineered around your exact business needs.",
  },
];

export default function ProductsStackSection() {
  return (
    <section className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-20 relative pt-20 sm:pt-24 md:pt-32 pb-32">
      <FadeIn>
        <h2 className="hero-heading font-black uppercase tracking-tight leading-none text-center px-4" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
          Our Products
        </h2>
      </FadeIn>
      <div className="mt-12 md:mt-20">
        <StackingCardList projects={projects} />
      </div>
    </section>
  );
}
