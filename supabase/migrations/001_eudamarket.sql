-- EudaMarket (Project 3 showcase) — new tables only on shared PM/Chat Supabase project.

create table if not exists public.showcase_members (
  github_handle text primary key,
  display_name text not null,
  headline text,
  bio text,
  avatar_url text,
  banner_url text,
  opt_out boolean not null default false,
  links jsonb not null default '{}'::jsonb,
  claimed_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint showcase_members_handle_format check (github_handle ~ '^[A-Za-z0-9-]{1,39}$')
);

create index if not exists showcase_members_claimed_by_idx on public.showcase_members (claimed_by);
create index if not exists showcase_members_opt_out_idx on public.showcase_members (opt_out);

create table if not exists public.partner_requests (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_name text not null,
  email text not null,
  student_handles text[] not null default '{}',
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists partner_requests_created_at_idx on public.partner_requests (created_at desc);

alter table public.showcase_members enable row level security;
alter table public.partner_requests enable row level security;

-- Public can read non-opted-out members (no email column exists on this table).
drop policy if exists "Public read showcase members" on public.showcase_members;
create policy "Public read showcase members"
  on public.showcase_members for select
  to anon, authenticated
  using (
    opt_out = false
    or claimed_by = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- Owners edit their claimed row; anyone authenticated may claim an unclaimed seed row once.
drop policy if exists "Owners update own showcase member" on public.showcase_members;
create policy "Owners update own showcase member"
  on public.showcase_members for update
  to authenticated
  using (
    claimed_by = auth.uid()
    or claimed_by is null
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  )
  with check (
    claimed_by = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

drop policy if exists "Staff insert showcase members" on public.showcase_members;
create policy "Staff insert showcase members"
  on public.showcase_members for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
    or claimed_by = auth.uid()
  );

-- Anyone can submit a partner intro; only staff can read.
drop policy if exists "Anyone insert partner requests" on public.partner_requests;
create policy "Anyone insert partner requests"
  on public.partner_requests for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Staff read partner requests" on public.partner_requests;
create policy "Staff read partner requests"
  on public.partner_requests for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- Service role / SQL editor seeds bypass RLS.
grant select on public.showcase_members to anon, authenticated;
grant insert, update on public.showcase_members to authenticated;
grant insert on public.partner_requests to anon, authenticated;
grant select on public.partner_requests to authenticated;
