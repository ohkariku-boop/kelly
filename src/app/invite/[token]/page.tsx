'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  acceptInvitation,
  getInvitationByToken,
  ensureProfile,
} from '@/lib/workspace'

export default function AcceptInvitePage() {
  const params = useParams()
  const router = useRouter()
  const token = String(params.token || '')

  const [status, setStatus] = useState<'loading' | 'need-auth' | 'ready' | 'done' | 'error'>(
    'loading'
  )
  const [message, setMessage] = useState<string | null>(null)
  const [workspaceName, setWorkspaceName] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!token) {
        setStatus('error')
        setMessage('Invalid invite link')
        return
      }
      const inv = await getInvitationByToken(token)
      if (cancelled) return
      if (!inv || inv.status !== 'pending') {
        setStatus('error')
        setMessage('This invitation is invalid, expired, or already used.')
        return
      }
      setWorkspaceName(inv.workspace_name || 'a workspace')
      setInviteEmail(inv.email)

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setStatus('need-auth')
        return
      }
      setStatus('ready')
    }
    load()
    return () => {
      cancelled = true
    }
  }, [token])

  async function handleAccept() {
    setMessage(null)
    await ensureProfile()
    const { workspaceId, error } = await acceptInvitation(token)
    if (error || !workspaceId) {
      setStatus('error')
      setMessage(error || 'Could not accept invitation')
      return
    }
    setStatus('done')
    setTimeout(() => router.push('/dashboard'), 1200)
  }

  async function handleMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('email') || '')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/invite/${token}`,
      },
    })
    if (error) setMessage(error.message)
    else setMessage('Check your email for the magic link, then return here to join.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-50">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">K</span>
          </div>
          <span className="font-semibold">Kelly</span>
        </Link>

        <h1 className="text-xl font-semibold mb-2">Join workspace</h1>

        {status === 'loading' && (
          <p className="text-sm text-zinc-500">Checking invitation…</p>
        )}

        {status === 'error' && (
          <p className="text-sm text-red-700">{message}</p>
        )}

        {status === 'need-auth' && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-600 leading-relaxed">
              You&apos;ve been invited to{' '}
              <strong>{workspaceName}</strong>
              {inviteEmail ? (
                <>
                  {' '}
                  as <strong>{inviteEmail}</strong>
                </>
              ) : null}
              . Sign in with that email to continue.
            </p>
            <form onSubmit={handleMagicLink} className="space-y-2">
              <input
                name="email"
                type="email"
                required
                defaultValue={inviteEmail || ''}
                placeholder="you@company.com"
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-zinc-400"
              />
              <button
                type="submit"
                className="w-full bg-zinc-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-zinc-800"
              >
                Email me a magic link
              </button>
            </form>
            {message && (
              <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                {message}
              </p>
            )}
          </div>
        )}

        {status === 'ready' && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-600 leading-relaxed">
              Join <strong>{workspaceName}</strong> and share products, roadmaps, and
              feedback with the team.
            </p>
            <button
              type="button"
              onClick={handleAccept}
              className="w-full bg-zinc-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-zinc-800"
            >
              Accept invitation
            </button>
            {message && <p className="text-sm text-red-600">{message}</p>}
          </div>
        )}

        {status === 'done' && (
          <p className="text-sm text-emerald-700">
            You&apos;re in. Redirecting to the roadmap…
          </p>
        )}
      </div>
    </div>
  )
}
