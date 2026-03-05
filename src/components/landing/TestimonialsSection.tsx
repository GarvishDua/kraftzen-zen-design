import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const testimonials = [
  {
    id: 1,
    name: "Arjun Mehta",
    role: "CTO",
    company: "NovaTech Solutions",
    content:
      "Before Kraftzen's tools, our automation was a tangled mess. They delivered exactly what they promised: total operational zen.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Head of Marketing",
    company: "PixelForge",
    content:
      "Bro AI has become the creative backbone of our team. Designer Bro alone saved us 40+ hours a month on ad creatives.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Liam Chen",
    role: "VP Engineering",
    company: "CloudScale",
    content:
      "Kraftzen's engineering philosophy is unlike anything we've seen. It feels like they built our tools specifically for us.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    id: 4,
    name: "Sofia Andersen",
    role: "Product Lead",
    company: "Horizon AI",
    content:
      "The Command Deck changed how we collaborate. Every AI tool we need, unified under one beautiful interface.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="about" className="py-24 md:py-32 bg-navy relative overflow-hidden">
      {/* Glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sand/10 rounded-full blur-3xl" />

      <AnimatedTestimonials
        className="container mx-auto px-4 lg:px-8 relative z-10"
        title="From Chaos to Clarity."
        subtitle="Don't just take our word for it. See what teams are saying about Kraftzen's impact on their workflow."
        badgeText="Testimonials"
        testimonials={testimonials}
        autoRotateInterval={6000}
        trustedCompanies={["NovaTech", "PixelForge", "CloudScale", "Horizon AI", "Synthwave"]}
        trustedCompaniesTitle="Trusted by innovative teams worldwide"
      />
    </section>
  );
}
