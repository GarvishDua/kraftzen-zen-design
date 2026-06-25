import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Props {
  current: number;
  steps: string[];
}

export default function StepIndicator({ current, steps }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2">
        {steps.map((label, i) => {
          const idx = i + 1;
          const done = idx < current;
          const active = idx === current;
          return (
            <div key={label} className="flex items-center gap-2 flex-1 last:flex-initial">
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: done || active ? "rgba(215,226,234,0.9)" : "rgba(255,255,255,0.04)",
                    color: done || active ? "#0C0C0C" : "#D7E2EA",
                    scale: active ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-sm font-semibold"
                >
                  {done ? <Check size={14} /> : idx}
                </motion.div>
                <span className={`hidden sm:block text-[10px] uppercase tracking-widest ${active ? "text-[#D7E2EA]" : "text-[#D7E2EA]/40"}`}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px bg-white/10 relative overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ width: done ? "100%" : "0%" }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-y-0 left-0 bg-[#D7E2EA]/60"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
