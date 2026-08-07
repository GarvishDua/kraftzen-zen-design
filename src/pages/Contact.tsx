import { useState } from "react";
import { Mail, Phone, MapPin, Copy, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/site/Layout";
import Seo, { breadcrumbSchema, organizationSchema } from "@/components/site/Seo";
import PageHeader from "@/components/site/PageHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SITE, CONTACT } from "@/lib/site";

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

  const set = (key: keyof typeof initial) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  /**
   * No backend on this site, so the form composes a mail draft. Everything the
   * form collects is written into the body so nothing is lost in the handoff.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    toast("Opening your mail app", {
      description: `If nothing happens, write to ${SITE.email} directly.`,
    });
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

              <Reveal delay={0.2}>
                <div className="mt-10 rounded-lg border border-line bg-surface p-6">
                  <p className="t-label mb-3 text-brand">What happens next</p>
                  <ol className="t-small space-y-2.5 text-muted-foreground">
                    <li>1. We read it and reply within one business day.</li>
                    <li>2. A 30 minute call to understand the actual work.</li>
                    <li>3. A fixed price and a date, in writing.</li>
                  </ol>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-8">
            <Reveal>
              <form
                onSubmit={handleSubmit}
                className="rounded-lg border border-line bg-surface p-6 md:p-10"
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
                    <select
                      id="topic"
                      className={FIELD}
                      value={form.topic}
                      onChange={(e) => set("topic")(e.target.value)}
                    >
                      {CONTACT.topics.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={LABEL} htmlFor="budget">
                      Rough budget
                    </label>
                    <select
                      id="budget"
                      className={FIELD}
                      value={form.budget}
                      onChange={(e) => set("budget")(e.target.value)}
                    >
                      {CONTACT.budgets.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
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

                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <button
                    type="submit"
                    className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-3.5 text-[0.9375rem] font-medium text-paper transition-colors duration-short ease-out hover:bg-brand"
                  >
                    Send it
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-short ease-out group-hover:translate-x-1"
                    />
                  </button>
                  <p className="t-small text-muted-foreground">
                    This opens your mail app with everything filled in.
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
