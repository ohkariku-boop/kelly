'use client'

import { useState } from 'react'
import type { Goal } from '@/types/database'

type Props = {
  goals: Goal[]
  canEdit: boolean
  onAdd: (title: string, metric?: string) => void
  onUpdateStatus: (id: string, status: Goal['status']) => void
  onRemove: (id: string) => void
}

export function ProductGoals({
  goals,
  canEdit,
  onAdd,
  onUpdateStatus,
  onRemove,
}: Props) {
  const [open, setOpen] = useState(true)
  const [draft, setDraft] = useState('')
  const [metric, setMetric] = useState('')
  const active = goals.filter((g) => g.status === 'active')
  const other = goals.filter((g) => g.status !== 'active')

  function submit() {
    const title = draft.trim()
    if (!title) return
    onAdd(title, metric.trim() || undefined)
    setDraft('')
    setMetric('')
  }

  return (
    <div className="mb-6 border border-zinc-200 rounded-xl bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-zinc-50"
      >
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Goals · {active.length}
        </span>
        <span className="text-xs text-zinc-400">{open ? 'Hide' : 'Show'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-zinc-100">
          <p className="text-[11px] text-zinc-400 pt-2">
            Optional outcomes for this product. Link items to a goal when the bet
            is meant to move the metric.
          </p>
          {active.length === 0 && other.length === 0 && (
            <p className="text-sm text-zinc-400 py-2">No goals yet.</p>
          )}
          <ul className="space-y-2">
            {active.map((g) => (
              <li
                key={g.id}
                className="flex items-start gap-2 text-sm border border-zinc-100 rounded-lg px-3 py-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-900">{g.title}</p>
                  {g.metric && (
                    <p className="text-[11px] text-zinc-500 mt-0.5">{g.metric}</p>
                  )}
                </div>
                {canEdit && (
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(g.id, 'achieved')}
                      className="text-[10px] text-emerald-700 hover:underline"
                    >
                      Done
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(g.id)}
                      className="text-[10px] text-zinc-400 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </li>
            ))}
            {other.map((g) => (
              <li
                key={g.id}
                className="text-sm text-zinc-400 px-3 py-1.5 line-through decoration-zinc-300"
              >
                {g.title}
                <span className="ml-2 text-[10px] no-underline">{g.status}</span>
              </li>
            ))}
          </ul>
          {canEdit && (
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="Goal title"
                className="flex-1 text-sm border border-zinc-200 rounded-lg px-3 py-1.5 outline-none focus:border-zinc-400"
              />
              <input
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="Metric (optional)"
                className="sm:w-48 text-sm border border-zinc-200 rounded-lg px-3 py-1.5 outline-none focus:border-zinc-400"
              />
              <button
                type="button"
                onClick={submit}
                disabled={!draft.trim()}
                className="text-xs bg-zinc-900 text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 disabled:opacity-40"
              >
                Add goal
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
