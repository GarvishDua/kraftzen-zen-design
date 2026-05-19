import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, ReactNode } from "react";

interface Project {
  number: string;
  category: string;
  name: string;
  cta: { label: string; href?: string; to?: string };
  images: { col1Top: string; col1Bottom: string; col2: string };
  blurb?: string;
}

interface Props {
  projects: Project[];
}

export default function StackingCardList({ projects }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  return (
    <div ref={container} className="relative">
      {projects.map((p, i) => {
        const targetScale = 1 - (projects.length - 1 - i) * 0.04;
        return (
          <Card key={p.number} project={p} index={i} total={projects.length} progress={scrollYProgress} targetScale={targetScale} />
        );
      })}
    </div>
  );
}

function Card({ project, index, total, progress, targetScale }: { project: Project; index: number; total: number; progress: MotionValue<number>; targetScale: number }) {
  const range = [index / total, 1];
  const scale = useTransform(progress, range, [1, targetScale]);
  const top = `calc(8rem + ${index * 28}px)`;

  return (
    <div className="h-[85vh] sticky" style={{ top }}>
      <motion.div
        style={{ scale, top: `${index * 28}px` }}
        className="relative origin-top rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA]/60 bg-[#0C0C0C] p-4 sm:p-6 md:p-8 mx-2 sm:mx-4 md:mx-8"
      >
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-4 md:gap-6">
            <span className="font-black text-[#D7E2EA] leading-none" style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}>{project.number}</span>
            <div>
              <p className="text-[#D7E2EA]/50 uppercase text-xs tracking-widest">{project.category}</p>
              <h3 className="text-[#D7E2EA] font-medium uppercase tracking-wide" style={{ fontSize: "clamp(1rem, 2vw, 1.75rem)" }}>{project.name}</h3>
            </div>
          </div>
          {project.cta.href ? (
            <a href={project.cta.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border-2 border-[#D7E2EA] px-5 py-2 text-xs uppercase tracking-widest text-[#D7E2EA] hover:bg-[#D7E2EA]/10">
              {project.cta.label}
            </a>
          ) : (
            <a href={project.cta.to || "/contact"} className="inline-flex items-center rounded-full border-2 border-[#D7E2EA] px-5 py-2 text-xs uppercase tracking-widest text-[#D7E2EA] hover:bg-[#D7E2EA]/10">
              {project.cta.label}
            </a>
          )}
        </div>

        {/* Images */}
        <div className="grid grid-cols-5 gap-3 sm:gap-4">
          <div className="col-span-2 flex flex-col gap-3 sm:gap-4">
            <img src={project.images.col1Top} alt={`${project.name} 1`} loading="lazy" className="w-full object-cover rounded-[24px] sm:rounded-[32px] md:rounded-[40px]" style={{ height: "clamp(110px, 14vw, 200px)" }} />
            <img src={project.images.col1Bottom} alt={`${project.name} 2`} loading="lazy" className="w-full object-cover rounded-[24px] sm:rounded-[32px] md:rounded-[40px]" style={{ height: "clamp(140px, 20vw, 300px)" }} />
          </div>
          <img src={project.images.col2} alt={`${project.name} 3`} loading="lazy" className="col-span-3 w-full object-cover rounded-[24px] sm:rounded-[32px] md:rounded-[40px] h-full" />
        </div>

        {project.blurb && (
          <p className="mt-4 md:mt-6 text-sm md:text-base text-[#D7E2EA]/70 max-w-2xl">{project.blurb}</p>
        )}
      </motion.div>
    </div>
  );
}
