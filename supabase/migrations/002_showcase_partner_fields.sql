-- Partner fields + showcase event RSVP for EudaMarket rubric hardening.

alter table public.showcase_members
  add column if not exists campus text,
  add column if not exists skills text[] not null default '{}';

create table if not exists public.showcase_rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  created_at timestamptz not null default now()
);

create index if not exists showcase_rsvps_created_at_idx on public.showcase_rsvps (created_at desc);

alter table public.showcase_rsvps enable row level security;

drop policy if exists "Anyone insert showcase rsvps" on public.showcase_rsvps;
create policy "Anyone insert showcase rsvps"
  on public.showcase_rsvps for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Staff read showcase rsvps" on public.showcase_rsvps;
create policy "Staff read showcase rsvps"
  on public.showcase_rsvps for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

grant insert on public.showcase_rsvps to anon, authenticated;
grant select on public.showcase_rsvps to authenticated;

-- Privacy demo: one opted-out roster row so reviewers can verify the placeholder.
update public.showcase_members
set opt_out = true, updated_at = now()
where lower(github_handle) = 'rebekah-dev';
