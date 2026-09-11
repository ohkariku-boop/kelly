'use client'

import { useEffect, useState } from 'react'
import type { Item, ItemStatus, Feedback, Goal } from '@/types/database'
import { STATUS_LABELS, ITEM_STATUSES } from '@/types/database'
import { updateItem, fetchFeedback, addFeedback } from '@/lib/items'
import { DEMO_FEEDBACK } from '@/lib/demo-data'
import {
  localAddFeedback,
  localGetFeedback,
  localUpdateItem,
} from '@/lib/local-workspace'
import { initials } from '@/lib/format'

type Props = {
  item: Item
  workspaceId: string | null
  demoMode: boolean
  kellyPmMode?: boolean
  goals?: Goal[]
  onClose: () => void
  onUpdate: (item: Item) => void
  onMove: (id: string, status: ItemStatus) => void
}

export function ItemDetail({
  item,
  workspaceId,
  demoMode,
  kellyPmMode = false,
  goals = [],
  onClose,
  onUpdate,
  onMove,
}: Props) {
  const [title, setTitle] = useState(item.title)
  const [description, setDescription] = useState(item.description || '')
  const [ownerName, setOwnerName] = useState(item.owner_name || '')
  const [targetDate, setTargetDate] = useState(item.target_date || '')
  const [goalId, setGoalId] = useState(item.goal_id || '')
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [fbDraft, setFbDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [fbLoading, setFbLoading] = useState(false)

  useEffect(() => {
    setTitle(item.title)
    setDescription(item.description || '')
    setOwnerName(item.owner_name || '')
    setTargetDate(item.target_date || '')
    setGoalId(item.goal_id || '')
    if (kellyPmMode) {
      setFeedback(localGetFeedback(item.id))
    } else if (!demoMode && workspaceId) {
      fetchFeedback(item.id).then(setFeedback)
    } else {
      setFeedback(DEMO_FEEDBACK[item.id] || [])
    }
  }, [
    item.id,
    item.title,
    item.description,
    item.owner_name,
    item.target_date,
    item.goal_id,
    demoMode,
    workspaceId,
    kellyPmMode,
  ])

  async function saveMeta() {
    const next: Item = {
      ...item,
      title: title.trim() || item.title,
      description: description.trim() || null,
      owner_name: ownerName.trim() || null,
      target_date: targetDate.trim() || null,
      goal_id: goalId || null,
    }
    if (kellyPmMode) {
      localUpdateItem(item.id, {
        title: next.title,
        description: next.description,
        owner_name: next.owner_name,
        target_date: next.target_date,
        goal_id: next.goal_id,
      })
      onUpdate(next)
      return
    }
    if (demoMode) {
      onUpdate(next)
      return
    }
    setSaving(true)
    const ok = await updateItem(item.id, {
      title: next.title,
      description: next.description,
      owner_name: next.owner_name,
      target_date: next.target_date,
      goal_id: next.goal_id,
    })
    setSaving(false)
    if (ok) onUpdate(next)
  }

  async function submitFeedback() {
    const content = fbDraft.trim()
    if (!content) return

    if (kellyPmMode) {
      const created = localAddFeedback(item.id, content)
      setFeedback((prev) => [created, ...prev])
      setFbDraft('')
      return
    }

    if (demoMode) {
      const fake: Feedback = {
        id: crypto.randomUUID(),
        workspace_id: 'demo',
        item_id: item.id,
        content,
        source: 'demo',
        customer_name: null,
        created_by: null,
        created_at: new Date().toISOString(),
      }
      setFeedback((prev) => [fake, ...prev])
      setFbDraft('')
      return
    }

    if (!workspaceId) return
    setFbLoading(true)
    const created = await addFeedback(workspaceId, item.id, content)
    setFbLoading(false)
    if (created) {
      setFeedback((prev) => [created, ...prev])
      setFbDraft('')
    }
  }

  const showOwnerHint = item.status === 'now' && !ownerName.trim()

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/25" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl border-l border-zinc-200 flex flex-col h-full">
        <div className="h-12 flex items-center justify-between px-4 border-b border-zinc-200 shrink-0">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Item
          </span>
          <button
            onClick={onClose}
            className="text-sm text-zinc-500 hover:text-zinc-800"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveMeta}
            className="w-full text-lg font-semibold text-zinc-900 outline-none border-b border-transparent focus:border-zinc-200 pb-1"
            placeholder="Title"
          />

          {/* Owner + target */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Owner (DRI)
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${
                    ownerName.trim()
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-400'
                  }`}
                >
                  {initials(ownerName || null)}
                </span>
                <input
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  onBlur={saveMeta}
                  placeholder="Name"
                  className="flex-1 text-sm border border-zinc-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-zinc-400"
                />
              </div>
              {showOwnerHint && (
                <p className="text-[11px] text-amber-700 mt-1">
                  Now items work better with a clear owner.
                </p>
              )}
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Target date
              </p>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                onBlur={saveMeta}
                className="w-full text-sm border border-zinc-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-zinc-400 text-zinc-700"
              />
              <p className="text-[11px] text-zinc-400 mt-1">Optional - soft aim, not a deadline.</p>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-2">
              Status
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ITEM_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => onMove(item.id, s)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition ${
                    item.status === s
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-2">
              Goal
            </p>
            <select
              value={goalId}
              onChange={(e) => {
                setGoalId(e.target.value)
              }}
              onBlur={saveMeta}
              className="w-full text-sm border border-zinc-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-zinc-400 text-zinc-700 bg-white"
            >
              <option value="">None</option>
              {goals
                .filter((g) => g.status === 'active')
                .map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
            </select>
            <p className="text-[11px] text-zinc-400 mt-1">
              Optional. Link this bet to a product outcome.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-2">
              Description
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={saveMeta}
              rows={4}
              placeholder="Why this matters, scope, notes..."
              className="w-full text-sm text-zinc-700 border border-zinc-200 rounded-lg p-3 outline-none focus:border-zinc-400 resize-none placeholder:text-zinc-400"
            />
            {saving && (
              <p className="text-[11px] text-zinc-400 mt-1">Saving...</p>
            )}
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-2">
              Feedback
            </p>
            <div className="flex gap-2 mb-3">
              <input
                value={fbDraft}
                onChange={(e) => setFbDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitFeedback()
                }}
                placeholder="Customer quote or note..."
                className="flex-1 text-sm border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-zinc-400"
              />
              <button
                onClick={submitFeedback}
                disabled={fbLoading || !fbDraft.trim()}
                className="text-xs bg-zinc-900 text-white px-3 py-2 rounded-lg hover:bg-zinc-800 disabled:opacity-40"
              >
                Add
              </button>
            </div>

            {feedback.length === 0 ? (
              <p className="text-sm text-zinc-400 py-4 text-center border border-dashed border-zinc-200 rounded-lg">
                No feedback yet. Attach the “why” here.
              </p>
            ) : (
              <ul className="space-y-2">
                {feedback.map((f) => (
                  <li
                    key={f.id}
                    className="text-sm bg-amber-50/80 border border-amber-100 rounded-lg px-3 py-2.5 text-zinc-800"
                  >
                    <p className="leading-relaxed">{f.content}</p>
                    <p className="text-[11px] text-zinc-400 mt-1.5">
                      {f.source || 'note'} ·{' '}
                      {new Date(f.created_at).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
