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
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">Getting started</h1>
        <p className="text-zinc-600 leading-relaxed mb-6">
          You should be useful in a few minutes. There are no workflows, issue types,
          or sprint schemes to configure.
        </p>

        <h2 className="text-lg font-semibold mt-10 mb-3">1. Explore the demo</h2>
        <p className="text-zinc-600 leading-relaxed mb-4">
          Open the homepage roadmap or{' '}
          <Link href="/dashboard" className="underline">/dashboard</Link>.
          Click items to read outcomes and feedback. Move cards between Now, Next,
          and Later. That is the prioritization model.
        </p>

        <h2 className="text-lg font-semibold mt-10 mb-3">2. Prepare Supabase</h2>
        <ol className="list-decimal list-inside text-zinc-600 space-y-2 mb-4">
          <li>Create a Supabase project.</li>
          <li>
            Run <code className="text-xs bg-zinc-100 px-1 rounded">supabase/ALL.sql</code> in the SQL Editor.
          </li>
          <li>Enable Email auth under Authentication → Providers.</li>
          <li>
            Add your site URL and <code className="text-xs bg-zinc-100 px-1 rounded">/auth/callback</code> to the redirect allow-list.
          </li>
          <li>
            Set <code className="text-xs bg-zinc-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and the publishable key in Vercel (or{' '}
            <code className="text-xs bg-zinc-100 px-1 rounded">.env.local</code>).
          </li>
        </ol>

        <h2 className="text-lg font-semibold mt-10 mb-3">3. Sign in</h2>
        <p className="text-zinc-600 leading-relaxed mb-4">
          Use a magic link from <Link href="/login" className="underline">/login</Link>.
          On first login Kelly creates a workspace and makes you owner.
        </p>

        <h2 className="text-lg font-semibold mt-10 mb-3">4. Place real work</h2>
        <p className="text-zinc-600 leading-relaxed mb-4">
          Add items with short, outcome-oriented titles. Put active bets in Now,
          near-term work in Next, and intentional deferrals in Later. Park raw
          requests in Ideas until you are ready to rank them.
        </p>

        <h2 className="text-lg font-semibold mt-10 mb-3">What you can ignore</h2>
        <p className="text-zinc-600 leading-relaxed">
          Custom columns, story points, cycle configuration, and multi-level
          initiative trees. Those belong in execution tools. Kelly is for
          prioritization and a clear product narrative.
        </p>

        <p className="mt-10 text-sm">
          <Link href="/docs/roadmap" className="underline">Next: Roadmap model →</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
