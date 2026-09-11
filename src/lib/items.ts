import { createClient } from '@/lib/supabase/client'
import type { Item, ItemStatus, Feedback } from '@/types/database'
import { ensureProfile } from '@/lib/workspace'

export async function ensureWorkspace(): Promise<{
  id: string | null
  error: string | null
}> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { id: null, error: 'Not signed in' }

  try {
    await ensureProfile()
  } catch {
    // profile table may be missing - continue
  }

  const { data: memberships, error: memReadErr } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)

  if (memReadErr) {
    console.error('membership read', memReadErr)
    return {
      id: null,
      error: memReadErr.message,
    }
  }

  if (memberships && memberships.length > 0) {
    return { id: memberships[0].workspace_id, error: null }
  }

  // Prefer security-definer RPC (bypasses RLS chicken-and-egg)
  const { data: rpcId, error: rpcErr } = await supabase.rpc(
    'create_workspace_for_me',
    { ws_name: 'My workspace' }
  )

  if (!rpcErr && rpcId) {
    return { id: rpcId as string, error: null }
  }

  if (rpcErr) {
    console.error('create_workspace_for_me', rpcErr)
  }

  // Fallback: manual insert without returning row under strict RLS
  const slug = `ws-${user.id.slice(0, 8)}-${Math.random().toString(36).slice(2, 8)}`
  const { error: wsErr } = await supabase.from('workspaces').insert({
    name: 'My workspace',
    slug,
  })

  if (wsErr) {
    console.error('workspace create', wsErr)
    return {
      id: null,
      error:
        rpcErr?.message ||
        wsErr.message ||
        'Could not create workspace. Run multi-user.sql on this Supabase project.',
    }
  }

  const { data: created } = await supabase
    .from('workspaces')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  // If select blocked by RLS, try membership path after insert by slug via rpc only
  if (!created?.id) {
    return {
      id: null,
      error:
        'Workspace created but not readable (RLS). Run the latest multi-user.sql (create_workspace_for_me).',
    }
  }

  const { error: memErr } = await supabase.from('workspace_members').insert({
    workspace_id: created.id,
    user_id: user.id,
    role: 'owner',
  })

  if (memErr) {
    console.error('member create', memErr)
    return { id: null, error: memErr.message }
  }

  return { id: created.id, error: null }
}

export async function fetchItems(workspaceId: string): Promise<Item[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('fetchItems', error)
    return []
  }
  return (data || []) as Item[]
}

export async function createItem(
  workspaceId: string,
  title: string,
  status: ItemStatus = 'idea',
  productId?: string
): Promise<Item | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('items')
    .insert({
      workspace_id: workspaceId,
      product_id: productId ?? null,
      title,
      status,
      created_by: user?.id ?? null,
      sort_order: 0,
    })
    .select('*')
    .single()

  if (error) {
    console.error('createItem', error)
    return null
  }
  return data as Item
}

export async function updateItemStatus(
  id: string,
  status: ItemStatus
): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('items')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('updateItemStatus', error)
    return false
  }
  return true
}

export async function updateItem(
  id: string,
  patch: Partial<
    Pick<
      Item,
      'title' | 'description' | 'status' | 'priority' | 'owner_name' | 'target_date' | 'goal_id'
    >
  >
): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('items')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('updateItem', error)
    return false
  }
  return true
}

export async function fetchFeedback(itemId: string): Promise<Feedback[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('item_id', itemId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('fetchFeedback', error)
    return []
  }
  return (data || []) as Feedback[]
}

export async function addFeedback(
  workspaceId: string,
  itemId: string,
  content: string,
  source?: string
): Promise<Feedback | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('feedback')
    .insert({
      workspace_id: workspaceId,
      item_id: itemId,
      content,
      source: source || null,
      created_by: user?.id ?? null,
    })
    .select('*')
    .single()

  if (error) {
    console.error('addFeedback', error)
    return null
  }
  return data as Feedback
}

export async function fetchProducts(workspaceId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('sort_order', { ascending: true })
  if (error) {
    console.error('fetchProducts', error)
    return []
  }
  return data || []
}

export async function createProduct(workspaceId: string, name: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .insert({ workspace_id: workspaceId, name })
    .select('*')
    .single()
  if (error) {
    console.error('createProduct', error)
    return null
  }
  return data
}

export async function fetchGoals(
  workspaceId: string,
  productId?: string
): Promise<import('@/types/database').Goal[]> {
  const supabase = createClient()
  let q = supabase
    .from('goals')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: true })
  if (productId) {
    q = q.eq('product_id', productId)
  }
  const { data, error } = await q
  if (error) {
    console.error('fetchGoals', error)
    return []
  }
  return (data || []) as import('@/types/database').Goal[]
}

export async function createGoal(
  workspaceId: string,
  productId: string,
  title: string,
  metric?: string
): Promise<import('@/types/database').Goal | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('goals')
    .insert({
      workspace_id: workspaceId,
      product_id: productId,
      title: title.trim(),
      metric: metric?.trim() || null,
      status: 'active',
      created_by: user?.id ?? null,
    })
    .select('*')
    .single()
  if (error) {
    console.error('createGoal', error)
    return null
  }
  return data as import('@/types/database').Goal
}

export async function updateGoal(
  id: string,
  patch: Partial<
    Pick<
      import('@/types/database').Goal,
      'title' | 'description' | 'metric' | 'status'
    >
  >
): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('goals')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) {
    console.error('updateGoal', error)
    return false
  }
  return true
}

export async function deleteGoal(id: string): Promise<boolean> {
  const supabase = createClient()
  // clear item links first is optional; FK may set null
  const { error } = await supabase.from('goals').delete().eq('id', id)
  if (error) {
    console.error('deleteGoal', error)
    return false
  }
  return true
}

export async function deleteItem(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from('items').delete().eq('id', id)
  if (error) {
    console.error('deleteItem', error)
    return false
  }
  return true
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = createClient()
  // items/goals cascade or null via FK; delete product last
  await supabase.from('items').delete().eq('product_id', id)
  await supabase.from('goals').delete().eq('product_id', id)
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) {
    console.error('deleteProduct', error)
    return false
  }
  return true
}
