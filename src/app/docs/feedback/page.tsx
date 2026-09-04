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
          Product decisions rot when the evidence lives somewhere else. Kelly
          attaches feedback notes directly to Items: interview quotes, support
          themes, sales call takeaways, analytics observations.
        </p>
        <h2 className="text-lg font-semibold mt-8 mb-3">How to use it</h2>
        <ol className="list-decimal list-inside text-zinc-600 text-sm space-y-2 mb-6">
          <li>Open an Item from the roadmap.</li>
          <li>Add a short note in Feedback — prefer the customer’s words.</li>
          <li>Optionally tag a source (interview, support, sales, research).</li>
          <li>When priorities are challenged, open the Item and show the trail.</li>
        </ol>
        <p className="text-zinc-600 text-sm leading-relaxed mb-6">
          This is narrower than a full voice-of-customer platform, and wider than
          a free-text description field. Execution tools such as Kaneo focus on
          task ownership and labels; they do not center continuous discovery
          evidence on the prioritization object itself.
        </p>
        <p className="mt-10 text-sm">
          <Link href="/docs/updates" className="underline">Next: Updates →</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
