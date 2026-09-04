'use client'

import type { Product, Item } from '@/types/database'

type Props = {
  products: Product[]
  activeId: string | null
  items: Item[]
  onSelect: (id: string) => void
  onCreate: (name: string) => void
  collapsed?: boolean
}

export function ProductSidebar({
  products,
  activeId,
  items,
  onSelect,
  onCreate,
}: Props) {
  function counts(productId: string) {
    const list = items.filter((i) => i.product_id === productId)
    return {
      now: list.filter((i) => i.status === 'now').length,
      next: list.filter((i) => i.status === 'next').length,
    }
  }

  function handleCreate() {
    const name = window.prompt('Product or initiative name')
    if (name?.trim()) onCreate(name.trim())
  }

  return (
    <aside className="w-56 shrink-0 border-r border-zinc-200 bg-white flex flex-col h-full">
      <div className="px-3 h-12 flex items-center border-b border-zinc-100">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          Products
        </p>
      </div>
      <nav className="flex-1 overflow-auto py-2 px-2 space-y-0.5">
        {products
          .filter((p) => p.status !== 'archived')
          .map((p) => {
            const c = counts(p.id)
            const active = p.id === activeId
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelect(p.id)}
                className={`w-full text-left rounded-lg px-2.5 py-2 transition ${
                  active
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="text-sm font-medium truncate flex-1">
                    {p.name}
                  </span>
                </div>
                <div
                  className={`mt-1 text-[10px] pl-4 ${
                    active ? 'text-zinc-400' : 'text-zinc-400'
                  }`}
                >
                  {c.now} now · {c.next} next
                </div>
              </button>
            )
          })}
      </nav>
      <div className="p-2 border-t border-zinc-100">
        <button
          type="button"
          onClick={handleCreate}
          className="w-full text-left text-xs text-zinc-500 hover:text-zinc-800 px-2.5 py-2 rounded-lg hover:bg-zinc-50"
        >
          + New product
        </button>
      </div>
    </aside>
  )
}
