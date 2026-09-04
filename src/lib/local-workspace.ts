import type { Item, ItemStatus, Feedback, Product } from '@/types/database'
import { PRODUCT_COLORS } from '@/types/database'
import { DEMO_ITEMS, DEMO_FEEDBACK, DEMO_PRODUCTS } from '@/lib/demo-data'

const STORAGE_KEY = 'kelly-pm-workspace-v2'
const SESSION_KEY = 'kelly-pm-session'
const ACTIVE_PRODUCT_KEY = 'kelly-pm-active-product'

export type LocalWorkspace = {
  products: Product[]
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
      products: structuredClone(DEMO_PRODUCTS),
      items: structuredClone(DEMO_ITEMS),
      feedback: structuredClone(DEMO_FEEDBACK),
    })
    setActiveProductId(DEMO_PRODUCTS[0]?.id ?? null)
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
        products: structuredClone(DEMO_PRODUCTS),
        items: structuredClone(DEMO_ITEMS),
        feedback: structuredClone(DEMO_FEEDBACK),
      }
    }
    const parsed = JSON.parse(raw) as LocalWorkspace
    if (!parsed.products?.length) {
      parsed.products = structuredClone(DEMO_PRODUCTS)
    }
    parsed.products = (parsed.products || []).map((pr) => ({
      ...pr,
      horizon: pr.horizon ?? null,
    }))
    parsed.items = (parsed.items || []).map((i) => ({
      ...i,
      product_id: i.product_id || parsed.products[0]?.id || 'prod-mobile',
      owner_name: i.owner_name ?? null,
      target_date: i.target_date ?? null,
    }))
    return parsed
  } catch {
    return {
      products: structuredClone(DEMO_PRODUCTS),
      items: structuredClone(DEMO_ITEMS),
      feedback: structuredClone(DEMO_FEEDBACK),
    }
  }
}

export function saveWorkspace(ws: LocalWorkspace) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ws))
}

export function getActiveProductId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACTIVE_PRODUCT_KEY)
}

export function setActiveProductId(id: string | null) {
  if (id) localStorage.setItem(ACTIVE_PRODUCT_KEY, id)
  else localStorage.removeItem(ACTIVE_PRODUCT_KEY)
}

export function localCreateProduct(name: string, description?: string): Product {
  const ws = loadWorkspace()
  const color = PRODUCT_COLORS[ws.products.length % PRODUCT_COLORS.length]
  const product: Product = {
    id: crypto.randomUUID(),
    workspace_id: 'kelly-pm',
    name: name.trim(),
    description: description?.trim() || null,
    horizon: null,
    color,
    status: 'active',
    sort_order: ws.products.length,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  ws.products = [...ws.products, product]
  saveWorkspace(ws)
  setActiveProductId(product.id)
  return product
}

export function localCreateItem(
  productId: string,
  title: string,
  status: ItemStatus
): Item {
  const ws = loadWorkspace()
  const item: Item = {
    id: crypto.randomUUID(),
    workspace_id: 'kelly-pm',
    product_id: productId,
    goal_id: null,
    title,
    description: null,
    status,
    priority: 'none',
    owner_id: null,
    owner_name: null,
    target_date: null,
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
  patch: Partial<
    Pick<Item, 'title' | 'description' | 'status' | 'priority' | 'product_id' | 'owner_name' | 'target_date'>
  >
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

export function localUpdateProduct(
  id: string,
  patch: Partial<Pick<Product, 'name' | 'description' | 'horizon' | 'color' | 'status'>>
) {
  const ws = loadWorkspace()
  ws.products = ws.products.map((p) =>
    p.id === id
      ? { ...p, ...patch, updated_at: new Date().toISOString() }
      : p
  )
  saveWorkspace(ws)
}
