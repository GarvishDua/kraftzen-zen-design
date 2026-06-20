import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend';
// Until a domain is verified at resend.com/domains, Resend only allows sending
// to the account owner's email. Update TO_EMAIL after verifying kraftzen.in.
const TO_EMAIL = 'garvishdua01@gmail.com';

interface ContactBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function isValid(b: any): b is ContactBody {
  return (
    b &&
    typeof b.name === 'string' && b.name.trim().length > 0 && b.name.length <= 100 &&
    typeof b.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) && b.email.length <= 255 &&
    typeof b.subject === 'string' && b.subject.trim().length > 0 && b.subject.length <= 200 &&
    typeof b.message === 'string' && b.message.trim().length > 0 && b.message.length <= 5000
  );
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
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

    const { name, email, subject, message } = body;
    const html = `
      <div style="font-family:Arial,sans-serif;color:#111">
        <h2>New Kraftzen Contact</h2>
        <p><strong>Name:</strong> ${escape(name)}</p>
        <p><strong>Email:</strong> ${escape(email)}</p>
        <p><strong>Subject:</strong> ${escape(subject)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${escape(message)}</p>
      </div>`;

    // Notification to Kraftzen team
    const notify = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: 'Kraftzen Contact <onboarding@resend.dev>',
        to: [TO_EMAIL],
        reply_to: email,
        subject: `[Kraftzen] ${subject}`,
        html,
      }),
    });

    if (!notify.ok) {
      const t = await notify.text();
      console.error('Resend error', notify.status, t);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Auto-reply skipped: Resend test mode blocks sends to arbitrary recipients.
    // Re-enable after verifying a domain at resend.com/domains.

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
