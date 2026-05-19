import { useEffect, useRef, useState } from "react";
import designerBro from "/designerbro.png";
import animatorBro from "/Animatorbro.png";
import portfolioBro from "/PortfolioBro.png";
import emailerBro from "/Emailerbro.png";
import aniversex from "@/assets/aniversex-screenshot.png";

const row1 = [designerBro, animatorBro, portfolioBro, emailerBro, aniversex];
const row2 = [aniversex, emailerBro, portfolioBro, animatorBro, designerBro];

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const o = (window.scrollY - top + window.innerHeight) * 0.3;
      setOffset(o);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tripled1 = [...row1, ...row1, ...row1];
  const tripled2 = [...row2, ...row2, ...row2];

  return (
    <section ref={sectionRef} className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden">
      <div className="flex flex-col gap-3">
        <div className="flex gap-3" style={{ transform: `translateX(${offset - 200}px)`, willChange: "transform" }}>
          {tripled1.map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy" className="flex-shrink-0 object-cover rounded-2xl" style={{ width: 420, height: 270 }} />
          ))}
        </div>
        <div className="flex gap-3" style={{ transform: `translateX(${-(offset - 200)}px)`, willChange: "transform" }}>
          {tripled2.map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy" className="flex-shrink-0 object-cover rounded-2xl" style={{ width: 420, height: 270 }} />
          ))}
        </div>
      </div>
    </section>
  );
}
