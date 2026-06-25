
# Kraftzen Appointment Booking System

Replace the existing Contact page with a polished multi-step booking flow, back it with Supabase, send emails via Resend, and add a password-protected admin dashboard at `/admin`.

## 1. Database (Supabase migration)

Table `public.appointments`:
- `id` uuid PK
- `name` text NOT NULL
- `email` text NOT NULL
- `phone` text
- `service` text NOT NULL
- `notes` text
- `date` date NOT NULL
- `start_time` time NOT NULL
- `end_time` time NOT NULL
- `status` text NOT NULL DEFAULT `'confirmed'` (CHECK: confirmed/completed/cancelled)
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now() + trigger
- **UNIQUE (date, start_time)** to prevent double-booking
- Index on `date`

`app_role` enum + `user_roles` table + `has_role()` security-definer function (admin role only — never store role on profiles).

GRANTs + RLS:
- `appointments`: anon+authenticated may INSERT (public booking); SELECT only `date`+`start_time` of future rows is exposed through a SECURITY DEFINER RPC `get_taken_slots(p_date date)` so we never leak PII; admins (via `has_role`) can SELECT/UPDATE all.
- `user_roles`: authenticated SELECT own; service_role full.

## 2. Booking UI — replaces `/contact`

Multi-step wizard component (`src/pages/Contact.tsx` → renamed in nav as "Book a Call", route stays `/contact` for back-compat plus new `/book` alias).

Steps with smooth framer-motion transitions:
1. **Service** — 9 cards (8 services + "Not sure / General consultation").
2. **Date** — shadcn Calendar, disables Sundays, past dates, and dates >60 days out.
3. **Time** — 30-min slots 10:00–19:00 IST (18 slots). Fetch taken slots via `get_taken_slots` RPC and grey them out. Enforce **2-hour lead time** for same-day slots (compare against `now()` in IST).
4. **Details** — name (required), email (required, zod email), phone (optional), notes (optional). Zod validation.
5. **Confirmation** — success screen with date/time/service summary, "Add to Calendar" button generating `.ics` client-side, and "Book another" link.

Design: Kraftzen palette (Deep Navy #001F4F, Bamboo Green #367E30, Soft Sand #F0E8D9 on white) — matches existing site. Glassmorphism cards, mobile-first, framer-motion step transitions, progress indicator across top.

## 3. Edge Function `send-booking-emails`

Triggered from client after successful insert. Uses Resend via existing connector:
- Confirmation email → customer (booking details, calendar info)
- Notification email → `officialkraftzen@gmail.com` (full customer info + notes)
- From: `Kraftzen <onboarding@resend.dev>` (test sender — user can upgrade later)
- Branded HTML matching site palette
- Input validated with zod, CORS headers, error logging

## 4. Admin Dashboard `/admin`

- **Login page** (`/admin/login`): Supabase email/password auth. No public signup — admin user is seeded manually via instructions.
- **Dashboard** (`/admin`): protected route — checks session + `has_role('admin')`. Redirects to login otherwise.
- Table view: upcoming appointments first, then past. Columns: Date, Time, Name, Email, Phone, Service, Notes, Status.
- Actions per row: "Mark Completed", "Cancel" (updates `status`).
- Filters: status (all/confirmed/completed/cancelled), date range.
- Sign-out button.

After deploy, I'll give you steps to create the admin user (sign up once via the cloud users panel, then I'll seed the `admin` role via SQL).

## 5. Validation & Edge Cases

- Client zod schemas for all fields.
- Server-side: edge function re-validates before email send.
- Double-booking caught by DB unique constraint → user-friendly toast + auto-refresh of slots.
- IST timezone math done with explicit offset (no library needed).
- 2-hour lead time enforced client-side and server-side via DB check (added to RPC for slot listing).

## Technical Notes

- New files: `src/pages/Book.tsx`, `src/pages/AdminLogin.tsx`, `src/pages/Admin.tsx`, `src/components/booking/{ServiceStep,DateStep,TimeStep,DetailsStep,ConfirmationStep,StepIndicator}.tsx`, `src/lib/{ics,booking-slots,ist-time}.ts`, `supabase/functions/send-booking-emails/index.ts`.
- Updated: `src/App.tsx` (routes), `src/components/landing/Navbar.tsx` (link label), `src/pages/Contact.tsx` (replaced with booking flow).
- Removed: n8n chatbot integration stays as-is (separate from this work, per your instruction to "leave the n8n part").
- Deps: `date-fns` (already present likely), `framer-motion` (already present).

## Deliverable Order

1. Supabase migration (tables, RPC, roles, RLS).
2. Booking UI + slot logic.
3. Edge function for emails.
4. Admin auth + dashboard.
5. Instructions to create your admin account.
