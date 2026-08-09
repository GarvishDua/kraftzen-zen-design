import { useState } from "react";
import { Mail, Phone, MapPin, Copy, Check, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/site/Layout";
import Seo, { breadcrumbSchema, organizationSchema } from "@/components/site/Seo";
import PageHeader from "@/components/site/PageHeader";
import ContactVisual from "@/components/motion/ContactVisual";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SITE, CONTACT } from "@/lib/site";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FIELD =
  "w-full rounded-md border border-line bg-surface px-4 py-3 text-[0.9375rem] text-ink outline-none transition-colors duration-short ease-out placeholder:text-faint focus:border-ink-soft";

const LABEL = "t-label mb-2.5 block text-muted-foreground";

const initial = {
  name: "",
  email: "",
  company: "",
  topic: CONTACT.topics[0],
  budget: CONTACT.budgets[0],
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  /** Honeypot. Hidden from people, so anything in it came from a bot. */
  const [honeypot, setHoneypot] = useState("");

  const set = (key: keyof typeof initial) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  /** Composes the same message as a mail draft. The fallback, not the path. */
  const openMailDraft = () => {
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.company ? `Company: ${form.company}` : null,
      `Looking for: ${form.topic}`,
      `Budget: ${form.budget}`,
      "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      `${form.topic} enquiry from ${form.name || "the website"}`
    )}&body=${encodeURIComponent(body)}`;
  };

  /**
   * Posts to the serverless function, which sends through Resend.
   *
   * If that fails for any reason the mail draft opens instead, carrying the
   * same content. An enquiry is the most valuable thing this site collects, so
   * a failure here must never end with the person retyping their message.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypot }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) throw new Error(data.error ?? "Send failed");

      setSent(true);
      setForm(initial);
      toast.success("Message sent", {
        description: "We read it and reply within one business day.",
      });
    } catch (err) {
      toast.error("Could not send that from here", {
        description: "Opening your mail app with everything filled in instead.",
      });
      openMailDraft();
      // Surfaced in the console so a real outage is diagnosable, not silent.
      console.error("Contact form send failed", err);
    } finally {
      setSending(false);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      toast.success("Email address copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Select the address and copy it manually.");
    }
  };

  return (
    <Layout>
      <Seo
        title="Contact"
        description="Tell Kraftzen what is eating your week. We reply within one business day with a fixed quote and a date, or an honest no."
        path="/contact"
        schema={[
          organizationSchema,
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: `Contact ${SITE.name}`,
            url: `${SITE.domain}/contact`,
            mainEntity: { "@id": `${SITE.domain}/#organization` },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="Contact"
        title="Tell us what is eating your"
        accent="week."
        lead={CONTACT.lead}
        aside={<ContactVisual />}
      />

      <section className="py-section md:py-section-md">
        <div className="shell grid gap-14 md:grid-cols-12 md:gap-16">
          {/* Details */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <Reveal x={-16}>
                <p className="t-label mb-7 text-brand">Direct</p>
              </Reveal>

              <Stagger as="ul" className="space-y-5">
                <StaggerItem as="li">
                  <p className={LABEL}>Email</p>
                  <div className="flex items-center gap-3">
                    <Mail size={15} className="shrink-0 text-faint" aria-hidden />
                    <a href={`mailto:${SITE.email}`} className="link-underline break-all text-[0.9375rem]">
                      {SITE.email}
                    </a>
                    <button
                      type="button"
                      onClick={copyEmail}
                      aria-label="Copy email address"
                      className="ml-auto shrink-0 rounded-md border border-line p-2 text-muted-foreground transition-colors duration-short ease-out hover:border-ink hover:text-ink"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </StaggerItem>

                <StaggerItem as="li">
                  <p className={LABEL}>Phone</p>
                  <div className="flex items-center gap-3">
                    <Phone size={15} className="shrink-0 text-faint" aria-hidden />
                    <a href={SITE.phoneHref} className="link-underline text-[0.9375rem]">
                      {SITE.phone}
                    </a>
                  </div>
                </StaggerItem>

                <StaggerItem as="li">
                  <p className={LABEL}>Based in</p>
                  <div className="flex items-center gap-3">
                    <MapPin size={15} className="shrink-0 text-faint" aria-hidden />
                    <span className="text-[0.9375rem]">
                      {SITE.city}, {SITE.country}
                    </span>
                  </div>
                </StaggerItem>
              </Stagger>

              {/* The "what happens next" list used to live here as plain text.
                  It is now the illustrated flow in the header aside, which
                  shows at every size, so keeping this would be the same three
                  steps twice on one page. */}
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-8">
            <Reveal>
              <form
                onSubmit={handleSubmit}
                className="relative rounded-lg border border-line bg-surface p-6 md:p-10"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className={LABEL} htmlFor="name">
                      Your name
                    </label>
                    <input
                      id="name"
                      required
                      autoComplete="name"
                      className={FIELD}
                      placeholder="Garv"
                      value={form.name}
                      onChange={(e) => set("name")(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className={LABEL} htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      required
                      type="email"
                      autoComplete="email"
                      className={FIELD}
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={(e) => set("email")(e.target.value)}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={LABEL} htmlFor="company">
                      Company <span className="normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      id="company"
                      autoComplete="organization"
                      className={FIELD}
                      placeholder="Where you work"
                      value={form.company}
                      onChange={(e) => set("company")(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className={LABEL} htmlFor="topic">
                      What you need
                    </label>
                    <Select value={form.topic} onValueChange={set("topic")}>
                      <SelectTrigger id="topic" className={FIELD}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTACT.topics.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className={LABEL} htmlFor="budget">
                      Rough budget
                    </label>
                    <Select value={form.budget} onValueChange={set("budget")}>
                      <SelectTrigger id="budget" className={FIELD}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTACT.budgets.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className={LABEL} htmlFor="message">
                      What are you trying to fix
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={7}
                      className={`${FIELD} resize-none`}
                      placeholder="The more specific the better. Which process, how often it runs, who does it today, and what it costs you."
                      value={form.message}
                      onChange={(e) => set("message")(e.target.value)}
                    />
                  </div>
                </div>

                {/* Honeypot. Off screen rather than display:none, because some
                    bots skip hidden fields but follow the tab order. Real
                    people never reach it: it is aria-hidden and untabbable. */}
                <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
                  <label htmlFor="website">Leave this field empty</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <button
                    type="submit"
                    disabled={sending}
                    className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-3.5 text-[0.9375rem] font-medium text-paper transition-colors duration-short ease-out hover:bg-brand disabled:pointer-events-none disabled:opacity-60"
                  >
                    {sending ? "Sending" : sent ? "Send another" : "Send it"}
                    {sending ? (
                      <Loader2 size={16} aria-hidden className="animate-spin" />
                    ) : (
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-short ease-out group-hover:translate-x-1"
                      />
                    )}
                  </button>
                  <p className="t-small text-muted-foreground" aria-live="polite">
                    {sent
                      ? "Sent. We reply within one business day."
                      : "Goes straight to our inbox. We reply within one business day."}
                  </p>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
