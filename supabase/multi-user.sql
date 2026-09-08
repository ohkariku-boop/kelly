-- Kelly multi-user (run AFTER schema.sql)
-- Profiles, invitations, accept_invitation

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select using (true);

drop policy if exists "profiles_upsert_own" on public.profiles;
create policy "profiles_upsert_own" on public.profiles for all
  using (id = auth.uid())
  with check (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$fn$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table if not exists public.invitations (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  email text not null,
  role text not null default 'member' check (role in ('owner', 'member', 'viewer')),
  token text unique not null default encode(gen_random_bytes(24), 'hex'),
  invited_by uuid references auth.users(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'revoked', 'expired')),
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '14 days')
);

create unique index if not exists invitations_pending_email
  on public.invitations (workspace_id, lower(email))
  where status = 'pending';

alter table public.invitations enable row level security;

drop policy if exists "invitations_select" on public.invitations;
create policy "invitations_select" on public.invitations for select
  using (
    exists (
      select 1 from public.workspace_members m
      where m.workspace_id = invitations.workspace_id and m.user_id = auth.uid()
    )
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

drop policy if exists "invitations_insert" on public.invitations;
create policy "invitations_insert" on public.invitations for insert
  with check (
    exists (
      select 1 from public.workspace_members m
      where m.workspace_id = invitations.workspace_id
        and m.user_id = auth.uid()
        and m.role in ('owner', 'member')
    )
  );

drop policy if exists "invitations_update" on public.invitations;
create policy "invitations_update" on public.invitations for update
  using (
    exists (
      select 1 from public.workspace_members m
      where m.workspace_id = invitations.workspace_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create or replace function public.accept_invitation(invite_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $fn$
declare
  inv public.invitations%rowtype;
  uid uuid := auth.uid();
  user_email text;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  select email into user_email from auth.users where id = uid;

  select * into inv from public.invitations
  where token = invite_token and status = 'pending'
  for update;

  if not found then
    raise exception 'Invitation not found or already used';
  end if;

  if inv.expires_at < now() then
    update public.invitations set status = 'expired' where id = inv.id;
    raise exception 'Invitation expired';
  end if;

  if user_email is not null and lower(user_email) <> lower(inv.email) then
    raise exception 'This invitation was sent to a different email';
  end if;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (inv.workspace_id, uid, inv.role)
  on conflict (workspace_id, user_id) do update set role = excluded.role;

  update public.invitations set status = 'accepted' where id = inv.id;

  insert into public.profiles (id, email)
  values (uid, user_email)
  on conflict (id) do nothing;

  return inv.workspace_id;
end;
$fn$;

grant execute on function public.accept_invitation(text) to authenticated;

create index if not exists idx_invitations_token on public.invitations(token);
create index if not exists idx_invitations_email on public.invitations(lower(email));

alter table public.products add column if not exists horizon text;
alter table public.items add column if not exists owner_name text;
alter table public.items add column if not exists target_date date;

-- Bootstrap workspace + owner membership (avoids RLS insert/returning chicken-and-egg)
create or replace function public.create_workspace_for_me(ws_name text default 'My workspace')
returns uuid
language plpgsql
security definer
set search_path = public
as $fn$
declare
  uid uuid := auth.uid();
  new_id uuid;
  new_slug text;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  -- Already a member of something?
  select workspace_id into new_id
  from public.workspace_members
  where user_id = uid
  limit 1;

  if new_id is not null then
    return new_id;
  end if;

  new_slug := 'ws-' || substr(uid::text, 1, 8) || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 6);

  insert into public.workspaces (name, slug)
  values (coalesce(nullif(trim(ws_name), ''), 'My workspace'), new_slug)
  returning id into new_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (new_id, uid, 'owner');

  insert into public.profiles (id, email)
  values (uid, (select email from auth.users where id = uid))
  on conflict (id) do nothing;

  return new_id;
end;
$fn$;

grant execute on function public.create_workspace_for_me(text) to authenticated;
