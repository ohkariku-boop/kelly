import Link from 'next/link'
import { SiteFooter } from '@/components/SiteFooter'

const SECTIONS = [
  {
    title: 'Getting started',
    href: '/docs/getting-started',
    body: 'Sign in, set up the database, and put your first items on Now / Next / Later.',
  },
  {
    title: 'Roadmap',
    href: '/docs/roadmap',
    body: 'Items, locked statuses, and Ideas. Why statuses are fixed.',
  },
  {
    title: 'Feedback',
    href: '/docs/feedback',
    body: 'Attach customer evidence to items so priorities stay grounded.',
  },
  {
    title: 'Updates',
    href: '/docs/updates',
    body: 'Short stakeholder status: progress, risks, next steps, asks.',
  },
  {
    title: 'Team & multi-user',
    href: '/docs/team',
    body: 'Workspace members, roles, invite links, and shared roadmaps.',
  },
]

export default function DocsIndex() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-zinc-200">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">K</span>
            </div>
            <span className="font-semibold text-sm">Kelly Docs</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-zinc-600 hover:text-zinc-900">
            Open app
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">Documentation</h1>
        <p className="text-zinc-600 leading-relaxed mb-4">
          Kelly is a product priority tool: fixed Now / Next / Later roadmap,
          feedback on the work, and short status updates. These guides explain the model.
        </p>
        <p className="text-sm text-zinc-500 mb-10 leading-relaxed">
          For execution trackers, see{' '}
          <a href="https://linear.app/docs" className="underline" target="_blank" rel="noreferrer">
            Linear docs
          </a>{' '}
          and{' '}
          <a href="https://www.atlassian.com/software/jira/guides" className="underline" target="_blank" rel="noreferrer">
            Jira guides
          </a>
          . Kelly intentionally leaves most of that surface area out.
        </p>
        <div className="space-y-4">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="block border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 transition"
            >
              <h2 className="font-medium text-zinc-900">{s.title}</h2>
              <p className="text-sm text-zinc-600 mt-1">{s.body}</p>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
