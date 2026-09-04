-- Kelly multi-user infrastructure
-- Run after schema.sql (or together in SQL editor)

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Profiles (display info for members)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

do $$ begin
  create policy "profiles_select" on public.profiles for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "profiles_upsert_own" on public.profiles for all
    using (id = auth.uid()) with check (id = auth.uid());
exception when duplicate_object then null; end $$;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
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
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Invitations
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
  expires_at timestamptz default (now() + interval '14 days'),
  unique (workspace_id, email, status)
);

-- Allow multiple invites history: drop strict unique if conflicts; use partial unique
drop index if exists invitations_workspace_id_email_status_key;
create unique index if not exists invitations_pending_email
  on public.invitations (workspace_id, lower(email))
  where status = 'pending';

alter table public.invitations enable row level security;

-- Members can read invites in their workspace; owners manage
do $$ begin
  create policy "invitations_select" on public.invitations for select
    using (
      exists (
        select 1 from public.workspace_members m
        where m.workspace_id = invitations.workspace_id and m.user_id = auth.uid()
      )
      or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "invitations_insert" on public.invitations for insert
    with check (
      exists (
        select 1 from public.workspace_members m
        where m.workspace_id = invitations.workspace_id
          and m.user_id = auth.uid()
          and m.role in ('owner', 'member')
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
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
exception when duplicate_object then null; end $$;

-- Helper: is workspace member
create or replace function public.is_workspace_member(ws uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = ws and user_id = auth.uid()
  );
$$;

create or replace function public.workspace_role(ws uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.workspace_members
  where workspace_id = ws and user_id = auth.uid()
  limit 1;
$$;

-- Accept invitation (security definer so invitee can join)
create or replace function public.accept_invitation(invite_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
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
$$;

grant execute on function public.accept_invitation(text) to authenticated;

-- Ensure products have horizon column
alter table public.products add column if not exists horizon text;
alter table public.items add column if not exists owner_name text;
alter table public.items add column if not exists target_date date;

-- Tighten member policies if missing select by self
do $$ begin
  create policy "members_select_self_or_workspace" on public.workspace_members for select
    using (
      user_id = auth.uid()
      or exists (
        select 1 from public.workspace_members m2
        where m2.workspace_id = workspace_members.workspace_id
          and m2.user_id = auth.uid()
      )
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "members_delete_owner" on public.workspace_members for delete
    using (
      exists (
        select 1 from public.workspace_members m
        where m.workspace_id = workspace_members.workspace_id
          and m.user_id = auth.uid()
          and m.role = 'owner'
      )
      and workspace_members.role <> 'owner'
    );
exception when duplicate_object then null; end $$;

create index if not exists idx_invitations_token on public.invitations(token);
create index if not exists idx_invitations_email on public.invitations(lower(email));
