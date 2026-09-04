import { createClient } from '@/lib/supabase/client'
import type { Item, ItemStatus, Feedback } from '@/types/database'
import { ensureProfile } from '@/lib/workspace'

export async function ensureWorkspace(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  await ensureProfile()

  const { data: memberships } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)

  if (memberships && memberships.length > 0) {
    return memberships[0].workspace_id
  }

  // Bootstrap first workspace
  const slug = `ws-${user.id.slice(0, 8)}`
  const { data: ws, error: wsErr } = await supabase
    .from('workspaces')
    .insert({ name: 'My workspace', slug })
    .select('id')
    .single()

  if (wsErr || !ws) {
    console.error('workspace create', wsErr)
    return null
  }

  const { error: memErr } = await supabase.from('workspace_members').insert({
    workspace_id: ws.id,
    user_id: user.id,
    role: 'owner',
  })

  if (memErr) {
    console.error('member create', memErr)
    return null
  }

  return ws.id
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
  const { data: { user } } = await supabase.auth.getUser()

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
  patch: Partial<Pick<Item, 'title' | 'description' | 'status' | 'priority' | 'owner_name' | 'target_date'>>
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
  const { data: { user } } = await supabase.auth.getUser()

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
