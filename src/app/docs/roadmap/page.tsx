import Link from 'next/link'
import { SiteFooter } from '@/components/SiteFooter'

export default function RoadmapDocs() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-zinc-200">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-3 text-sm">
          <Link href="/docs" className="text-zinc-500 hover:text-zinc-900">Docs</Link>
          <span className="text-zinc-300">/</span>
          <span className="font-medium">Roadmap</span>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">Roadmap</h1>
        <p className="text-zinc-600 leading-relaxed mb-6">
          Kelly’s roadmap is a prioritization surface, not a project tracker.
          Kaneo documents Board, List, and Backlog views over tasks inside a
          project (
          <a href="https://kaneo.app/docs/core/functional/plan-and-execute-tasks" className="underline" target="_blank" rel="noreferrer">
            plan and execute tasks
          </a>
          ). Linear models Issues, Projects, Cycles, and Initiatives (
          <a href="https://linear.app/docs/conceptual-model" className="underline" target="_blank" rel="noreferrer">
            conceptual model
          </a>
          ). Kelly collapses that into <strong>Items</strong> and five locked statuses.
        </p>

        <h2 className="text-lg font-semibold mt-10 mb-3">Statuses (locked)</h2>
        <ul className="text-zinc-600 space-y-2 text-sm leading-relaxed mb-6">
          <li><strong>Idea</strong> — captured, not ranked. Safe place for noise.</li>
          <li><strong>Now</strong> — actively being designed or built this period.</li>
          <li><strong>Next</strong> — committed soon; capacity is roughly spoken for.</li>
          <li><strong>Later</strong> — intentional deferral, not a junk drawer.</li>
          <li><strong>Done</strong> — shipped or closed; restorable if needed.</li>
        </ul>
        <p className="text-zinc-600 text-sm leading-relaxed mb-6">
          There is no workflow settings screen. That is intentional. Kaneo allows
          per-project columns and automation rules; useful for delivery, costly for
          PM clarity. Kelly optimizes for shared language across the company.
        </p>

        <h2 className="text-lg font-semibold mt-10 mb-3">What makes a good Item</h2>
        <p className="text-zinc-600 text-sm leading-relaxed mb-4">
          Prefer outcome language over feature laundry lists. “Reduce mobile
          checkout drop-off” beats “New checkout UI”. Put success criteria in the
          description. Attach feedback so the bet stays defensible.
        </p>

        <h2 className="text-lg font-semibold mt-10 mb-3">Optional goals</h2>
        <p className="text-zinc-600 text-sm leading-relaxed mb-6">
          Goals exist in the data model as lightweight framing. They are not a
          required hierarchy like Linear Initiatives. Use them when a metric or
          theme helps stakeholders; ignore them when they add ceremony.
        </p>

        <p className="mt-10 text-sm flex gap-4">
          <Link href="/docs/feedback" className="underline">Feedback →</Link>
          <Link href="/docs" className="text-zinc-500 underline">All docs</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
