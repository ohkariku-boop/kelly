import Link from 'next/link'
import { SiteFooter } from '@/components/SiteFooter'

export default function TeamDocs() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-zinc-200">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-3 text-sm">
          <Link href="/docs" className="text-zinc-500 hover:text-zinc-900">
            Docs
          </Link>
          <span className="text-zinc-300">/</span>
          <span className="font-medium">Team & multi-user</span>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 text-sm text-zinc-600 space-y-4 leading-relaxed">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-6">
          Team & multi-user
        </h1>
        <p>
          Kelly workspaces can be shared. Products, items, and feedback belong to
          the workspace; every member sees the same roadmaps.
        </p>
        <h2 className="text-lg font-semibold text-zinc-900 pt-4">Roles</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Owner</strong> — full control, including removing members and
            changing roles
          </li>
          <li>
            <strong>Member</strong> — create invites, edit roadmaps and feedback
          </li>
          <li>
            <strong>Viewer</strong> — intended for read-only access (enforced as
            you tighten RLS)
          </li>
        </ul>
        <h2 className="text-lg font-semibold text-zinc-900 pt-4">Setup</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Run <code className="text-xs bg-zinc-100 px-1 rounded">supabase/schema.sql</code> then{' '}
            <code className="text-xs bg-zinc-100 px-1 rounded">supabase/multi-user.sql</code> in the
            Supabase SQL editor.
          </li>
          <li>Enable Email auth and add redirect URLs for <code className="text-xs bg-zinc-100 px-1 rounded">/auth/callback</code> and{' '}
            <code className="text-xs bg-zinc-100 px-1 rounded">/invite/*</code>.</li>
          <li>Sign in with magic link (not Kelly PM local mode).</li>
          <li>
            Open <Link href="/settings/members" className="underline">Team settings</Link>, invite by
            email, share the invite link.
          </li>
          <li>Invitee signs in with the invited email and accepts.</li>
        </ol>
        <h2 className="text-lg font-semibold text-zinc-900 pt-4">vs Kaneo</h2>
        <p>
          Kaneo is built as a multi-user execution tracker with invites, roles, and
          shared boards from day one. Kelly starts as a PM command center and adds
          the same class of workspace membership so a small product group can share
          prioritization — without becoming a full delivery tool.
        </p>
        <p className="pt-6">
          <Link href="/docs" className="underline">
            ← All docs
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
