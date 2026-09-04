import { createClient } from '@/lib/supabase/client'

export type MemberRole = 'owner' | 'member' | 'viewer'

export type WorkspaceSummary = {
  id: string
  name: string
  slug: string
  role: MemberRole
}

export type MemberRow = {
  id: string
  workspace_id: string
  user_id: string
  role: MemberRole
  created_at: string
  email: string | null
  full_name: string | null
}

export type InvitationRow = {
  id: string
  workspace_id: string
  email: string
  role: MemberRole
  token: string
  status: string
  created_at: string
  expires_at: string
}

export async function listMyWorkspaces(): Promise<WorkspaceSummary[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data: memberships, error } = await supabase
    .from('workspace_members')
    .select('role, workspace_id')
    .eq('user_id', user.id)

  if (error || !memberships?.length) {
    if (error) console.error('listMyWorkspaces', error)
    return []
  }

  const ids = memberships.map((m) => m.workspace_id)
  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('id, name, slug')
    .in('id', ids)

  const byId = new Map((workspaces || []).map((w) => [w.id, w]))
  return memberships
    .map((m) => {
      const ws = byId.get(m.workspace_id)
      if (!ws) return null
      return {
        id: ws.id,
        name: ws.name,
        slug: ws.slug,
        role: m.role as MemberRole,
      }
    })
    .filter(Boolean) as WorkspaceSummary[]
}

export async function listMembers(workspaceId: string): Promise<MemberRow[]> {
  const supabase = createClient()
  const { data: members, error } = await supabase
    .from('workspace_members')
    .select('id, workspace_id, user_id, role, created_at')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: true })

  if (error || !members) {
    console.error('listMembers', error)
    return []
  }

  const userIds = members.map((m) => m.user_id)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .in('id', userIds)

  const profileById = new Map((profiles || []).map((p) => [p.id, p]))

  return members.map((m) => {
    const p = profileById.get(m.user_id)
    return {
      id: m.id,
      workspace_id: m.workspace_id,
      user_id: m.user_id,
      role: m.role as MemberRole,
      created_at: m.created_at,
      email: p?.email ?? null,
      full_name: p?.full_name ?? null,
    }
  })
}

export async function listInvitations(workspaceId: string): Promise<InvitationRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('listInvitations', error)
    return []
  }
  return (data || []) as InvitationRow[]
}

export async function createInvitation(
  workspaceId: string,
  email: string,
  role: MemberRole = 'member'
): Promise<{ invitation: InvitationRow | null; error: string | null }> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { invitation: null, error: 'Not signed in' }

  const { data, error } = await supabase
    .from('invitations')
    .insert({
      workspace_id: workspaceId,
      email: email.trim().toLowerCase(),
      role,
      invited_by: user.id,
      status: 'pending',
    })
    .select('*')
    .single()

  if (error) {
    console.error('createInvitation', error)
    return { invitation: null, error: error.message }
  }
  return { invitation: data as InvitationRow, error: null }
}

export async function revokeInvitation(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('invitations')
    .update({ status: 'revoked' })
    .eq('id', id)
  return !error
}

export async function removeMember(memberId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from('workspace_members').delete().eq('id', memberId)
  return !error
}

export async function updateMemberRole(
  memberId: string,
  role: MemberRole
): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('workspace_members')
    .update({ role })
    .eq('id', memberId)
  return !error
}

export async function acceptInvitation(
  token: string
): Promise<{ workspaceId: string | null; error: string | null }> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('accept_invitation', {
    invite_token: token,
  })
  if (error) {
    console.error('acceptInvitation', error)
    return { workspaceId: null, error: error.message }
  }
  return { workspaceId: data as string, error: null }
}

export async function getInvitationByToken(
  token: string
): Promise<(InvitationRow & { workspace_name?: string }) | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .maybeSingle()
  if (error || !data) return null

  const { data: ws } = await supabase
    .from('workspaces')
    .select('name')
    .eq('id', data.workspace_id)
    .maybeSingle()

  return {
    ...(data as InvitationRow),
    workspace_name: ws?.name,
  }
}

export async function ensureProfile() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email,
    full_name:
      (user.user_metadata?.full_name as string) ||
      user.email?.split('@')[0] ||
      null,
  })
}

export async function getMyRole(workspaceId: string): Promise<MemberRole | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .maybeSingle()
  return (data?.role as MemberRole) || null
}
