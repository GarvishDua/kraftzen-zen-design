import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend';
// Resend test mode requires sends to the Resend account owner until domain verification.
// After verifying kraftzen.in at resend.com/domains, set ADMIN_EMAIL to officialkraftzen@gmail.com
// and remove the user auto-reply guard below.
const ADMIN_EMAIL = 'garvishdua01@gmail.com';
const FROM = 'Kraftzen <onboarding@resend.dev>';

interface BookingBody {
  name: string;
  email: string;
  phone: string | null;
  service: string;
  notes: string | null;
  date: string;
  start_time: string;
  end_time: string;
  start_label: string;
}

function isValid(b: any): b is BookingBody {
  return (
    b &&
    typeof b.name === 'string' && b.name.trim().length > 0 && b.name.length <= 100 &&
    typeof b.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) && b.email.length <= 255 &&
    typeof b.service === 'string' && b.service.length <= 100 &&
    typeof b.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(b.date) &&
    typeof b.start_time === 'string' && typeof b.end_time === 'string' &&
    typeof b.start_label === 'string'
  );
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}

async function sendMail(opts: { to: string; subject: string; html: string; replyTo?: string; key: string; resendKey: string; }) {
  return fetch(`${GATEWAY_URL}/emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${opts.key}`,
      'X-Connection-Api-Key': opts.resendKey,
    },
    body: JSON.stringify({
      from: FROM,
      to: [opts.to],
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      subject: opts.subject,
      html: opts.html,
    }),
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => null);
    if (!isValid(body)) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { name, email, phone, service, notes, date, start_label } = body;
    const prettyDate = formatDate(date);

    const adminHtml = `
      <div style="font-family:Arial,sans-serif;color:#111;max-width:560px">
        <h2 style="margin:0 0 8px">📅 New Kraftzen Booking</h2>
        <p style="color:#555;margin:0 0 16px">A new consultation has been booked.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 0;color:#666">Service</td><td><strong>${escape(service)}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#666">Date</td><td><strong>${escape(prettyDate)}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#666">Time (IST)</td><td><strong>${escape(start_label)}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#666">Name</td><td>${escape(name)}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Email</td><td>${escape(email)}</td></tr>
          ${phone ? `<tr><td style="padding:6px 0;color:#666">Phone</td><td>${escape(phone)}</td></tr>` : ''}
          ${notes ? `<tr><td style="padding:6px 0;color:#666;vertical-align:top">Notes</td><td style="white-space:pre-wrap">${escape(notes)}</td></tr>` : ''}
        </table>
      </div>`;

    const userHtml = `
      <div style="font-family:Arial,sans-serif;color:#111;max-width:560px">
        <h2 style="margin:0 0 8px">Your Kraftzen consultation is confirmed ✓</h2>
        <p style="color:#555;margin:0 0 16px">Hi ${escape(name)}, we look forward to chatting!</p>
        <div style="background:#f5f7f9;border-radius:12px;padding:16px;margin:16px 0">
          <p style="margin:4px 0"><strong>Service:</strong> ${escape(service)}</p>
          <p style="margin:4px 0"><strong>Date:</strong> ${escape(prettyDate)}</p>
          <p style="margin:4px 0"><strong>Time:</strong> ${escape(start_label)} IST</p>
        </div>
        <p style="color:#555;font-size:13px">We'll send the meeting link closer to the call. Reply to this email if anything changes.</p>
        <p style="margin-top:24px;color:#999;font-size:12px">— Kraftzen</p>
      </div>`;

    const adminRes = await sendMail({
      to: ADMIN_EMAIL,
      subject: `[Booking] ${service} — ${prettyDate} ${start_label}`,
      html: adminHtml,
      replyTo: email,
      key: LOVABLE_API_KEY,
      resendKey: RESEND_API_KEY,
    });
    if (!adminRes.ok) {
      const t = await adminRes.text();
      console.error('Admin email failed', adminRes.status, t);
    }

    // Send user confirmation only if it's the verified address (Resend test mode limitation).
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      const userRes = await sendMail({
        to: email,
        subject: `Your Kraftzen consultation — ${prettyDate} ${start_label} IST`,
        html: userHtml,
        key: LOVABLE_API_KEY,
        resendKey: RESEND_API_KEY,
      });
      if (!userRes.ok) console.error('User email failed', userRes.status, await userRes.text());
    } else {
      console.log('Skipping user email (Resend test mode); verify domain to enable.');
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
