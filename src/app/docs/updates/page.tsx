import Link from 'next/link'
import { SiteFooter } from '@/components/SiteFooter'

export default function UpdatesDocs() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-zinc-200">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-3 text-sm">
          <Link href="/docs" className="text-zinc-500 hover:text-zinc-900">Docs</Link>
          <span className="text-zinc-300">/</span>
          <span className="font-medium">Updates</span>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">Stakeholder updates</h1>
        <p className="text-zinc-600 leading-relaxed mb-6">
          Linear supports structured project updates for organizational
          visibility. Kelly aims at the same job for product managers with a
          simpler template: progress, risks, next steps, and asks — plus a health
          signal (on track / at risk / off track).
        </p>
        <p className="text-zinc-600 text-sm leading-relaxed mb-6">
          The point is not another document system. It is to replace ad-hoc Slack
          essays and slide archaeology with a repeatable, scannable narrative tied
          to the same board leadership already trusts.
        </p>
        <h2 className="text-lg font-semibold mt-8 mb-3">Recommended cadence</h2>
        <ul className="text-zinc-600 text-sm space-y-2 mb-6">
          <li>Weekly for active products in fast-moving orgs</li>
          <li>Biweekly when the roadmap is stable</li>
          <li>Ad-hoc when health flips to at risk or off track</li>
        </ul>
        <p className="text-zinc-500 text-sm">
          UI for composing updates from the live board is on the product roadmap;
          the data model already supports stored updates.
        </p>
        <p className="mt-10 text-sm">
          <Link href="/docs" className="underline">← All docs</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
