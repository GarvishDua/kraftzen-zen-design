import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { generateSlots, slotMeetsLeadTime, formatDateLong } from "@/lib/booking";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Props {
  dateISO: string;
  value: string | null;
  onSelect: (start: string, end: string) => void;
}

export default function TimeStep({ dateISO, value, onSelect }: Props) {
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const slots = generateSlots();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    supabase
      .rpc("get_taken_slots", { p_date: dateISO })
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) {
          console.error("get_taken_slots error", error);
          setTaken(new Set());
        } else {
          const set = new Set<string>(
            (data ?? []).map((r: { start_time: string }) => r.start_time.slice(0, 5))
          );
          setTaken(set);
        }
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [dateISO]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <p className="text-center text-sm text-[#D7E2EA]/70">
        Slots for <span className="text-[#D7E2EA] font-medium">{formatDateLong(dateISO)}</span> (IST)
      </p>
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-[#D7E2EA]/60" size={20} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {slots.map((s, i) => {
            const isTaken = taken.has(s.start);
            const meetsLead = slotMeetsLeadTime(dateISO, s.start);
            const disabled = isTaken || !meetsLead;
            const active = value === s.start;
            return (
              <motion.button
                key={s.start}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.015 }}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(s.start, s.end)}
                className={`px-3 py-3 rounded-xl border text-sm transition-all ${
                  active
                    ? "border-[#D7E2EA]/70 bg-[#D7E2EA]/15 text-[#D7E2EA] font-semibold"
                    : disabled
                    ? "border-white/5 bg-white/[0.01] text-[#D7E2EA]/25 cursor-not-allowed line-through"
                    : "border-white/10 bg-white/[0.02] text-[#D7E2EA]/85 hover:border-white/30 hover:bg-white/[0.05]"
                }`}
              >
                {s.label}
              </motion.button>
            );
          })}
        </div>
      )}
      <p className="text-xs text-center text-[#D7E2EA]/40 uppercase tracking-widest">
        Greyed = booked or within 2 hours
      </p>
    </motion.div>
  );
}
