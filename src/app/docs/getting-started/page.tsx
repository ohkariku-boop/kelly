import Link from 'next/link'
import { SiteFooter } from '@/components/SiteFooter'

export default function GettingStarted() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-zinc-200">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-3 text-sm">
          <Link href="/docs" className="text-zinc-500 hover:text-zinc-900">Docs</Link>
          <span className="text-zinc-300">/</span>
          <span className="font-medium">Getting started</span>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 prose prose-zinc prose-sm max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">Getting started</h1>
        <p className="text-zinc-600 leading-relaxed mb-6">
          Kelly should feel usable in under five minutes. You do not configure
          workflows, issue types, or sprint schemes — unlike typical setup in{' '}
          <a href="https://linear.app/docs" className="underline" target="_blank" rel="noreferrer">Linear</a> or
          project column design in{' '}
          <a href="https://kaneo.app/docs/core/functional/configure-workflows" className="underline" target="_blank" rel="noreferrer">Kaneo</a>.
        </p>

        <h2 className="text-lg font-semibold mt-10 mb-3">1. Explore the demo</h2>
        <p className="text-zinc-600 leading-relaxed mb-4">
          Open the homepage roadmap or <Link href="/dashboard" className="underline">/dashboard</Link>.
          Click items to read outcomes and attached feedback. Move cards between
          Now, Next, and Later. This is the entire prioritization model.
        </p>

        <h2 className="text-lg font-semibold mt-10 mb-3">2. Prepare Supabase</h2>
        <ol className="list-decimal list-inside text-zinc-600 space-y-2 mb-4">
          <li>Create a Supabase project.</li>
          <li>Run <code className="text-xs bg-zinc-100 px-1 rounded">supabase/schema.sql</code> in the SQL Editor.</li>
          <li>Enable Email auth under Authentication → Providers.</li>
          <li>Add your site URL and <code className="text-xs bg-zinc-100 px-1 rounded">/auth/callback</code> to redirect allow-list.</li>
          <li>Set <code className="text-xs bg-zinc-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and publishable key in Vercel (or <code className="text-xs bg-zinc-100 px-1 rounded">.env.local</code>).</li>
        </ol>

        <h2 className="text-lg font-semibold mt-10 mb-3">3. Sign in</h2>
        <p className="text-zinc-600 leading-relaxed mb-4">
          Use magic link from <Link href="/login" className="underline">/login</Link>.
          On first login Kelly creates a workspace and makes you owner. No invite
          matrix or organization schemes required to begin.
        </p>

        <h2 className="text-lg font-semibold mt-10 mb-3">4. Place real work</h2>
        <p className="text-zinc-600 leading-relaxed mb-4">
          Add Items with short, outcome-oriented titles. Put active bets in Now,
          committed near-term work in Next, and intentional deferrals in Later.
          Park raw requests in Ideas until you are ready to rank them.
        </p>

        <h2 className="text-lg font-semibold mt-10 mb-3">What you can ignore</h2>
        <p className="text-zinc-600 leading-relaxed">
          Custom columns, story points schemes, cycle configuration, and
          multi-level initiative trees. Those belong in execution tools. Kelly’s
          job is prioritization and narrative clarity for product managers.
        </p>

        <p className="mt-10 text-sm">
          <Link href="/docs/roadmap" className="underline">Next: Roadmap model →</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
