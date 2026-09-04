export type Workspace = {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export type WorkspaceMember = {
  id: string
  workspace_id: string
  user_id: string
  role: 'owner' | 'member' | 'viewer'
  created_at: string
}

export type Goal = {
  id: string
  workspace_id: string
  title: string
  description: string | null
  metric: string | null
  status: 'active' | 'achieved' | 'abandoned'
  created_by: string | null
  created_at: string
  updated_at: string
}

/** The only unit of work. Status is locked. */
export type ItemStatus = 'idea' | 'now' | 'next' | 'later' | 'done'

export type Item = {
  id: string
  workspace_id: string
  goal_id: string | null
  title: string
  description: string | null
  status: ItemStatus
  priority: 'urgent' | 'high' | 'medium' | 'low' | 'none'
  owner_id: string | null
  sort_order: number
  created_by: string | null
  created_at: string
  updated_at: string
}

export type Feedback = {
  id: string
  workspace_id: string
  item_id: string | null
  content: string
  source: string | null
  customer_name: string | null
  created_by: string | null
  created_at: string
}

export type Update = {
  id: string
  workspace_id: string
  title: string
  progress: string | null
  risks: string | null
  next_steps: string | null
  asks: string | null
  health: 'on_track' | 'at_risk' | 'off_track'
  created_by: string | null
  created_at: string
}

export type Label = {
  id: string
  workspace_id: string
  name: string
  color: string
}

export const ITEM_STATUSES: ItemStatus[] = ['idea', 'now', 'next', 'later', 'done']

export const STATUS_LABELS: Record<ItemStatus, string> = {
  idea: 'Idea',
  now: 'Now',
  next: 'Next',
  later: 'Later',
  done: 'Done',
}
