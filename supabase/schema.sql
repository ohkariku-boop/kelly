-- Kelly schema (safe to re-run)
-- Run this first in Supabase SQL Editor

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Workspaces
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

-- Additive columns if upgrading an older DB
alter table public.products add column if not exists horizon text;
alter table public.products add column if not exists description text;
alter table public.products add column if not exists color text default '#6366f1';
alter table public.items add column if not exists product_id uuid references public.products(id) on delete cascade;
alter table public.items add column if not exists owner_name text;
alter table public.items add column if not exists target_date date;

-- RLS
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

-- Policies (drop + create so re-runs work)
drop policy if exists "workspaces_select" on public.workspaces;
create policy "workspaces_select" on public.workspaces for select
  using (exists (
    select 1 from public.workspace_members
    where workspace_id = workspaces.id and user_id = auth.uid()
  ));

drop policy if exists "workspaces_insert" on public.workspaces;
create policy "workspaces_insert" on public.workspaces for insert
  with check (auth.uid() is not null);

drop policy if exists "workspaces_update" on public.workspaces;
create policy "workspaces_update" on public.workspaces for update
  using (exists (
    select 1 from public.workspace_members
    where workspace_id = workspaces.id and user_id = auth.uid() and role = 'owner'
  ));

drop policy if exists "members_select" on public.workspace_members;
create policy "members_select" on public.workspace_members for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_members.workspace_id
        and wm.user_id = auth.uid()
    )
  );

drop policy if exists "members_insert" on public.workspace_members;
create policy "members_insert" on public.workspace_members for insert
  with check (auth.uid() is not null);

drop policy if exists "members_delete" on public.workspace_members;
create policy "members_delete" on public.workspace_members for delete
  using (
    exists (
      select 1 from public.workspace_members m
      where m.workspace_id = workspace_members.workspace_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

drop policy if exists "products_all" on public.products;
create policy "products_all" on public.products for all
  using (exists (
    select 1 from public.workspace_members
    where workspace_id = products.workspace_id and user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.workspace_members
    where workspace_id = products.workspace_id and user_id = auth.uid()
  ));

drop policy if exists "goals_all" on public.goals;
create policy "goals_all" on public.goals for all
  using (exists (
    select 1 from public.workspace_members
    where workspace_id = goals.workspace_id and user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.workspace_members
    where workspace_id = goals.workspace_id and user_id = auth.uid()
  ));

drop policy if exists "items_all" on public.items;
create policy "items_all" on public.items for all
  using (exists (
    select 1 from public.workspace_members
    where workspace_id = items.workspace_id and user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.workspace_members
    where workspace_id = items.workspace_id and user_id = auth.uid()
  ));

drop policy if exists "feedback_all" on public.feedback;
create policy "feedback_all" on public.feedback for all
  using (exists (
    select 1 from public.workspace_members
    where workspace_id = feedback.workspace_id and user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.workspace_members
    where workspace_id = feedback.workspace_id and user_id = auth.uid()
  ));

drop policy if exists "updates_all" on public.updates;
create policy "updates_all" on public.updates for all
  using (exists (
    select 1 from public.workspace_members
    where workspace_id = updates.workspace_id and user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.workspace_members
    where workspace_id = updates.workspace_id and user_id = auth.uid()
  ));

drop policy if exists "labels_all" on public.labels;
create policy "labels_all" on public.labels for all
  using (exists (
    select 1 from public.workspace_members
    where workspace_id = labels.workspace_id and user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.workspace_members
    where workspace_id = labels.workspace_id and user_id = auth.uid()
  ));

drop policy if exists "item_labels_all" on public.item_labels;
create policy "item_labels_all" on public.item_labels for all
  using (exists (
    select 1 from public.items i
    join public.workspace_members wm on wm.workspace_id = i.workspace_id
    where i.id = item_labels.item_id and wm.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.items i
    join public.workspace_members wm on wm.workspace_id = i.workspace_id
    where i.id = item_labels.item_id and wm.user_id = auth.uid()
  ));

drop policy if exists "comments_all" on public.comments;
create policy "comments_all" on public.comments for all
  using (exists (
    select 1 from public.workspace_members
    where workspace_id = comments.workspace_id and user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.workspace_members
    where workspace_id = comments.workspace_id and user_id = auth.uid()
  ));

create index if not exists idx_items_workspace_status on public.items(workspace_id, status);
create index if not exists idx_items_product on public.items(product_id);
create index if not exists idx_items_sort on public.items(workspace_id, status, sort_order);
create index if not exists idx_feedback_item on public.feedback(item_id);
create index if not exists idx_workspace_members_user on public.workspace_members(user_id);
create index if not exists idx_products_workspace on public.products(workspace_id);
