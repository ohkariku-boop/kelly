'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Item, ItemStatus, Product } from '@/types/database'
import { STATUS_LABELS } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import {
  ensureWorkspace,
  fetchItems,
  createItem,
  updateItemStatus,
  updateItem,
  fetchProducts,
  createProduct,
} from '@/lib/items'
import { ItemDetail } from '@/components/ItemDetail'
import { ProductSidebar } from '@/components/ProductSidebar'
import { DEMO_ITEMS, DEMO_PRODUCTS } from '@/lib/demo-data'
import { initials, formatTargetDate } from '@/lib/format'
import { localUpdateProduct } from '@/lib/local-workspace'
import {
  isKellyPmSession,
  endKellyPmSession,
  loadWorkspace,
  localCreateItem,
  localUpdateStatus,
  localUpdateItem,
  localCreateProduct,
  getActiveProductId,
  setActiveProductId,
} from '@/lib/local-workspace'

const COLUMNS: ItemStatus[] = ['now', 'next', 'later']

function ItemCard({
  item,
  draggingId,
  onOpen,
  onDragStart,
  onDragEnd,
  onMove,
}: {
  item: Item
  draggingId: string | null
  onOpen: (item: Item) => void
  onDragStart: (e: React.DragEvent, id: string) => void
  onDragEnd: () => void
  onMove: (id: string, status: ItemStatus) => void
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(item)}
      className={`group bg-white border border-zinc-200 rounded-lg p-3 shadow-sm hover:border-zinc-300 transition cursor-grab active:cursor-grabbing ${
        draggingId === item.id ? 'opacity-40' : ''
      }`}
    >
      <p className="text-sm font-medium text-zinc-900 leading-snug">{item.title}</p>
      {item.description && (
        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{item.description}</p>
      )}
      <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-500">
        {item.owner_name ? (
          <span className="inline-flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[8px] font-semibold">
              {initials(item.owner_name)}
            </span>
            {item.owner_name}
          </span>
        ) : item.status === 'now' ? (
          <span className="text-amber-600">No owner</span>
        ) : null}
        {item.target_date && (
          <span className="text-zinc-400">· {formatTargetDate(item.target_date)}</span>
        )}
      </div>
      <div
        className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition"
        onClick={(e) => e.stopPropagation()}
      >
        {COLUMNS.filter((s) => s !== item.status).map((s) => (
          <button
            key={s}
            onClick={() => onMove(item.id, s)}
            className="text-[11px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          >
            → {STATUS_LABELS[s]}
          </button>
        ))}
        {item.status !== 'done' && (
          <button
            onClick={() => onMove(item.id, 'done')}
            className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ml-auto"
          >
            Done
          </button>
        )}
      </div>
    </div>
  )
}

function Column({
  status,
  items,
  draggingId,
  isDragOver,
  onMove,
  onAdd,
  onOpen,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  status: ItemStatus
  items: Item[]
  draggingId: string | null
  isDragOver: boolean
  onMove: (id: string, status: ItemStatus) => void
  onAdd: (status: ItemStatus, title: string) => void
  onOpen: (item: Item) => void
  onDragStart: (e: React.DragEvent, id: string) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent, status: ItemStatus) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, status: ItemStatus) => void
}) {
  const [draft, setDraft] = useState('')
  const [adding, setAdding] = useState(false)

  function submit() {
    const title = draft.trim()
    if (!title) return
    onAdd(status, title)
    setDraft('')
    setAdding(false)
  }

  return (
    <div
      className={`flex flex-col min-w-0 flex-1 rounded-xl p-2 transition-colors ${
        isDragOver ? 'bg-zinc-200/70 ring-2 ring-zinc-400 ring-inset' : ''
      }`}
      onDragOver={(e) => onDragOver(e, status)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="flex items-center justify-between mb-3 px-0.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {STATUS_LABELS[status]}
          <span className="ml-1.5 text-zinc-400 font-normal">{items.length}</span>
        </h2>
      </div>

      <div className="space-y-2 flex-1 min-h-[100px]">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            draggingId={draggingId}
            onMove={onMove}
            onOpen={onOpen}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}

        {items.length === 0 && !adding && (
          <div className="border border-dashed border-zinc-300 rounded-lg py-8 text-center text-xs text-zinc-400">
            Drop items here
          </div>
        )}

        {adding ? (
          <div className="bg-white border border-zinc-300 rounded-lg p-2 shadow-sm">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit()
                if (e.key === 'Escape') {
                  setAdding(false)
                  setDraft('')
                }
              }}
              placeholder="What needs to be done?"
              className="w-full text-sm outline-none placeholder:text-zinc-400"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={submit}
                className="text-xs bg-zinc-900 text-white px-2.5 py-1 rounded hover:bg-zinc-800"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setAdding(false)
                  setDraft('')
                }}
                className="text-xs text-zinc-500 hover:text-zinc-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full text-left text-sm text-zinc-400 hover:text-zinc-600 py-2 px-1 rounded-lg hover:bg-zinc-100/80 transition"
          >
            + Add item
          </button>
        )}
      </div>
    </div>
  )
}

