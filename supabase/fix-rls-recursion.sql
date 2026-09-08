-- Fix: infinite recursion in workspace_members policies
-- Run this in Supabase SQL editor for lustugqkrtrmyyoekyui

-- 1) Helper functions (SECURITY DEFINER bypasses RLS — no recursion)
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

create or replace function public.is_workspace_member_or_owner_role(ws uuid)
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

grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.is_workspace_owner(uuid) to authenticated;
grant execute on function public.is_workspace_member_or_owner_role(uuid) to authenticated;

-- 2) Drop recursive policies on workspace_members
drop policy if exists "members_select" on public.workspace_members;
drop policy if exists "members_select_self_or_workspace" on public.workspace_members;
drop policy if exists "members_insert" on public.workspace_members;
drop policy if exists "members_delete" on public.workspace_members;
drop policy if exists "members_delete_owner" on public.workspace_members;
drop policy if exists "members_update" on public.workspace_members;

-- Non-recursive: see your own row OR any row in a workspace you belong to (via definer fn)
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

-- 3) Workspaces policies via helpers
drop policy if exists "workspaces_select" on public.workspaces;
drop policy if exists "workspaces_insert" on public.workspaces;
drop policy if exists "workspaces_update" on public.workspaces;

create policy "workspaces_select" on public.workspaces for select
  using (public.is_workspace_member(id));

create policy "workspaces_insert" on public.workspaces for insert
  with check (auth.uid() is not null);

create policy "workspaces_update" on public.workspaces for update
  using (public.is_workspace_owner(id));

-- 4) Other tables — replace self-join policies with helper
drop policy if exists "products_all" on public.products;
create policy "products_all" on public.products for all
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

drop policy if exists "goals_all" on public.goals;
create policy "goals_all" on public.goals for all
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

drop policy if exists "items_all" on public.items;
create policy "items_all" on public.items for all
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

drop policy if exists "feedback_all" on public.feedback;
create policy "feedback_all" on public.feedback for all
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

drop policy if exists "updates_all" on public.updates;
create policy "updates_all" on public.updates for all
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

drop policy if exists "labels_all" on public.labels;
create policy "labels_all" on public.labels for all
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

drop policy if exists "comments_all" on public.comments;
create policy "comments_all" on public.comments for all
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

-- 5) Ensure bootstrap RPC exists
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
