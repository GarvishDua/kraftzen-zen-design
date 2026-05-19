import { motion, type HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface Props extends Omit<HTMLMotionProps<"div">, "initial" | "whileInView" | "transition"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: "div" | "section" | "h1" | "h2" | "p" | "span";
}

export default function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, className, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