type Mode = 'loading' | 'demo' | 'kelly-pm' | 'supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [activeProductId, setActiveProductIdState] = useState<string | null>(null)
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('loading')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [selected, setSelected] = useState<Item | null>(null)
  const [ideaOpen, setIdeaOpen] = useState(false)
  const [ideaDraft, setIdeaDraft] = useState('')
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverStatus, setDragOverStatus] = useState<ItemStatus | null>(null)
  const dragItemId = useRef<string | null>(null)

  const selectProduct = useCallback((id: string) => {
    setActiveProductIdState(id)
    setActiveProductId(id)
    setSelected(null)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function init() {
      if (isKellyPmSession()) {
        const ws = loadWorkspace()
        if (!cancelled) {
          setProducts(ws.products)
          setItems(ws.items)
          const saved = getActiveProductId()
          const id =
            saved && ws.products.some((p) => p.id === saved)
              ? saved
              : ws.products[0]?.id ?? null
          setActiveProductIdState(id)
          if (id) setActiveProductId(id)
          setMode('kelly-pm')
          setUserEmail('Kelly PM')
        }
        return
      }

      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          if (!cancelled) {
            setMode('demo')
            setProducts(DEMO_PRODUCTS)
            setItems(DEMO_ITEMS)
            setActiveProductIdState(DEMO_PRODUCTS[0]?.id ?? null)
          }
          return
        }

        if (!cancelled) setUserEmail(user.email ?? null)

        const wsId = await ensureWorkspace()
        if (!wsId) {
          if (!cancelled) {
            setMode('demo')
            setProducts(DEMO_PRODUCTS)
            setItems(DEMO_ITEMS)
            setActiveProductIdState(DEMO_PRODUCTS[0]?.id ?? null)
          }
          return
        }

        const [remoteProducts, remoteItems] = await Promise.all([
          fetchProducts(wsId),
          fetchItems(wsId),
        ])
        if (!cancelled) {
          setWorkspaceId(wsId)
          setMode('supabase')
          const prods = (remoteProducts as Product[]) || []
          setProducts(prods)
          setItems(remoteItems)
          setActiveProductIdState(prods[0]?.id ?? null)
        }
      } catch {
        if (!cancelled) {
          setMode('demo')
          setProducts(DEMO_PRODUCTS)
          setItems(DEMO_ITEMS)
          setActiveProductIdState(DEMO_PRODUCTS[0]?.id ?? null)
        }
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  const activeProduct = useMemo(
    () => products.find((p) => p.id === activeProductId) || null,
    [products, activeProductId]
  )

  const productItems = useMemo(
    () => items.filter((i) => i.product_id === activeProductId),
    [items, activeProductId]
  )

  const moveItem = useCallback(
    async (id: string, status: ItemStatus) => {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
      setSelected((cur) => (cur?.id === id ? { ...cur, status } : cur))

      if (mode === 'kelly-pm') {
        localUpdateStatus(id, status)
      } else if (mode === 'supabase') {
        await updateItemStatus(id, status)
      }
    },
    [mode]
  )

  const addItem = useCallback(
    async (status: ItemStatus, title: string) => {
      if (!activeProductId) return

      if (mode === 'kelly-pm') {
        const created = localCreateItem(activeProductId, title, status)
        setItems((prev) => [created, ...prev])
        return
      }

      if (mode === 'demo') {
        const local: Item = {
          id: crypto.randomUUID(),
          workspace_id: 'demo',
          product_id: activeProductId,
          goal_id: null,
          title,
          description: null,
          status,
          priority: 'none',
          owner_id: null,
          owner_name: null,
          target_date: null,
          sort_order: 0,
          created_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setItems((prev) => [local, ...prev])
        return
      }

      if (!workspaceId) return
      const created = await createItem(workspaceId, title, status, activeProductId)
      if (created) setItems((prev) => [created, ...prev])
    },
    [mode, workspaceId, activeProductId]
  )

  const handleCreateProduct = useCallback(
    async (name: string) => {
      if (mode === 'kelly-pm') {
        const p = localCreateProduct(name)
        setProducts((prev) => [...prev, p])
        selectProduct(p.id)
        return
      }
      if (mode === 'demo') {
        const p: Product = {
          id: crypto.randomUUID(),
          workspace_id: 'demo',
          name,
          description: null,
          horizon: null,
          color: '#6366f1',
          status: 'active',
          sort_order: products.length,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setProducts((prev) => [...prev, p])
        selectProduct(p.id)
        return
      }
      if (workspaceId) {
        const p = await createProduct(workspaceId, name)
        if (p) {
          setProducts((prev) => [...prev, p as Product])
          selectProduct((p as Product).id)
        }
      }
    },
    [mode, products.length, selectProduct, workspaceId]
  )

  const handleItemUpdate = useCallback(
    async (updated: Item) => {
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
      setSelected(updated)

      if (mode === 'kelly-pm') {
        localUpdateItem(updated.id, {
          title: updated.title,
          description: updated.description,
          status: updated.status,
          priority: updated.priority,
          owner_name: updated.owner_name,
          target_date: updated.target_date,
        })
      } else if (mode === 'supabase') {
        await updateItem(updated.id, {
          title: updated.title,
          description: updated.description,
          status: updated.status,
          priority: updated.priority,
          owner_name: updated.owner_name,
          target_date: updated.target_date,
        })
      }
    },
    [mode]
  )

  function onDragStart(e: React.DragEvent, id: string) {
    dragItemId.current = id
    setDraggingId(id)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', id)
  }

  function onDragEnd() {
    dragItemId.current = null
    setDraggingId(null)
    setDragOverStatus(null)
  }

  function onDragOver(e: React.DragEvent, status: ItemStatus) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverStatus !== status) setDragOverStatus(status)
  }

  function onDragLeave(e: React.DragEvent) {
    if (e.currentTarget === e.target) setDragOverStatus(null)
  }

  function onDrop(e: React.DragEvent, status: ItemStatus) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain') || dragItemId.current
    if (id) void moveItem(id, status)
    setDraggingId(null)
    setDragOverStatus(null)
    dragItemId.current = null
  }

  function signOut() {
    if (mode === 'kelly-pm') {
      endKellyPmSession()
      router.push('/login')
      return
    }
    const supabase = createClient()
    void supabase.auth.signOut().then(() => router.push('/login'))
  }

  const ideas = productItems.filter((i) => i.status === 'idea')
  const done = productItems.filter((i) => i.status === 'done')

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <header className="h-12 border-b border-zinc-200 bg-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">K</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">Kelly</span>
          </Link>
          <span className="text-zinc-300">/</span>
          {activeProduct && (
            <span className="text-sm text-zinc-600 flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activeProduct.color }}
              />
              {activeProduct.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {mode === 'demo' && (
            <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
              Demo mode
            </span>
          )}
          {mode === 'kelly-pm' && (
            <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
              Kelly PM
            </span>
          )}
          {userEmail && (
            <span className="text-xs text-zinc-500 hidden sm:inline">{userEmail}</span>
          )}
          <button
            onClick={() => setIdeaOpen(true)}
            className="text-xs text-zinc-600 hover:text-zinc-900 px-2 py-1 rounded hover:bg-zinc-100"
          >
            Ideas ({ideas.length})
          </button>
          {mode === 'supabase' && (
            <Link
              href="/settings/members"
              className="text-xs text-zinc-600 hover:text-zinc-900 px-2 py-1 rounded hover:bg-zinc-100"
            >
              Team
            </Link>
          )}
          {mode === 'demo' ? (
            <Link
              href="/login"
              className="text-xs bg-zinc-900 text-white px-3 py-1.5 rounded-md hover:bg-zinc-800"
            >
              Sign in
            </Link>
          ) : (
            <button
              onClick={signOut}
              className="text-xs text-zinc-500 hover:text-zinc-800 px-2 py-1"
            >
              Sign out
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {mode !== 'loading' && products.length > 0 && (
          <div className="hidden md:flex">
            <ProductSidebar
              products={products}
              activeId={activeProductId}
              items={items}
              onSelect={selectProduct}
              onCreate={handleCreateProduct}
            />
          </div>
        )}

        {/* Mobile product switcher */}
        {mode !== 'loading' && products.length > 0 && (
          <div className="md:hidden absolute top-12 left-0 right-0 z-10 bg-white border-b border-zinc-200 px-3 py-2 flex gap-2 overflow-x-auto">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => selectProduct(p.id)}
                className={`shrink-0 text-xs px-2.5 py-1 rounded-full border ${
                  p.id === activeProductId
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-600 border-zinc-200'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        <main className="flex-1 overflow-auto p-4 md:p-6 md:pt-6 pt-14">
          <div className="max-w-5xl mx-auto">
            {mode === 'loading' ? (
              <p className="text-sm text-zinc-400 py-12 text-center">Loading…</p>
            ) : !activeProduct ? (
              <div className="text-center py-16">
                <p className="text-sm text-zinc-500 mb-4">No products yet.</p>
                <button
                  onClick={() => handleCreateProduct('My first product')}
                  className="text-sm bg-zinc-900 text-white px-4 py-2 rounded-lg"
                >
                  Create a product
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: activeProduct.color }}
                    />
                    {activeProduct.name}
                  </h1>
                  {activeProduct.description && (
                    <p className="text-sm text-zinc-500 mt-1">{activeProduct.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                      Horizon
                    </span>
                    {mode === 'kelly-pm' || mode === 'demo' ? (
                      <input
                        key={activeProduct.id}
                        defaultValue={activeProduct.horizon || ''}
                        placeholder='e.g. "Now ≈ this quarter"'
                        onBlur={(e) => {
                          const horizon = e.target.value.trim() || null
                          setProducts((prev) =>
                            prev.map((p) =>
                              p.id === activeProduct.id ? { ...p, horizon } : p
                            )
                          )
                          if (mode === 'kelly-pm') {
                            localUpdateProduct(activeProduct.id, { horizon })
                          }
                        }}
                        className="text-sm text-zinc-600 bg-transparent border-b border-dashed border-zinc-300 focus:border-zinc-500 outline-none min-w-[12rem] max-w-md"
                      />
                    ) : (
                      <span className="text-sm text-zinc-600">
                        {activeProduct.horizon || '—'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {COLUMNS.map((status) => (
                    <Column
                      key={status}
                      status={status}
                      items={productItems
                        .filter((i) => i.status === status)
                        .sort((a, b) => a.sort_order - b.sort_order)}
                      draggingId={draggingId}
                      isDragOver={dragOverStatus === status}
                      onMove={moveItem}
                      onAdd={addItem}
                      onOpen={setSelected}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                    />
                  ))}
                </div>

                {done.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-zinc-200">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                      Done · {done.length}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {done.map((item) => (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={(e) => onDragStart(e, item.id)}
                          onDragEnd={onDragEnd}
                          className="text-sm text-zinc-500 bg-white border border-zinc-100 rounded-md px-3 py-1.5 cursor-grab"
                        >
                          <span className="line-through decoration-zinc-300">{item.title}</span>
                          <button
                            onClick={() => moveItem(item.id, 'later')}
                            className="ml-2 text-[11px] text-zinc-400 hover:text-zinc-600"
                          >
                            restore
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {ideaOpen && activeProduct && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/20" onClick={() => setIdeaOpen(false)} />
          <div className="relative w-full max-w-sm bg-white shadow-xl border-l border-zinc-200 flex flex-col">
            <div className="h-12 flex items-center justify-between px-4 border-b border-zinc-200">
              <h2 className="font-semibold text-sm">Ideas · {activeProduct.name}</h2>
              <button
                onClick={() => setIdeaOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 text-sm"
              >
                Close
              </button>
            </div>
            <div className="p-4 border-b border-zinc-100">
              <input
                autoFocus
                value={ideaDraft}
                onChange={(e) => setIdeaDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && ideaDraft.trim()) {
                    addItem('idea', ideaDraft.trim())
                    setIdeaDraft('')
                  }
                }}
                placeholder="Capture an idea…"
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-zinc-400"
              />
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-2">
              {ideas.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-50 border border-zinc-100 rounded-lg p-3 cursor-pointer"
                  onClick={() => {
                    setSelected(item)
                    setIdeaOpen(false)
                  }}
                >
                  <p className="text-sm text-zinc-800">{item.title}</p>
                  <div className="mt-2 flex gap-1" onClick={(e) => e.stopPropagation()}>
                    {COLUMNS.map((s) => (
                      <button
                        key={s}
                        onClick={() => moveItem(item.id, s)}
                        className="text-[11px] px-1.5 py-0.5 rounded bg-white border border-zinc-200 text-zinc-600"
                      >
                        → {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selected && (
        <ItemDetail
          item={selected}
          workspaceId={workspaceId}
          demoMode={mode !== 'supabase'}
          kellyPmMode={mode === 'kelly-pm'}
          onClose={() => setSelected(null)}
          onUpdate={(item) => {
            void handleItemUpdate(item)
          }}
          onMove={moveItem}
        />
      )}
    </div>
  )
}
