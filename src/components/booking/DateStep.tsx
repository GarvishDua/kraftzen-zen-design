import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { formatDateISO, formatDateLong } from "@/lib/booking";

interface Props {
  value: string | null;
  onSelect: (dateISO: string) => void;
}

export default function DateStep({ value, onSelect }: Props) {
  const [selected, setSelected] = useState<Date | undefined>(value ? parseISO(value) : undefined);

  useEffect(() => {
    if (selected) onSelect(formatDateISO(selected));
  }, [selected, onSelect]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="p-4 rounded-3xl border border-white/10 bg-white/[0.02] pointer-events-auto">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          disabled={(d) => d < today || d > maxDate || d.getDay() === 0}
          initialFocus
          className="pointer-events-auto text-[#D7E2EA]"
        />
      </div>
      {selected && (
        <p className="text-sm text-[#D7E2EA]/70">
          Selected: <span className="text-[#D7E2EA] font-medium">{formatDateLong(formatDateISO(selected))}</span>
        </p>
      )}
      <p className="text-xs text-[#D7E2EA]/40 uppercase tracking-widest">Sundays unavailable · IST</p>
    </motion.div>
  );
}

function parseISO(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
