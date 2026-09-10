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
          Kelly&apos;s roadmap is for prioritization, not task tracking. Linear models
          issues, projects, cycles, and initiatives. Jira models epics, stories, and
          workflows. Kelly uses <strong>Items</strong> and five fixed statuses.
        </p>

        <h2 className="text-lg font-semibold mt-10 mb-3">Statuses (fixed)</h2>
        <ul className="text-zinc-600 space-y-2 text-sm leading-relaxed mb-6">
          <li><strong>Idea</strong>: captured, not ranked. Safe place for requests.</li>
          <li><strong>Now</strong>: actively being designed or built.</li>
          <li><strong>Next</strong>: next up when capacity opens.</li>
          <li><strong>Later</strong>: deferred on purpose, not a junk drawer.</li>
          <li><strong>Done</strong>: shipped or closed.</li>
        </ul>
        <p className="text-zinc-600 text-sm leading-relaxed mb-6">
          There is no workflow settings screen. That is intentional. Custom columns
          help delivery teams; they hurt shared language for product priorities.
        </p>

        <h2 className="text-lg font-semibold mt-10 mb-3">What makes a good Item</h2>
        <p className="text-zinc-600 text-sm leading-relaxed mb-4">
          Prefer outcome language over feature lists. &quot;Reduce mobile checkout
          drop-off&quot; beats &quot;New checkout UI&quot;. Put success criteria in the
          description. Attach feedback so the bet stays defensible.
        </p>

        <h2 className="text-lg font-semibold mt-10 mb-3">Optional goals</h2>
        <p className="text-zinc-600 text-sm leading-relaxed mb-6">
          Goals are light outcome framing. They are not required hierarchy. Use them
          when a metric helps stakeholders; skip them when they add noise.
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
