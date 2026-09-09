-- =============================================================================
-- Kelly — full database setup (idempotent)
-- Project: paste into Supabase SQL Editor and Run once
-- Safe to re-run
-- =============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

create table if not exists public.workspaces (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null default 'member' check (role in ('owner', 'member', 'viewer')),
  created_at timestamptz default now(),
  unique(workspace_id, user_id)
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  name text not null,
  description text,
  horizon text,
  color text default '#6366f1',
  status text default 'active' check (status in ('active', 'paused', 'archived')),
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.goals (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  title text not null,
  description text,
  metric text,
  status text default 'active' check (status in ('active', 'achieved', 'abandoned')),
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.items (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'idea'
    check (status in ('idea', 'now', 'next', 'later', 'done')),
  priority text default 'none'
    check (priority in ('urgent', 'high', 'medium', 'low', 'none')),
  owner_id uuid references auth.users(id),
  owner_name text,
  target_date date,
  sort_order integer default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.feedback (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  item_id uuid references public.items(id) on delete set null,
  content text not null,
  source text,
  customer_name text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.updates (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  title text not null,
  progress text,
  risks text,
  next_steps text,
  asks text,
  health text default 'on_track'
    check (health in ('on_track', 'at_risk', 'off_track')),
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.labels (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  name text not null,
  color text default '#6366f1',
  unique(workspace_id, name)
);

create table if not exists public.item_labels (
  item_id uuid references public.items(id) on delete cascade,
  label_id uuid references public.labels(id) on delete cascade,
  primary key (item_id, label_id)
);

create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  item_id uuid references public.items(id) on delete cascade,
  update_id uuid references public.updates(id) on delete cascade,
  content text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  check (item_id is not null or update_id is not null)
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamptz default now()
);

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

-- Additive columns for upgrades
alter table public.products add column if not exists description text;
alter table public.products add column if not exists horizon text;
alter table public.products add column if not exists color text default '#6366f1';
alter table public.items add column if not exists product_id uuid references public.products(id) on delete cascade;
alter table public.items add column if not exists owner_name text;
alter table public.items add column if not exists target_date date;
alter table public.goals add column if not exists product_id uuid references public.products(id) on delete set null;
alter table public.updates add column if not exists product_id uuid references public.products(id) on delete set null;

create unique index if not exists invitations_pending_email
  on public.invitations (workspace_id, lower(email))
  where status = 'pending';

create index if not exists idx_items_workspace_status on public.items(workspace_id, status);
create index if not exists idx_items_product on public.items(product_id);
create index if not exists idx_items_sort on public.items(workspace_id, status, sort_order);
create index if not exists idx_feedback_item on public.feedback(item_id);
create index if not exists idx_workspace_members_user on public.workspace_members(user_id);
create index if not exists idx_products_workspace on public.products(workspace_id);
create index if not exists idx_invitations_token on public.invitations(token);
create index if not exists idx_invitations_email on public.invitations(lower(email));

-- -----------------------------------------------------------------------------
-- RLS helpers (SECURITY DEFINER — prevents policy recursion)
-- -----------------------------------------------------------------------------

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

create or replace function public.is_workspace_owner(ws uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = ws and user_id = auth.uid() and role = 'owner'
  );
$$;

create or replace function public.is_workspace_editor(ws uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = ws
      and user_id = auth.uid()
      and role in ('owner', 'member')
  );
$$;

grant execute on function public.is_workspace_member(uuid) to authenticated, anon;
grant execute on function public.is_workspace_owner(uuid) to authenticated, anon;
grant execute on function public.is_workspace_editor(uuid) to authenticated, anon;

-- -----------------------------------------------------------------------------
-- Profile + invite + bootstrap RPCs
-- -----------------------------------------------------------------------------

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

-- -----------------------------------------------------------------------------
-- Enable RLS on all Kelly tables
-- -----------------------------------------------------------------------------

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.products enable row level security;
alter table public.goals enable row level security;
alter table public.items enable row level security;
alter table public.feedback enable row level security;
alter table public.updates enable row level security;
alter table public.labels enable row level security;
alter table public.item_labels enable row level security;
alter table public.comments enable row level security;
alter table public.profiles enable row level security;
alter table public.invitations enable row level security;

-- -----------------------------------------------------------------------------
-- Drop old policies (names from earlier scripts)
-- -----------------------------------------------------------------------------

drop policy if exists "workspaces_select" on public.workspaces;
drop policy if exists "workspaces_insert" on public.workspaces;
drop policy if exists "workspaces_update" on public.workspaces;

drop policy if exists "members_select" on public.workspace_members;
drop policy if exists "members_select_self_or_workspace" on public.workspace_members;
drop policy if exists "members_insert" on public.workspace_members;
drop policy if exists "members_update" on public.workspace_members;
drop policy if exists "members_delete" on public.workspace_members;
drop policy if exists "members_delete_owner" on public.workspace_members;

drop policy if exists "products_all" on public.products;
drop policy if exists "goals_all" on public.goals;
drop policy if exists "items_all" on public.items;
drop policy if exists "feedback_all" on public.feedback;
drop policy if exists "updates_all" on public.updates;
drop policy if exists "labels_all" on public.labels;
drop policy if exists "item_labels_all" on public.item_labels;
drop policy if exists "comments_all" on public.comments;

drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_upsert_own" on public.profiles;

drop policy if exists "invitations_select" on public.invitations;
drop policy if exists "invitations_insert" on public.invitations;
drop policy if exists "invitations_update" on public.invitations;

-- -----------------------------------------------------------------------------
-- Policies (non-recursive)
-- -----------------------------------------------------------------------------

create policy "workspaces_select" on public.workspaces for select
  using (public.is_workspace_member(id));

create policy "workspaces_insert" on public.workspaces for insert
  with check (auth.uid() is not null);

create policy "workspaces_update" on public.workspaces for update
  using (public.is_workspace_owner(id));

create policy "members_select" on public.workspace_members for select
  using (
    user_id = auth.uid()
    or public.is_workspace_member(workspace_id)
  );

create policy "members_insert" on public.workspace_members for insert
  with check (
    user_id = auth.uid()
    or public.is_workspace_owner(workspace_id)
  );

create policy "members_update" on public.workspace_members for update
  using (public.is_workspace_owner(workspace_id));

create policy "members_delete" on public.workspace_members for delete
  using (
    public.is_workspace_owner(workspace_id)
    and role <> 'owner'
  );

create policy "products_all" on public.products for all
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "goals_all" on public.goals for all
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "items_all" on public.items for all
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "feedback_all" on public.feedback for all
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "updates_all" on public.updates for all
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "labels_all" on public.labels for all
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "item_labels_all" on public.item_labels for all
  using (
    exists (
      select 1 from public.items i
      where i.id = item_labels.item_id
        and public.is_workspace_member(i.workspace_id)
    )
  )
  with check (
    exists (
      select 1 from public.items i
      where i.id = item_labels.item_id
        and public.is_workspace_member(i.workspace_id)
    )
  );

create policy "comments_all" on public.comments for all
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "profiles_select" on public.profiles for select using (true);

create policy "profiles_upsert_own" on public.profiles for all
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "invitations_select" on public.invitations for select
  using (
    public.is_workspace_member(workspace_id)
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create policy "invitations_insert" on public.invitations for insert
  with check (public.is_workspace_editor(workspace_id));

create policy "invitations_update" on public.invitations for update
  using (
    public.is_workspace_owner(workspace_id)
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- -----------------------------------------------------------------------------
-- Optional: secure unrelated public tables if they exist (e.g. advisor warnings)
-- Enables RLS with no policies = deny via API for anon/authenticated
-- Does not drop data. Comment out if you need those tables open.
-- -----------------------------------------------------------------------------

do $opt$
begin
  if to_regclass('public.land_inland') is not null then
    execute 'alter table public.land_inland enable row level security';
  end if;
end;
$opt$;

-- =============================================================================
-- Done. Next:
-- 1) Auth → URL config: Site URL https://kellypm.vercel.app
-- 2) Redirect URLs: https://kellypm.vercel.app/**
-- 3) Refresh https://kellypm.vercel.app/dashboard while signed in
-- =============================================================================
