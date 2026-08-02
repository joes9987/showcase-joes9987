-- Claim lock: new claims require github_handle = JWT email local-part;
-- existing owners can still edit their row without changing the handle.

create or replace function public.showcase_email_handle ()
returns text
language sql
stable
as $$
  select left(
    regexp_replace(
      split_part(lower(coalesce(auth.jwt() ->> 'email', '')), '@', 1),
      '[^a-z0-9-]',
      '',
      'g'
    ),
    39
  );
$$;

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
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
    or (
      claimed_by = auth.uid()
      and (
        -- already own this handle: edit profile fields, keep handle
        exists (
          select 1 from public.showcase_members old
          where lower(old.github_handle) = lower(showcase_members.github_handle)
            and old.claimed_by = auth.uid()
        )
        -- or first claim of an unclaimed row, handle must match email local-part
        or (
          lower(github_handle) = public.showcase_email_handle()
          and exists (
            select 1 from public.showcase_members old
            where lower(old.github_handle) = lower(showcase_members.github_handle)
              and old.claimed_by is null
          )
        )
      )
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
    or (
      claimed_by = auth.uid()
      and lower(github_handle) = public.showcase_email_handle()
    )
  );
