import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function AnimatedText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  const chars = Array.from(text);

  return (
    <p ref={ref} className={className} style={{ position: "relative" }}>
      {chars.map((c, i) => {
        const start = i / chars.length;
        const end = start + 1 / chars.length;
        return <Char key={i} char={c} progress={scrollYProgress} range={[start, end]} />;
      })}
    </p>
  );
}

function Char({ char, progress, range }: { char: string; progress: any; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span style={{ position: "relative" }}>
      <span style={{ opacity: 0 }}>{char}</span>
      <motion.span style={{ opacity, position: "absolute", left: 0, top: 0 }}>{char}</motion.span>
    </span>
  );
}
