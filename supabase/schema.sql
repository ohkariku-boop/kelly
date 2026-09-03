-- Kelly MVP Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Workspaces
create table public.workspaces (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Workspace members
create table public.workspace_members (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null default 'member' check (role in ('owner', 'member', 'viewer')),
  created_at timestamptz default now(),
  unique(workspace_id, user_id)
);

-- Goals / Outcomes
create table public.goals (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  title text not null,
  description text,
  metric text, -- e.g. "Increase retention to 40%"
  status text default 'active' check (status in ('active', 'achieved', 'abandoned')),
  target_date date,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Initiatives / Themes
create table public.initiatives (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  goal_id uuid references public.goals(id) on delete set null,
  title text not null,
  description text,
  status text default 'proposed' check (status in ('proposed', 'planned', 'active', 'completed', 'canceled')),
  priority text default 'medium' check (priority in ('urgent', 'high', 'medium', 'low', 'none')),
  start_date date,
  target_date date,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Items (features / work units on the roadmap)
create table public.items (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  initiative_id uuid references public.initiatives(id) on delete set null,
  goal_id uuid references public.goals(id) on delete set null,
  title text not null,
  description text, -- rich text / markdown for living PRD
  status text default 'idea' check (status in ('idea', 'prioritized', 'in_progress', 'shipped', 'parked')),
  priority text default 'medium' check (priority in ('urgent', 'high', 'medium', 'low', 'none')),
  -- Lightweight RICE-ish scoring
  reach integer,
  impact integer, -- 1-5
  confidence integer, -- 0-100
  effort integer, -- story points or days
  owner_id uuid references auth.users(id),
  target_quarter text, -- e.g. "2026-Q3"
  target_date date,
  sort_order integer default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Feedback
create table public.feedback (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  item_id uuid references public.items(id) on delete set null,
  content text not null,
  source text, -- "customer interview", "support", "sales", "twitter", etc.
  customer_name text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Stakeholder Updates
create table public.updates (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  initiative_id uuid references public.initiatives(id) on delete set null,
  goal_id uuid references public.goals(id) on delete set null,
  title text not null,
  progress text, -- what moved
  risks text,
  next_steps text,
  asks text, -- what we need from stakeholders
  health text default 'on_track' check (health in ('on_track', 'at_risk', 'off_track')),
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Labels (simple)
create table public.labels (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  name text not null,
  color text default '#6366f1',
  unique(workspace_id, name)
);

create table public.item_labels (
  item_id uuid references public.items(id) on delete cascade,
  label_id uuid references public.labels(id) on delete cascade,
  primary key (item_id, label_id)
);

-- Comments
create table public.comments (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  item_id uuid references public.items(id) on delete cascade,
  update_id uuid references public.updates(id) on delete cascade,
  content text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  check (item_id is not null or update_id is not null)
);

-- Enable RLS
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.goals enable row level security;
alter table public.initiatives enable row level security;
alter table public.items enable row level security;
alter table public.feedback enable row level security;
alter table public.updates enable row level security;
alter table public.labels enable row level security;
alter table public.item_labels enable row level security;
alter table public.comments enable row level security;

-- Basic RLS policies (members can read/write their workspace)
create policy "Users can view workspaces they belong to"
  on public.workspaces for select
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = workspaces.id and user_id = auth.uid()
    )
  );

create policy "Users can insert workspaces"
  on public.workspaces for insert
  with check (true);

create policy "Owners can update workspaces"
  on public.workspaces for update
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = workspaces.id and user_id = auth.uid() and role = 'owner'
    )
  );

create policy "Members can view membership"
  on public.workspace_members for select
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_members.workspace_id and wm.user_id = auth.uid()
    )
  );

create policy "Users can join / be added"
  on public.workspace_members for insert
  with check (true);

-- Generic member access for other tables
create policy "Members full access goals"
  on public.goals for all
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = goals.workspace_id and user_id = auth.uid()
    )
  );

create policy "Members full access initiatives"
  on public.initiatives for all
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = initiatives.workspace_id and user_id = auth.uid()
    )
  );

create policy "Members full access items"
  on public.items for all
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = items.workspace_id and user_id = auth.uid()
    )
  );

create policy "Members full access feedback"
  on public.feedback for all
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = feedback.workspace_id and user_id = auth.uid()
    )
  );

create policy "Members full access updates"
  on public.updates for all
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = updates.workspace_id and user_id = auth.uid()
    )
  );

create policy "Members full access labels"
  on public.labels for all
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = labels.workspace_id and user_id = auth.uid()
    )
  );

create policy "Members full access item_labels"
  on public.item_labels for all
  using (
    exists (
      select 1 from public.items i
      join public.workspace_members wm on wm.workspace_id = i.workspace_id
      where i.id = item_labels.item_id and wm.user_id = auth.uid()
    )
  );

create policy "Members full access comments"
  on public.comments for all
  using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = comments.workspace_id and user_id = auth.uid()
    )
  );

-- Indexes
create index idx_workspace_members_user on public.workspace_members(user_id);
create index idx_goals_workspace on public.goals(workspace_id);
create index idx_initiatives_workspace on public.initiatives(workspace_id);
create index idx_items_workspace on public.items(workspace_id);
create index idx_items_status on public.items(status);
create index idx_feedback_workspace on public.feedback(workspace_id);
create index idx_updates_workspace on public.updates(workspace_id);
