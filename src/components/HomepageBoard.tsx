'use client'

import { useState, useCallback } from 'react'
import type { Item, ItemStatus } from '@/types/database'
import { STATUS_LABELS } from '@/types/database'
import { DEMO_ITEMS, DEMO_FEEDBACK } from '@/lib/demo-data'
import { ItemDetail } from '@/components/ItemDetail'

const COLUMNS: ItemStatus[] = ['now', 'next', 'later']

export function HomepageBoard() {
  const [items, setItems] = useState<Item[]>(DEMO_ITEMS)
  const [selected, setSelected] = useState<Item | null>(null)

  const moveItem = useCallback((id: string, status: ItemStatus) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    setSelected((cur) => (cur?.id === id ? { ...cur, status } : cur))
  }, [])

  const handleUpdate = useCallback((updated: Item) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
    setSelected(updated)
  }, [])

  const ideas = items.filter((i) => i.status === 'idea')
  const done = items.filter((i) => i.status === 'done')

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="h-11 border-b border-zinc-200 bg-white flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-zinc-900">Acme Product</span>
          <span className="text-zinc-300">/</span>
          <span className="text-zinc-500">Roadmap</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
            Interactive demo
          </span>
          <span className="text-xs text-zinc-500">Ideas {ideas.length}</span>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <p className="text-xs text-zinc-500 mb-4">
          Click any card to open detail & customer feedback. Move items with the buttons on hover.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {COLUMNS.map((status) => {
            const colItems = items
              .filter((i) => i.status === status)
              .sort((a, b) => a.sort_order - b.sort_order)
            return (
              <div key={status}>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  {STATUS_LABELS[status]}{' '}
                  <span className="text-zinc-400 font-normal">{colItems.length}</span>
                </h3>
                <div className="space-y-2">
                  {colItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelected(item)}
                      className="w-full text-left group bg-white border border-zinc-200 rounded-lg p-3 shadow-sm hover:border-zinc-300 transition"
                    >
                      <p className="text-sm font-medium text-zinc-900 leading-snug">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      {DEMO_FEEDBACK[item.id]?.length ? (
                        <p className="text-[11px] text-amber-700 mt-2">
                          {DEMO_FEEDBACK[item.id].length} feedback note
                          {DEMO_FEEDBACK[item.id].length > 1 ? 's' : ''}
                        </p>
                      ) : null}
                      <div
                        className="mt-2 flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {COLUMNS.filter((s) => s !== status).map((s) => (
                          <span
                            key={s}
                            role="button"
                            tabIndex={0}
                            onClick={() => moveItem(item.id, s)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') moveItem(item.id, s)
                            }}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 hover:bg-zinc-200 cursor-pointer"
                          >
                            → {STATUS_LABELS[s]}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {done.length > 0 && (
          <div className="mt-6 pt-4 border-t border-zinc-200">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Done · {done.length}
            </p>
            <div className="flex flex-wrap gap-2">
              {done.map((item) => (
                <span
                  key={item.id}
                  className="text-xs text-zinc-500 bg-white border border-zinc-100 rounded-md px-2.5 py-1 line-through decoration-zinc-300"
                >
                  {item.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {selected && (
        <ItemDetail
          item={selected}
          workspaceId={null}
          demoMode
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
          onMove={moveItem}
        />
      )}
    </div>
  )
}
