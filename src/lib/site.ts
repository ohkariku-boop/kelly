/** Canonical public site URL for auth redirects */
export function getSiteUrl() {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin
    // Never send auth redirects to localhost when a public site is configured
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return (
        process.env.NEXT_PUBLIC_SITE_URL ||
        'https://kellypm.vercel.app'
      ).replace(/\/$/, '')
    }
    return origin
  }
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://kellypm.vercel.app'
  ).replace(/\/$/, '')
}

export function authCallbackUrl(next = '/dashboard') {
  const base = getSiteUrl()
  return `${base}/auth/callback?next=${encodeURIComponent(next)}`
}
