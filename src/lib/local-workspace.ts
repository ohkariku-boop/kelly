import type { Item, ItemStatus, Feedback } from '@/types/database'
import { DEMO_ITEMS, DEMO_FEEDBACK } from '@/lib/demo-data'

const STORAGE_KEY = 'kelly-pm-workspace-v1'
const SESSION_KEY = 'kelly-pm-session'

export type LocalWorkspace = {
  items: Item[]
  feedback: Record<string, Feedback[]>
}

export function isKellyPmSession(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(SESSION_KEY) === '1'
}

export function startKellyPmSession() {
  localStorage.setItem(SESSION_KEY, '1')
  if (!localStorage.getItem(STORAGE_KEY)) {
    saveWorkspace({
      items: structuredClone(DEMO_ITEMS),
      feedback: structuredClone(DEMO_FEEDBACK),
    })
  }
}

export function endKellyPmSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function loadWorkspace(): LocalWorkspace {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {
        items: structuredClone(DEMO_ITEMS),
        feedback: structuredClone(DEMO_FEEDBACK),
      }
    }
    return JSON.parse(raw) as LocalWorkspace
  } catch {
    return {
      items: structuredClone(DEMO_ITEMS),
      feedback: structuredClone(DEMO_FEEDBACK),
    }
  }
}

export function saveWorkspace(ws: LocalWorkspace) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ws))
}

export function localCreateItem(title: string, status: ItemStatus): Item {
  const ws = loadWorkspace()
  const item: Item = {
    id: crypto.randomUUID(),
    workspace_id: 'kelly-pm',
    goal_id: null,
    title,
    description: null,
    status,
    priority: 'none',
    owner_id: null,
    sort_order: 0,
    created_by: 'kelly-pm',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  ws.items = [item, ...ws.items]
  saveWorkspace(ws)
  return item
}

export function localUpdateStatus(id: string, status: ItemStatus) {
  const ws = loadWorkspace()
  ws.items = ws.items.map((i) =>
    i.id === id ? { ...i, status, updated_at: new Date().toISOString() } : i
  )
  saveWorkspace(ws)
}

export function localUpdateItem(
  id: string,
  patch: Partial<Pick<Item, 'title' | 'description' | 'status' | 'priority'>>
) {
  const ws = loadWorkspace()
  ws.items = ws.items.map((i) =>
    i.id === id
      ? { ...i, ...patch, updated_at: new Date().toISOString() }
      : i
  )
  saveWorkspace(ws)
}

export function localAddFeedback(
  itemId: string,
  content: string,
  source?: string
): Feedback {
  const ws = loadWorkspace()
  const fb: Feedback = {
    id: crypto.randomUUID(),
    workspace_id: 'kelly-pm',
    item_id: itemId,
    content,
    source: source || 'note',
    customer_name: null,
    created_by: 'kelly-pm',
    created_at: new Date().toISOString(),
  }
  ws.feedback[itemId] = [fb, ...(ws.feedback[itemId] || [])]
  saveWorkspace(ws)
  return fb
}

export function localGetFeedback(itemId: string): Feedback[] {
  return loadWorkspace().feedback[itemId] || []
}
