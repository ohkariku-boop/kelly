import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center">
                <span className="text-white text-xs font-bold">K</span>
              </div>
              <span className="font-semibold">Kelly</span>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed">
              The only command center for product managers. Decide what matters.
              Communicate clearly. Ship with intent.
            </p>
          </div>
          <div>
            <p className="font-medium text-zinc-900 mb-3">Product</p>
            <ul className="space-y-2 text-zinc-500">
              <li>
                <Link href="/#roadmap" className="hover:text-zinc-900">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link href="/#why" className="hover:text-zinc-900">
                  Why Kelly
                </Link>
              </li>
              <li>
                <Link href="/#compare" className="hover:text-zinc-900">
                  vs Linear & Jira
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-zinc-900">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-zinc-900 mb-3">Company</p>
            <ul className="space-y-2 text-zinc-500">
              <li>
                <Link href="/docs/getting-started" className="hover:text-zinc-900">
                  Getting started
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ohkariku-boop/kelly"
                  className="hover:text-zinc-900"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-zinc-900">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-zinc-900 mb-3">Legal</p>
            <ul className="space-y-2 text-zinc-500">
              <li>
                <Link href="/privacy" className="hover:text-zinc-900">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-zinc-900">
                  Terms of use
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row justify-between gap-2 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} Kelly. Built for product managers.</p>
          <p>
            Built for prioritization and communication — not for replacing{' '}
            <a href="https://linear.app" className="underline hover:text-zinc-600" target="_blank" rel="noreferrer">
              Linear
            </a>{' '}
            or{' '}
            <a href="https://www.atlassian.com/software/jira" className="underline hover:text-zinc-600" target="_blank" rel="noreferrer">
              Jira
            </a>{' '}
            on delivery.
          </p>
        </div>
      </div>
    </footer>
  )
}
