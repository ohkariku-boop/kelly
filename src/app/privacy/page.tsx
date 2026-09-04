import Link from 'next/link'
import { SiteFooter } from '@/components/SiteFooter'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-zinc-200">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-3 text-sm">
          <Link href="/" className="font-semibold">Kelly</Link>
          <span className="text-zinc-300">/</span>
          <span>Privacy policy</span>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 text-sm text-zinc-600 space-y-4 leading-relaxed">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-6">Privacy policy</h1>
        <p>Last updated: September 4, 2026</p>
        <p>
          Kelly is a product management application. This policy describes how
          information is handled when you use the hosted service or self-managed
          deployments connected to your own infrastructure.
        </p>
        <h2 className="text-base font-semibold text-zinc-900 pt-4">Data we process</h2>
        <p>
          Account email (for authentication), workspace membership, and content
          you create: items, feedback notes, updates, and related metadata.
          Authentication may be provided by Supabase Auth or configured OAuth
          providers.
        </p>
        <h2 className="text-base font-semibold text-zinc-900 pt-4">How we use data</h2>
        <p>
          To operate the product, secure accounts, provide support, and improve
          reliability. We do not sell personal data. Demo mode on the marketing
          site stores data only in your browser session.
        </p>
        <h2 className="text-base font-semibold text-zinc-900 pt-4">Storage & retention</h2>
        <p>
          Hosted deployments store data in the configured database (typically
          Supabase/Postgres). You may request deletion of your account and
          associated workspace data by contacting the project maintainers. Self-hosted
          operators are responsible for their own retention policies.
        </p>
        <h2 className="text-base font-semibold text-zinc-900 pt-4">Contact</h2>
        <p>
          Questions about privacy: open an issue on the{' '}
          <a href="https://github.com/ohkariku-boop/kelly" className="underline" target="_blank" rel="noreferrer">
            GitHub repository
          </a>
          .
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
