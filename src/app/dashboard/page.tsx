'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import type { Item, ItemStatus } from '@/types/database'
import { STATUS_LABELS } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import {
  ensureWorkspace,
  fetchItems,
  createItem,
  updateItemStatus,
} from '@/lib/items'
import { ItemDetail } from '@/components/ItemDetail'

const COLUMNS: ItemStatus[] = ['now', 'next', 'later']

const DEMO_ITEMS: Item[] = [
  {
    id: 'demo-1',
    workspace_id: 'demo',
    goal_id: null,
    title: 'Ship magic-link login',
    description: 'Get auth working end-to-end so real data can persist.',
    status: 'now',
    priority: 'high',
    owner_id: null,
    sort_order: 0,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    workspace_id: 'demo',
    goal_id: null,
    title: 'Run Supabase schema',
    description: 'Execute supabase/schema.sql in the SQL editor.',
    status: 'now',
    priority: 'high',
    owner_id: null,
    sort_order: 1,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    workspace_id: 'demo',
    goal_id: null,
    title: 'Stakeholder update template',
    description: 'One-click progress / risks / next / asks.',
    status: 'next',
    priority: 'medium',
    owner_id: null,
    sort_order: 0,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    workspace_id: 'demo',
    goal_id: null,
    title: 'Feedback on every item',
    description: 'So “why are we building this?” is always one click away.',
    status: 'next',
    priority: 'medium',
    owner_id: null,
    sort_order: 1,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-5',
    workspace_id: 'demo',
    goal_id: null,
    title: 'Optional goals view',
    description: 'Lightweight framing — not required hierarchy.',
    status: 'later',
    priority: 'low',
    owner_id: null,
    sort_order: 0,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

function ItemCard({
  item,
  onMove,
  onOpen,
}: {
  item: Item
  onMove: (id: string, status: ItemStatus) => void
  onOpen: (item: Item) => void
}) {
  return (
    <div
      className="group bg-white border border-zinc-200 rounded-lg p-3 shadow-sm hover:border-zinc-300 transition cursor-pointer"
      onClick={() => onOpen(item)}
    >
      <p className="text-sm font-medium text-zinc-900 leading-snug">{item.title}</p>
      {item.description && (
        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{item.description}</p>
      )}
      <div
        className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition"
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
  onMove,
  onAdd,
  onOpen,
}: {
  status: ItemStatus
  items: Item[]
  onMove: (id: string, status: ItemStatus) => void
  onAdd: (status: ItemStatus, title: string) => void
  onOpen: (item: Item) => void
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
    <div className="flex flex-col min-w-0 flex-1">
      <div className="flex items-center justify-between mb-3 px-0.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {STATUS_LABELS[status]}
          <span className="ml-1.5 text-zinc-400 font-normal">{items.length}</span>
        </h2>
      </div>

      <div className="space-y-2 flex-1">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onMove={onMove} onOpen={onOpen} />
        ))}

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

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>(DEMO_ITEMS)
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(true)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [selected, setSelected] = useState<Item | null>(null)
  const [ideaOpen, setIdeaOpen] = useState(false)
  const [ideaDraft, setIdeaDraft] = useState('')

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          if (!cancelled) {
            setDemoMode(true)
            setItems(DEMO_ITEMS)
            setLoading(false)
          }
          return
        }

        if (!cancelled) setUserEmail(user.email ?? null)

        const wsId = await ensureWorkspace()
        if (!wsId) {
          if (!cancelled) {
            setDemoMode(true)
            setLoading(false)
          }
          return
        }

        const remote = await fetchItems(wsId)
        if (!cancelled) {
          setWorkspaceId(wsId)
          setDemoMode(false)
          setItems(remote.length > 0 ? remote : [])
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setDemoMode(true)
          setItems(DEMO_ITEMS)
          setLoading(false)
        }
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  const moveItem = useCallback(
    async (id: string, status: ItemStatus) => {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status } : i))
      )
      setSelected((cur) => (cur?.id === id ? { ...cur, status } : cur))

      if (!demoMode) {
        await updateItemStatus(id, status)
      }
    },
    [demoMode]
  )

  const addItem = useCallback(
    async (status: ItemStatus, title: string) => {
      if (demoMode || !workspaceId) {
        const local: Item = {
          id: crypto.randomUUID(),
          workspace_id: 'demo',
          goal_id: null,
          title,
          description: null,
          status,
          priority: 'none',
          owner_id: null,
          sort_order: 0,
          created_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setItems((prev) => [local, ...prev])
        return
      }

      const created = await createItem(workspaceId, title, status)
      if (created) {
        setItems((prev) => [created, ...prev])
      }
    },
    [demoMode, workspaceId]
  )

  const handleItemUpdate = useCallback((updated: Item) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
    setSelected(updated)
  }, [])

  const ideas = items.filter((i) => i.status === 'idea')
  const done = items.filter((i) => i.status === 'done')

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
          <span className="text-sm text-zinc-600">Roadmap</span>
        </div>
        <div className="flex items-center gap-2">
          {demoMode && (
            <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
              Demo mode
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
          {!userEmail && (
            <Link
              href="/login"
              className="text-xs bg-zinc-900 text-white px-3 py-1.5 rounded-md hover:bg-zinc-800"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <p className="text-sm text-zinc-400 py-12 text-center">Loading…</p>
          ) : (
            <>
              <p className="text-sm text-zinc-500 mb-6">
                {demoMode
                  ? 'Demo data — sign in to persist items to Supabase. Click any card for detail & feedback.'
                  : 'Your roadmap. Click an item for detail and feedback.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {COLUMNS.map((status) => (
                  <Column
                    key={status}
                    status={status}
                    items={items
                      .filter((i) => i.status === status)
                      .sort((a, b) => a.sort_order - b.sort_order)}
                    onMove={moveItem}
                    onAdd={addItem}
                    onOpen={setSelected}
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
                        className="text-sm text-zinc-500 bg-white border border-zinc-100 rounded-md px-3 py-1.5"
                      >
                        <span className="line-through decoration-zinc-300">
                          {item.title}
                        </span>
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

      {/* Ideas panel */}
      {ideaOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setIdeaOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white shadow-xl border-l border-zinc-200 flex flex-col">
            <div className="h-12 flex items-center justify-between px-4 border-b border-zinc-200">
              <h2 className="font-semibold text-sm">Ideas</h2>
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
              <p className="text-[11px] text-zinc-400 mt-1.5">Press Enter to add</p>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-2">
              {ideas.length === 0 && (
                <p className="text-sm text-zinc-400 text-center py-8">
                  No ideas yet. Dump anything here.
                </p>
              )}
              {ideas.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-50 border border-zinc-100 rounded-lg p-3 cursor-pointer hover:border-zinc-200"
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
                        className="text-[11px] px-1.5 py-0.5 rounded bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
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

      {/* Item detail */}
      {selected && (
        <ItemDetail
          item={selected}
          workspaceId={workspaceId}
          demoMode={demoMode}
          onClose={() => setSelected(null)}
          onUpdate={handleItemUpdate}
          onMove={moveItem}
        />
      )}
    </div>
  )
}
