export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
  target_date: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type Initiative = {
  id: string
  workspace_id: string
  goal_id: string | null
  title: string
  description: string | null
  status: 'proposed' | 'planned' | 'active' | 'completed' | 'canceled'
  priority: 'urgent' | 'high' | 'medium' | 'low' | 'none'
  start_date: string | null
  target_date: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type Item = {
  id: string
  workspace_id: string
  initiative_id: string | null
  goal_id: string | null
  title: string
  description: string | null
  status: 'idea' | 'prioritized' | 'in_progress' | 'shipped' | 'parked'
  priority: 'urgent' | 'high' | 'medium' | 'low' | 'none'
  reach: number | null
  impact: number | null
  confidence: number | null
  effort: number | null
  owner_id: string | null
  target_quarter: string | null
  target_date: string | null
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
  initiative_id: string | null
  goal_id: string | null
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
