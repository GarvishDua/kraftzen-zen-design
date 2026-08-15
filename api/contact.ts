import { Resend } from "resend";

/**
 * Contact form endpoint.
 *
 * This runs on Vercel as a serverless function, which is the whole point: the
 * Resend key lives in `RESEND_API_KEY` on the server and is never sent to a
 * browser. It deliberately has no `VITE_` prefix, because every `VITE_`
 * variable is compiled into the public bundle and would be readable by anyone
 * viewing source.
 *
 * Validation happens here rather than only in the form. A form can be bypassed
 * by posting to this URL directly, so the client checks are a convenience and
 * these are the real ones.
 */

const TO = process.env.CONTACT_TO_EMAIL ?? "officialkraftzen@gmail.com";

/**
 * Resend will only send from a domain you have verified. Until kraftzen.in is
 * verified in the Resend dashboard, `onboarding@resend.dev` works for testing
 * and delivers to the account owner only.
 */
const FROM = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

const LIMITS = {
  name: 120,
  email: 200,
  company: 160,
  topic: 120,
  budget: 120,
  message: 5000,
};

interface Payload {
  name?: string;
  email?: string;
  company?: string;
  topic?: string;
  budget?: string;
  message?: string;
  /** Honeypot. Real people never see this field, so anything in it is a bot. */
  website?: string;
}

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

/** Deliberately loose. Strict email regexes reject valid addresses. */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Configuration problem, not the sender's fault. Say so plainly rather than
    // pretending the message went somewhere.
    console.error("RESEND_API_KEY is not set");
    return json({ error: "The form is not configured yet." }, 500);
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return json({ error: "Bad request" }, 400);
  }

  // Honeypot. Return success so a bot has no signal that it was caught.
  if (clean(body.website, 100)) {
    return json({ ok: true }, 200);
  }

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const company = clean(body.company, LIMITS.company);
  const topic = clean(body.topic, LIMITS.topic);
  const budget = clean(body.budget, LIMITS.budget);
  const message = clean(body.message, LIMITS.message);

  if (!name) return json({ error: "Please add your name." }, 400);
  if (!looksLikeEmail(email)) return json({ error: "That email does not look right." }, 400);
  if (message.length < 10) {
    return json({ error: "Tell us a little more about what you need." }, 400);
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Company", company || "Not given"],
    ["Looking for", topic || "Not given"],
    ["Budget", budget || "Not given"],
  ];

  const text = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    message,
  ].join("\n");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#16130F;line-height:1.6">
      <h2 style="margin:0 0 16px;font-size:18px">New enquiry from the website</h2>
      <table style="border-collapse:collapse;margin-bottom:20px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr>
                 <td style="padding:4px 16px 4px 0;color:#6E655B;font-size:14px">${k}</td>
                 <td style="padding:4px 0;font-size:14px">${escapeHtml(v)}</td>
               </tr>`
          )
          .join("")}
      </table>
      <div style="padding:16px;background:#FBF8F3;border-left:3px solid #E5502A;white-space:pre-wrap">${escapeHtml(
        message
      )}</div>
    </div>
  `;

  try {
    const resend = new Resend(key);

    const { error } = await resend.emails.send({
      from: `Kraftzen site <${FROM}>`,
      to: [TO],
      // Replying in the inbox goes straight back to the person who wrote in.
      replyTo: email,
      subject: `${topic || "Enquiry"} from ${name}`,
      text,
      html,
    });

    if (error) {
      console.error("Resend rejected the send", error);
      return json({ error: "Could not send that. Try again in a moment." }, 502);
    }

    return json({ ok: true }, 200);
  } catch (err) {
    console.error("Contact send failed", err);
    return json({ error: "Could not send that. Try again in a moment." }, 500);
  }
}

/**
 * Exported as `{ fetch }`, NOT as a bare default function.
 *
 * This is the bug that made the form silently fall back to the mail draft for
 * every visitor. Vercel's Node runtime supports three handler shapes: an object
 * with a `fetch` method, per-method exports like `export function POST`, or the
 * legacy `(req, res)` pair. A default-exported *function* is read as the legacy
 * shape, so Vercel called this with Node's `IncomingMessage`, `request.json()`
 * threw because that object has no such method, and the returned `Response` was
 * discarded because the legacy shape expects `res.send()`.
 *
 * The failure is invisible from the outside: the invocation errors, the form's
 * catch runs, and the visitor gets the mailto fallback instead of an error. So
 * it looks like a mail client preference rather than a broken endpoint.
 *
 * Keep this export shape. Writing `export default async function handler` here
 * again reintroduces it.
 */
export default { fetch: handler };
