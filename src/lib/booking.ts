// Booking helpers: slot generation, IST time, ICS file creation

export const SERVICES = [
  "Custom Websites",
  "Chatbots",
  "Voice Calling Agents",
  "Automated Blogging Websites",
  "Landing Pages",
  "3D Scroll Websites",
  "Appointment Booking Systems",
  "Content Automation",
  "Not sure / General consultation",
] as const;

export type Service = (typeof SERVICES)[number];

// 30-min slots from 10:00 to 19:00 IST (last slot starts 18:30)
export function generateSlots(): { start: string; end: string; label: string }[] {
  const slots: { start: string; end: string; label: string }[] = [];
  for (let h = 10; h < 19; h++) {
    for (const m of [0, 30]) {
      const start = `${pad(h)}:${pad(m)}`;
      const endH = m === 30 ? h + 1 : h;
      const endM = m === 30 ? 0 : 30;
      const end = `${pad(endH)}:${pad(endM)}`;
      slots.push({ start, end, label: formatTimeLabel(h, m) });
    }
  }
  return slots;
}

const pad = (n: number) => n.toString().padStart(2, "0");

function formatTimeLabel(h: number, m: number) {
  const period = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${pad(m)} ${period}`;
}

// Current "now" in IST as {y,m,d,h,min}
export function nowInIST() {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour === "24" ? "0" : parts.hour),
    minute: Number(parts.minute),
  };
}

// True if slot (date + HH:MM) is at least leadHours from now (IST)
export function slotMeetsLeadTime(dateISO: string, start: string, leadHours = 2): boolean {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [sh, sm] = start.split(":").map(Number);
  const ist = nowInIST();
  const nowMin = ist.year * 525600 + ist.month * 43800 + ist.day * 1440 + ist.hour * 60 + ist.minute;
  const slotMin = y * 525600 + m * 43800 + d * 1440 + sh * 60 + sm;
  return slotMin - nowMin >= leadHours * 60;
}

export function formatDateISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDateLong(dateISO: string): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

// Generate an .ics file content. Times are IST; convert to UTC.
export function buildICS(opts: {
  date: string;
  start: string;
  end: string;
  service: string;
  name: string;
  email: string;
  organizerEmail?: string;
}): string {
  const dtStart = istToUTCStamp(opts.date, opts.start);
  const dtEnd = istToUTCStamp(opts.date, opts.end);
  const dtStamp = toICSStamp(new Date());
  const uid = `${dtStamp}-${Math.random().toString(36).slice(2)}@kraftzen.in`;
  const summary = `Kraftzen Consultation: ${opts.service}`;
  const description = `Consultation with Kraftzen.\\nService: ${opts.service}\\nName: ${opts.name}`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kraftzen//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `ORGANIZER;CN=Kraftzen:mailto:${opts.organizerEmail ?? "officialkraftzen@gmail.com"}`,
    `ATTENDEE;CN=${opts.name};RSVP=TRUE:mailto:${opts.email}`,
    "LOCATION:Online (link sent via email)",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function istToUTCStamp(dateISO: string, time: string): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  // IST is UTC+5:30. Convert IST wall-clock to UTC by subtracting 5h30m.
  const utc = new Date(Date.UTC(y, m - 1, d, hh, mm) - (5 * 60 + 30) * 60 * 1000);
  return toICSStamp(utc);
}

function toICSStamp(d: Date): string {
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`;
}

export function downloadICS(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
