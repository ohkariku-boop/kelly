'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  listMembers,
  listInvitations,
  createInvitation,
  revokeInvitation,
  removeMember,
  updateMemberRole,
  ensureProfile,
  getMyRole,
  type MemberRow,
  type InvitationRow,
  type MemberRole,
} from '@/lib/workspace'
import { ensureWorkspace } from '@/lib/items'

export default function MembersSettingsPage() {
  const router = useRouter()
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [myRole, setMyRole] = useState<MemberRole | null>(null)
  const [members, setMembers] = useState<MemberRow[]>([])
  const [invites, setInvites] = useState<InvitationRow[]>([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<MemberRole>('member')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastLink, setLastLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const refresh = useCallback(async (wsId: string) => {
    const [m, inv, r] = await Promise.all([
      listMembers(wsId),
      listInvitations(wsId),
      getMyRole(wsId),
    ])
    setMembers(m)
    setInvites(inv)
    setMyRole(r)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function init() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/login')
        return
      }
      await ensureProfile()
      const wsId = await ensureWorkspace()
      if (!wsId || cancelled) {
        setLoading(false)
        setError('No workspace found. Sign in with Supabase and run the schema.')
        return
      }
      setWorkspaceId(wsId)
      await refresh(wsId)
      if (!cancelled) setLoading(false)
    }
    init()
    return () => {
      cancelled = true
    }
  }, [router, refresh])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!workspaceId || !email.trim()) return
    setError(null)
    setLastLink(null)
    const { invitation, error: err } = await createInvitation(
      workspaceId,
      email.trim(),
      role
    )
    if (err || !invitation) {
      setError(err || 'Could not create invitation')
      return
    }
    const link = `${window.location.origin}/invite/${invitation.token}`
    setLastLink(link)
    setEmail('')
    await refresh(workspaceId)
  }

  async function copyLink(link: string) {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const canManage = myRole === 'owner' || myRole === 'member'

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="h-12 border-b border-zinc-200 bg-white flex items-center justify-between px-4">
        <div className="flex items-center gap-3 text-sm">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">K</span>
            </div>
            <span className="font-semibold">Kelly</span>
          </Link>
          <span className="text-zinc-300">/</span>
          <span className="text-zinc-600">Team</span>
        </div>
        <Link href="/dashboard" className="text-xs text-zinc-500 hover:text-zinc-800">
          ← Roadmap
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">Team</h1>
        <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
          Invite people to this workspace. Everyone shares the same products and
          roadmaps. Owners manage members; members can invite; viewers are read-only
          in future permission checks.
        </p>

        {loading ? (
          <p className="text-sm text-zinc-400">Loading…</p>
        ) : (
          <>
            {error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                {error}
              </p>
            )}

            {canManage && (
              <form
                onSubmit={handleInvite}
                className="bg-white border border-zinc-200 rounded-xl p-4 mb-8 space-y-3"
              >
                <p className="text-sm font-medium text-zinc-900">Invite by email</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="flex-1 text-sm border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-zinc-400"
                  />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as MemberRole)}
                    className="text-sm border border-zinc-200 rounded-lg px-3 py-2"
                  >
                    <option value="member">Member</option>
                    <option value="viewer">Viewer</option>
                    <option value="owner">Owner</option>
                  </select>
                  <button
                    type="submit"
                    className="text-sm bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-800"
                  >
                    Create invite
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Creates a link you can share. They sign in with that email and join
                  the workspace.
                </p>
                {lastLink && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-sm">
                    <p className="text-emerald-800 font-medium mb-1">Invite link</p>
                    <code className="text-xs break-all text-emerald-900">{lastLink}</code>
                    <button
                      type="button"
                      onClick={() => copyLink(lastLink)}
                      className="block mt-2 text-xs text-emerald-700 underline"
                    >
                      {copied ? 'Copied' : 'Copy link'}
                    </button>
                  </div>
                )}
              </form>
            )}

            <section className="mb-10">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                Members · {members.length}
              </h2>
              <ul className="bg-white border border-zinc-200 rounded-xl divide-y divide-zinc-100">
                {members.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">
                        {m.full_name || m.email || m.user_id.slice(0, 8)}
                      </p>
                      {m.email && (
                        <p className="text-xs text-zinc-400 truncate">{m.email}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {myRole === 'owner' && m.role !== 'owner' ? (
                        <select
                          value={m.role}
                          onChange={async (e) => {
                            await updateMemberRole(m.id, e.target.value as MemberRole)
                            if (workspaceId) await refresh(workspaceId)
                          }}
                          className="text-xs border border-zinc-200 rounded px-1.5 py-1"
                        >
                          <option value="member">Member</option>
                          <option value="viewer">Viewer</option>
                          <option value="owner">Owner</option>
                        </select>
                      ) : (
                        <span className="text-xs text-zinc-500 capitalize">{m.role}</span>
                      )}
                      {myRole === 'owner' && m.role !== 'owner' && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (!confirm('Remove this member?')) return
                            await removeMember(m.id)
                            if (workspaceId) await refresh(workspaceId)
                          }}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </li>
                ))}
                {members.length === 0 && (
                  <li className="px-4 py-6 text-sm text-zinc-400 text-center">
                    No members yet
                  </li>
                )}
              </ul>
            </section>

            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                Pending invites · {invites.length}
              </h2>
              <ul className="bg-white border border-zinc-200 rounded-xl divide-y divide-zinc-100">
                {invites.map((inv) => {
                  const link =
                    typeof window !== 'undefined'
                      ? `${window.location.origin}/invite/${inv.token}`
                      : `/invite/${inv.token}`
                  return (
                    <li
                      key={inv.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm text-zinc-900">{inv.email}</p>
                        <p className="text-xs text-zinc-400 capitalize">
                          {inv.role} · expires{' '}
                          {new Date(inv.expires_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => copyLink(link)}
                          className="text-xs text-zinc-600 hover:text-zinc-900"
                        >
                          Copy link
                        </button>
                        {canManage && (
                          <button
                            type="button"
                            onClick={async () => {
                              await revokeInvitation(inv.id)
                              if (workspaceId) await refresh(workspaceId)
                            }}
                            className="text-xs text-red-600"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </li>
                  )
                })}
                {invites.length === 0 && (
                  <li className="px-4 py-6 text-sm text-zinc-400 text-center">
                    No pending invites
                  </li>
                )}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
