import { motion } from "framer-motion";
import { SERVICES, type Service } from "@/lib/booking";
import {
  Code2, Bot, PhoneCall, FileText, Layout, Box, CalendarRange, Zap, HelpCircle,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<Service, LucideIcon> = {
  "Custom Websites": Code2,
  Chatbots: Bot,
  "Voice Calling Agents": PhoneCall,
  "Automated Blogging Websites": FileText,
  "Landing Pages": Layout,
  "3D Scroll Websites": Box,
  "Appointment Booking Systems": CalendarRange,
  "Content Automation": Zap,
  "Not sure / General consultation": HelpCircle,
};

interface Props {
  value: Service | null;
  onSelect: (s: Service) => void;
}

export default function ServiceStep({ value, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {SERVICES.map((s, i) => {
        const Icon = ICONS[s];
        const active = value === s;
        return (
          <motion.button
            key={s}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            type="button"
            onClick={() => onSelect(s)}
            className={`group text-left p-5 rounded-2xl border transition-all ${
              active
                ? "border-[#D7E2EA]/70 bg-white/[0.06]"
                : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full border flex items-center justify-center mb-4 transition-colors ${
                active ? "border-[#D7E2EA]/60 bg-[#D7E2EA]/10" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <Icon size={18} className="text-[#D7E2EA]" />
            </div>
            <p className="text-sm font-medium text-[#D7E2EA] leading-snug">{s}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
