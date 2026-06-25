import { motion } from "framer-motion";

export interface DetailsValue {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface Props {
  value: DetailsValue;
  onChange: (v: DetailsValue) => void;
  errors: Partial<Record<keyof DetailsValue, string>>;
}

export default function DetailsStep({ value, onChange, errors }: Props) {
  const set = <K extends keyof DetailsValue>(k: K, v: string) => onChange({ ...value, [k]: v });
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid sm:grid-cols-2 gap-4"
    >
      <Field label="Name *" id="name" value={value.name} onChange={(v) => set("name", v)} error={errors.name} placeholder="Your full name" />
      <Field label="Email *" id="email" type="email" value={value.email} onChange={(v) => set("email", v)} error={errors.email} placeholder="you@example.com" />
      <Field label="Phone (optional)" id="phone" value={value.phone} onChange={(v) => set("phone", v)} placeholder="+91 9876543210" />
      <div className="sm:col-span-2">
        <label htmlFor="notes" className="block text-xs uppercase tracking-widest text-[#D7E2EA]/50 mb-2">
          Project notes (optional)
        </label>
        <textarea
          id="notes"
          rows={4}
          value={value.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Tell us briefly about your project, goals, or questions..."
          className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:outline-none focus:border-[#D7E2EA]/40"
        />
      </div>
    </motion.div>
  );
}

function Field({
  label, id, value, onChange, error, placeholder, type = "text",
}: {
  label: string; id: string; value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs uppercase tracking-widest text-[#D7E2EA]/50 mb-2">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white/[0.04] border rounded-full px-4 py-3 text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:outline-none ${
          error ? "border-red-400/60" : "border-white/10 focus:border-[#D7E2EA]/40"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-400/80">{error}</p>}
    </div>
  );
}
