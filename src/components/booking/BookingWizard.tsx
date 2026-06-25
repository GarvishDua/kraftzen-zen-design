import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import StepIndicator from "./StepIndicator";
import ServiceStep from "./ServiceStep";
import DateStep from "./DateStep";
import TimeStep from "./TimeStep";
import DetailsStep, { type DetailsValue } from "./DetailsStep";
import ConfirmationStep from "./ConfirmationStep";
import { generateSlots, type Service } from "@/lib/booking";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const STEPS = ["Service", "Date", "Time", "Details", "Done"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BookingWizard() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [service, setService] = useState<Service | null>(null);
  const [dateISO, setDateISO] = useState<string | null>(null);
  const [time, setTime] = useState<{ start: string; end: string } | null>(null);
  const [details, setDetails] = useState<DetailsValue>({ name: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof DetailsValue, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<null | {
    service: string; date: string; start: string; end: string; startLabel: string; name: string; email: string;
  }>(null);

  const canNext =
    (step === 1 && !!service) ||
    (step === 2 && !!dateISO) ||
    (step === 3 && !!time) ||
    step === 4;

  const validateDetails = () => {
    const e: Partial<Record<keyof DetailsValue, string>> = {};
    if (!details.name.trim()) e.name = "Required";
    if (!details.email.trim()) e.email = "Required";
    else if (!EMAIL_RE.test(details.email.trim())) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!service || !dateISO || !time) return;
    if (!validateDetails()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("appointments").insert({
        name: details.name.trim(),
        email: details.email.trim(),
        phone: details.phone.trim() || null,
        service,
        notes: details.notes.trim() || null,
        date: dateISO,
        start_time: `${time.start}:00`,
        end_time: `${time.end}:00`,
      });
      if (error) {
        if (error.code === "23505") {
          toast({ title: "Slot just taken", description: "Please pick another time.", variant: "destructive" });
          setStep(3);
          setTime(null);
          return;
        }
        throw error;
      }

      const startLabel = generateSlots().find((s) => s.start === time.start)?.label ?? time.start;

      // Fire-and-forget emails
      supabase.functions
        .invoke("send-booking-emails", {
          body: {
            name: details.name.trim(),
            email: details.email.trim(),
            phone: details.phone.trim() || null,
            service,
            notes: details.notes.trim() || null,
            date: dateISO,
            start_time: time.start,
            end_time: time.end,
            start_label: startLabel,
          },
        })
        .catch((err) => console.error("email error", err));

      setConfirmed({
        service,
        date: dateISO,
        start: time.start,
        end: time.end,
        startLabel,
        name: details.name.trim(),
        email: details.email.trim(),
      });
      setStep(5);
    } catch (err) {
      console.error(err);
      toast({ title: "Booking failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-10">
        <StepIndicator current={step} steps={STEPS} />
      </div>

      <div className="rounded-[28px] border-2 border-[#D7E2EA]/20 bg-white/[0.02] p-6 sm:p-8 md:p-10 min-h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && (
              <Section title="What service can we help with?">
                <ServiceStep value={service} onSelect={(s) => { setService(s); }} />
              </Section>
            )}
            {step === 2 && (
              <Section title="Pick a date">
                <DateStep value={dateISO} onSelect={setDateISO} />
              </Section>
            )}
            {step === 3 && dateISO && (
              <Section title="Pick a time slot">
                <TimeStep
                  dateISO={dateISO}
                  value={time?.start ?? null}
                  onSelect={(start, end) => setTime({ start, end })}
                />
              </Section>
            )}
            {step === 4 && (
              <Section title="Your details">
                <DetailsStep value={details} onChange={setDetails} errors={errors} />
              </Section>
            )}
            {step === 5 && confirmed && <ConfirmationStep data={confirmed} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {step < 5 && (
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 text-[#D7E2EA] text-sm uppercase tracking-widest disabled:opacity-30 hover:bg-white/[0.04] transition"
          >
            <ArrowLeft size={14} /> Back
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() => canNext && setStep((s) => s + 1)}
              disabled={!canNext}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D7E2EA] text-[#0C0C0C] text-sm uppercase tracking-widest font-semibold disabled:opacity-40 hover:bg-white transition"
            >
              Next <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D7E2EA] text-[#0C0C0C] text-sm uppercase tracking-widest font-semibold disabled:opacity-60 hover:bg-white transition"
            >
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Booking...</> : <>Confirm booking <ArrowRight size={14} /></>}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[#D7E2EA] tracking-tight">{title}</h2>
      {children}
    </div>
  );
}
