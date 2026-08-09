-- Applied to the kraftzen-blog project on 2026-08-09 as migration
-- 20260809081916_scheduled_post_rebuild. Kept here so the rebuild trigger is
-- visible in the repo. A job that lives only in the database is a job nobody
-- finds when it misbehaves.
--
-- Requires two extensions, enabled separately:
--   create extension if not exists pg_cron;
--   create extension if not exists pg_net with schema extensions;
--
-- And the cron entry, which is not part of the migration because cron.schedule
-- is not idempotent across re-runs:
--   select cron.schedule(
--     'rebuild-for-scheduled-posts',
--     '*/5 * * * *',
--     $job$select public.trigger_rebuild_for_due_posts();$job$
--   );

-- Rebuild the static site when a scheduled post goes live.
--
-- Scheduling itself needs nothing: a scheduled post is `status = published`
-- with a future `published_at`, and the anon read policy already ends in
-- `published_at <= now()`, so the post reveals itself at the right moment.
--
-- What does need a trigger is the prerendered HTML. `scripts/prerender.mjs`
-- bakes one file per post at build time, so a post that went live after the
-- last build has no static page and no per-post social card until something
-- rebuilds. That is all this does.

/* Single row. `id` is a boolean with a check constraint, which is the cheapest
   way to make a table that can only ever hold one row. */
create table if not exists public.build_state (
  id                boolean primary key default true check (id),
  last_build_at     timestamptz not null default now(),
  last_triggered_at timestamptz,
  last_reason       text
);

insert into public.build_state (id) values (true) on conflict (id) do nothing;

/* RLS on with no policies at all. Nothing anon or authenticated can do reaches
   this table, which is right: it is deploy plumbing, not blog data. */
alter table public.build_state enable row level security;

create or replace function public.trigger_rebuild_for_due_posts()
returns void
language plpgsql
security definer
set search_path = public, extensions, vault
as $fn$
declare
  marker     timestamptz;
  due_count  integer;
  newest     timestamptz;
  hook       text;
begin
  select last_build_at into marker from public.build_state where id;
  if marker is null then
    return;
  end if;

  /* Exact reconciliation: everything that crossed its publish time since the
     last build. No lookback window to guess at, because unlike a stateless
     serverless function this can remember where it got to. */
  select count(*), max(published_at)
    into due_count, newest
    from public.posts
   where status = 'published'
     and published_at is not null
     and published_at >  marker
     and published_at <= now();

  if due_count = 0 then
    return;
  end if;

  select decrypted_secret into hook
    from vault.decrypted_secrets
   where name = 'deploy_hook_url';

  /* No secret means the job is installed but not armed. Record why rather than
     failing, so `select * from build_state` explains itself. */
  if hook is null or hook = '' then
    update public.build_state
       set last_reason = format('%s post(s) due, but no deploy_hook_url secret is set', due_count)
     where id;
    return;
  end if;

  perform net.http_post(url := hook, body := '{}'::jsonb);

  /* Advance to the newest post consumed, not to now(). If a post lands between
     the count above and this update it stays unconsumed and the next run picks
     it up, instead of being skipped forever. */
  update public.build_state
     set last_build_at     = newest,
         last_triggered_at = now(),
         last_reason       = format('triggered a rebuild for %s post(s)', due_count)
   where id;
end;
$fn$;

/* Only pg_cron should ever call this. It is security definer, so leaving it
   executable by anon would hand the internet a button that spends build
   minutes. */
revoke all on function public.trigger_rebuild_for_due_posts() from public;
revoke all on function public.trigger_rebuild_for_due_posts() from anon, authenticated;
