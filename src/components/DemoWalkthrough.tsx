'use client'

import { useEffect, useState, useCallback } from 'react'

type Scene = {
  id: string
  label: string
  narrator: string
  users: { name: string; role: string; color: string; active?: boolean }[]
  board: {
    now: { title: string; owner: string }[]
    next: { title: string; owner: string }[]
    later: { title: string; owner: string }[]
  }
  chat?: { who: string; text: string }[]
  callout?: string
}

const SCENES: Scene[] = [
  {
    id: 'morning',
    label: '09:00 · Monday standup',
    narrator:
      'Maya opens Kelly. One board per product. Now / Next / Later — no sprint noise.',
    users: [
      { name: 'Maya', role: 'PM', color: '#6366f1', active: true },
      { name: 'Jordan', role: 'Eng', color: '#0ea5e9' },
      { name: 'Sam', role: 'Design', color: '#10b981' },
    ],
    board: {
      now: [
        { title: 'Reduce checkout drop-off', owner: 'Maya' },
        { title: 'Fix upgrade paywall copy', owner: 'Jordan' },
      ],
      next: [{ title: 'Apple Pay on web', owner: 'Maya' }],
      later: [{ title: 'Saved addresses', owner: 'Sam' }],
    },
    callout: 'Shared workspace — everyone sees the same priorities.',
  },
  {
    id: 'feedback',
    label: '09:12 · Feedback lands',
    narrator:
      'Maya attaches a customer quote to the Now item. The “why” lives on the card.',
    users: [
      { name: 'Maya', role: 'PM', color: '#6366f1', active: true },
      { name: 'Jordan', role: 'Eng', color: '#0ea5e9' },
      { name: 'Sam', role: 'Design', color: '#10b981' },
    ],
    board: {
      now: [
        { title: 'Reduce checkout drop-off', owner: 'Maya' },
        { title: 'Fix upgrade paywall copy', owner: 'Jordan' },
      ],
      next: [{ title: 'Apple Pay on web', owner: 'Maya' }],
      later: [{ title: 'Saved addresses', owner: 'Sam' }],
    },
    chat: [
      {
        who: 'Customer',
        text: '“I abandon on mobile every time the address form asks for apartment.”',
      },
    ],
    callout: 'Feedback is linked to the bet — not lost in Slack.',
  },
  {
    id: 'drag',
    label: '09:20 · Re-prioritize',
    narrator:
      'Jordan flags capacity. Maya drags Apple Pay from Next → Later. One motion, team aligned.',
    users: [
      { name: 'Maya', role: 'PM', color: '#6366f1', active: true },
      { name: 'Jordan', role: 'Eng', color: '#0ea5e9', active: true },
      { name: 'Sam', role: 'Design', color: '#10b981' },
    ],
    board: {
      now: [
        { title: 'Reduce checkout drop-off', owner: 'Maya' },
        { title: 'Fix upgrade paywall copy', owner: 'Jordan' },
      ],
      next: [],
      later: [
        { title: 'Apple Pay on web', owner: 'Maya' },
        { title: 'Saved addresses', owner: 'Sam' },
      ],
    },
    chat: [
      { who: 'Jordan', text: 'Checkout drop-off is the only Now we can finish this week.' },
      { who: 'Maya', text: 'Agreed — Apple Pay moves to Later.' },
    ],
    callout: 'Priority changes are visible to the whole workspace instantly.',
  },
  {
    id: 'owner',
    label: '11:40 · Clear ownership',
    narrator:
      'Sam takes Saved addresses as DRI. Target date is optional — a soft aim, not a deadline theater.',
    users: [
      { name: 'Maya', role: 'PM', color: '#6366f1' },
      { name: 'Jordan', role: 'Eng', color: '#0ea5e9' },
      { name: 'Sam', role: 'Design', color: '#10b981', active: true },
    ],
    board: {
      now: [
        { title: 'Reduce checkout drop-off', owner: 'Maya' },
        { title: 'Fix upgrade paywall copy', owner: 'Jordan' },
      ],
      next: [{ title: 'Onboarding empty states', owner: 'Sam' }],
      later: [
        { title: 'Apple Pay on web', owner: 'Maya' },
        { title: 'Saved addresses', owner: 'Sam' },
      ],
    },
    callout: 'Owner (DRI) on every active bet — stakeholders know who to ask.',
  },
  {
    id: 'update',
    label: 'Friday · Stakeholder update',
    narrator:
      'Maya writes a short Update from the board: progress, risks, asks. No status meeting required.',
    users: [
      { name: 'Maya', role: 'PM', color: '#6366f1', active: true },
      { name: 'Jordan', role: 'Eng', color: '#0ea5e9' },
      { name: 'Sam', role: 'Design', color: '#10b981' },
    ],
    board: {
      now: [{ title: 'Reduce checkout drop-off', owner: 'Maya' }],
      next: [{ title: 'Onboarding empty states', owner: 'Sam' }],
      later: [
        { title: 'Apple Pay on web', owner: 'Maya' },
        { title: 'Saved addresses', owner: 'Sam' },
      ],
    },
    chat: [
      {
        who: 'Update',
        text: 'On track: mobile form friction cut. Risk: analytics lag. Ask: design review Tue.',
      },
    ],
    callout: 'Same board → same story for leadership. Kelly keeps PMs aligned daily.',
  },
]

