'use client'

import { useState, useCallback, useRef, useMemo } from 'react'
import type { Item, ItemStatus } from '@/types/database'
import { STATUS_LABELS } from '@/types/database'
import { DEMO_ITEMS, DEMO_FEEDBACK, DEMO_PRODUCTS } from '@/lib/demo-data'
import { ItemDetail } from '@/components/ItemDetail'
import { initials, formatTargetDate } from '@/lib/format'

const COLUMNS: ItemStatus[] = ['now', 'next', 'later']

export function HomepageBoard() {
  const [items, setItems] = useState<Item[]>(DEMO_ITEMS)
  const [activeProductId, setActiveProductId] = useState(DEMO_PRODUCTS[0]?.id ?? '')
  const [selected, setSelected] = useState<Item | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverStatus, setDragOverStatus] = useState<ItemStatus | null>(null)
  const dragItemId = useRef<string | null>(null)

  const activeProduct = DEMO_PRODUCTS.find((p) => p.id === activeProductId)
  const productItems = useMemo(
    () => items.filter((i) => i.product_id === activeProductId),
    [items, activeProductId]
  )

  const moveItem = useCallback((id: string, status: ItemStatus) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    setSelected((cur) => (cur?.id === id ? { ...cur, status } : cur))
  }, [])

  const handleUpdate = useCallback((updated: Item) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
    setSelected(updated)
  }, [])

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
    if (id) moveItem(id, status)
    setDraggingId(null)
    setDragOverStatus(null)
    dragItemId.current = null
  }

  const done = productItems.filter((i) => i.status === 'done')

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="h-11 border-b border-zinc-200 bg-white flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-zinc-900">Acme Product Org</span>
          <span className="text-zinc-300">/</span>
          <span className="text-zinc-500">Products</span>
        </div>
        <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
          Interactive demo
        </span>
      </div>

      {/* Product switcher */}
      <div className="bg-white border-b border-zinc-100 px-3 py-2 flex gap-2 overflow-x-auto">
        {DEMO_PRODUCTS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setActiveProductId(p.id)
              setSelected(null)
            }}
            className={`shrink-0 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition ${
              p.id === activeProductId
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
            }`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: p.id === activeProductId ? '#fff' : p.color,
              }}
            />
            {p.name}
          </button>
        ))}
      </div>

      <div className="p-4 md:p-6">
        {activeProduct?.description && (
          <p className="text-xs text-zinc-500 mb-1">{activeProduct.description}</p>
        )}
        {activeProduct?.horizon && (
          <p className="text-xs text-zinc-400 mb-4">
            <span className="font-medium text-zinc-500">Horizon:</span> {activeProduct.horizon}
          </p>
        )}
        <p className="text-xs text-zinc-400 mb-4">
          Switch products above. Each has its own Now / Next / Later board — drag cards or click
          for feedback.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {COLUMNS.map((status) => {
            const colItems = productItems
              .filter((i) => i.status === status)
              .sort((a, b) => a.sort_order - b.sort_order)
            const isOver = dragOverStatus === status
            return (
              <div
                key={status}
                onDragOver={(e) => onDragOver(e, status)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, status)}
                className={`rounded-xl p-2 min-h-[140px] transition-colors ${
                  isOver ? 'bg-zinc-200/80 ring-2 ring-zinc-400 ring-inset' : ''
                }`}
              >
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2 px-1">
                  {STATUS_LABELS[status]}{' '}
                  <span className="text-zinc-400 font-normal">{colItems.length}</span>
                </h3>
                <div className="space-y-2 min-h-[80px]">
                  {colItems.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, item.id)}
                      onDragEnd={onDragEnd}
                      onClick={() => setSelected(item)}
                      className={`w-full text-left bg-white border border-zinc-200 rounded-lg p-3 shadow-sm hover:border-zinc-300 transition cursor-grab active:cursor-grabbing ${
                        draggingId === item.id ? 'opacity-40' : ''
                      }`}
                    >
                      <p className="text-sm font-medium text-zinc-900 leading-snug">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-500">
                        {item.owner_name ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[8px] font-semibold">
                              {initials(item.owner_name)}
                            </span>
                            {item.owner_name}
                          </span>
                        ) : null}
                        {item.target_date && (
                          <span className="text-zinc-400">
                            {item.owner_name ? '· ' : ''}
                            {formatTargetDate(item.target_date)}
                          </span>
                        )}
                      </div>
                      {DEMO_FEEDBACK[item.id]?.length ? (
                        <p className="text-[11px] text-amber-700 mt-1.5">
                          {DEMO_FEEDBACK[item.id].length} feedback note
                          {DEMO_FEEDBACK[item.id].length > 1 ? 's' : ''}
                        </p>
                      ) : null}
                    </div>
                  ))}
                  {colItems.length === 0 && (
                    <div className="border border-dashed border-zinc-300 rounded-lg py-6 text-center text-xs text-zinc-400">
                      Drop here
                    </div>
                  )}
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
