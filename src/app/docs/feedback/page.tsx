import Link from 'next/link'
import { SiteFooter } from '@/components/SiteFooter'

export default function FeedbackDocs() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-zinc-200">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-3 text-sm">
          <Link href="/docs" className="text-zinc-500 hover:text-zinc-900">Docs</Link>
          <span className="text-zinc-300">/</span>
          <span className="font-medium">Feedback</span>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">Feedback</h1>
        <p className="text-zinc-600 leading-relaxed mb-6">
          Product decisions weaken when the evidence lives somewhere else. Kelly
          attaches feedback notes directly to items: interview quotes, support
          themes, sales call notes, analytics observations.
        </p>
        <h2 className="text-lg font-semibold mt-8 mb-3">How to use it</h2>
        <ol className="list-decimal list-inside text-zinc-600 text-sm space-y-2 mb-6">
          <li>Open an item from the roadmap.</li>
          <li>Add a short note in Feedback. Prefer the customer&apos;s words.</li>
          <li>Optionally tag a source (interview, support, sales, research).</li>
          <li>When priorities are challenged, open the item and show the trail.</li>
        </ol>
        <p className="text-zinc-600 text-sm leading-relaxed mb-6">
          This is narrower than a full research platform and more structured than a
          free-text description field. Delivery tools track ownership and labels;
          they rarely keep continuous discovery evidence on the priority object itself.
        </p>
        <p className="mt-10 text-sm">
          <Link href="/docs/updates" className="underline">Next: Updates →</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
