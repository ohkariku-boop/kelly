'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { startKellyPmSession } from '@/lib/local-workspace'
import { authCallbackUrl } from '@/lib/site'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function continueAsKellyPm() {
    startKellyPmSession()
    router.push('/dashboard')
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: authCallbackUrl('/dashboard'),
      },
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for the magic link.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-sm font-bold">K</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">Kelly</span>
          </Link>
          <h1 className="text-xl font-semibold text-zinc-900">Sign in</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Use full roadmap features, or continue as Kelly PM.
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
          {/* Primary: Kelly PM full-feature local mode */}
          <button
            type="button"
            onClick={continueAsKellyPm}
            className="w-full bg-zinc-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-zinc-800 transition"
          >
            Continue as Kelly PM
          </button>
          <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
            Full board, drag-and-drop, detail & feedback — saved in this browser.
            No email required.
          </p>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100" />
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="bg-white px-2 text-zinc-400">or magic link</span>
            </div>
          </div>

          <form onSubmit={handleMagicLink} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-zinc-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full border border-zinc-200 text-zinc-700 text-sm font-medium py-2.5 rounded-lg hover:bg-zinc-50 disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Email me a link'}
            </button>
          </form>

          {message && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              {message}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <p className="text-center text-xs text-zinc-400 mt-6">
          <Link href="/" className="hover:text-zinc-600">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
