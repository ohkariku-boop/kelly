import { NextResponse, type NextRequest } from 'next/server'

/**
 * If Supabase still redirects to Site URL with ?code= on `/`,
 * forward to our auth callback so the session can be exchanged.
 */
export function middleware(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const path = request.nextUrl.pathname

  if (code && path !== '/auth/callback') {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/callback'
    // keep code + any other params; default next
    if (!url.searchParams.get('next')) {
      url.searchParams.set('next', '/dashboard')
    }
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