const SCENE_MS = 4200

export function DemoWalkthrough() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)

  const scene = SCENES[index]

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % SCENES.length)
  }, [])

  useEffect(() => {
    if (!playing) return
    const t = setInterval(next, SCENE_MS)
    return () => clearInterval(t)
  }, [playing, next])

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-zinc-950 text-zinc-100 shadow-2xl overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-zinc-800 bg-zinc-900/80">
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
        <span className="ml-2 text-[11px] text-zinc-500 truncate">
          Kelly · multi-user demo
        </span>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-zinc-500">
          {playing ? 'Playing' : 'Paused'}
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Scene label + users */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-medium text-indigo-300">{scene.label}</p>
          <div className="flex items-center gap-1.5">
            {scene.users.map((u) => (
              <span
                key={u.name}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] border transition ${
                  u.active
                    ? 'border-white/30 bg-white/10 text-white'
                    : 'border-zinc-700 text-zinc-500'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: u.color }}
                />
                {u.name}
                <span className="text-zinc-500">· {u.role}</span>
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed min-h-[2.5rem]">
          {scene.narrator}
        </p>

        {/* Mini board */}
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ['Now', scene.board.now],
              ['Next', scene.board.next],
              ['Later', scene.board.later],
            ] as const
          ).map(([col, cards]) => (
            <div key={col} className="rounded-lg bg-zinc-900/80 border border-zinc-800 p-2 min-h-[7.5rem]">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5">
                {col} · {cards.length}
              </p>
              <div className="space-y-1.5">
                {cards.length === 0 ? (
                  <p className="text-[10px] text-zinc-600 italic">Empty</p>
                ) : (
                  cards.map((c) => (
                    <div
                      key={c.title}
                      className="rounded-md bg-zinc-800/90 border border-zinc-700 px-2 py-1.5"
                    >
                      <p className="text-[11px] text-zinc-100 leading-snug line-clamp-2">
                        {c.title}
                      </p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">{c.owner}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chat / feedback */}
        {scene.chat && scene.chat.length > 0 && (
          <div className="space-y-1.5">
            {scene.chat.map((m, i) => (
              <div
                key={i}
                className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-[11px] text-amber-100/90"
              >
                <span className="font-medium text-amber-200">{m.who}: </span>
                {m.text}
              </div>
            ))}
          </div>
        )}

        {scene.callout && (
          <p className="text-[11px] text-emerald-400/90 border-l-2 border-emerald-500/50 pl-2.5">
            {scene.callout}
          </p>
        )}

        {/* Controls */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
          >
            {playing ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={next}
            className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
          >
            Next scene
          </button>
          <div className="flex gap-1 ml-auto">
            {SCENES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={s.label}
                onClick={() => {
                  setIndex(i)
                  setPlaying(false)
                }}
                className={`h-1.5 w-4 rounded-full transition ${
                  i === index ? 'bg-indigo-400' : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
