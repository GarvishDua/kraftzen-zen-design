import { motion } from "framer-motion";
import { CheckCircle2, CalendarPlus, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { buildICS, downloadICS, formatDateLong } from "@/lib/booking";

interface Props {
  data: {
    service: string;
    date: string;
    start: string;
    end: string;
    startLabel: string;
    name: string;
    email: string;
  };
}

export default function ConfirmationStep({ data }: Props) {
  const handleICS = () => {
    const ics = buildICS({
      date: data.date,
      start: data.start,
      end: data.end,
      service: data.service,
      name: data.name,
      email: data.email,
    });
    downloadICS(`kraftzen-${data.date}-${data.start.replace(":", "")}.ics`, ics);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center space-y-8 py-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
        className="mx-auto w-20 h-20 rounded-full bg-[#D7E2EA]/10 border border-[#D7E2EA]/30 flex items-center justify-center"
      >
        <CheckCircle2 size={40} className="text-[#D7E2EA]" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-3xl sm:text-4xl font-black text-[#D7E2EA] uppercase tracking-tight">Booked!</h2>
        <p className="text-sm text-[#D7E2EA]/60">
          A confirmation has been sent to <span className="text-[#D7E2EA]">{data.email}</span>
        </p>
      </div>

      <div className="max-w-md mx-auto p-6 rounded-2xl border border-white/10 bg-white/[0.03] text-left space-y-3">
        <Row label="Service" value={data.service} />
        <Row label="Date" value={formatDateLong(data.date)} />
        <Row label="Time" value={`${data.startLabel} IST`} />
        <Row label="Name" value={data.name} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleICS}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#D7E2EA] text-[#0C0C0C] text-sm font-semibold uppercase tracking-widest hover:bg-white transition"
        >
          <CalendarPlus size={16} /> Add to Calendar
        </button>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/15 text-[#D7E2EA] text-sm font-semibold uppercase tracking-widest hover:bg-white/[0.05] transition"
        >
          <Home size={16} /> Back home
        </Link>
      </div>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-[#D7E2EA]/50 uppercase tracking-widest text-xs">{label}</span>
      <span className="text-[#D7E2EA] font-medium text-right">{value}</span>
    </div>
  );
}
