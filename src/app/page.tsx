import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-sm font-bold">K</span>
            </div>
            <span className="font-semibold tracking-tight">Kelly</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/login" className="text-zinc-600 hover:text-zinc-900">
              Sign in
            </Link>
            <Link
              href="/login"
              className="bg-zinc-900 text-white px-3.5 py-1.5 rounded-md hover:bg-zinc-800 transition"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          <p className="text-sm font-medium text-zinc-500 mb-4 tracking-wide uppercase">
            Product management, simplified
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900 max-w-2xl mx-auto leading-tight">
            Everything a PM needs.
            <br />
            <span className="text-zinc-400">Nothing else.</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-600 max-w-xl mx-auto leading-relaxed">
            Kelly is the calm command center for product managers.
            Goals, initiatives, roadmap, feedback, and stakeholder updates —
            in one minimalist surface.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <Link
              href="/login"
              className="bg-zinc-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
            >
              Start building with Kelly
            </Link>
            <a
              href="https://github.com/ohkariku-boop/kelly"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-zinc-300 text-zinc-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-50 transition"
            >
              View on GitHub
            </a>
          </div>
        </section>

        {/* Principles */}
        <section className="max-w-5xl mx-auto px-6 py-16 border-t border-zinc-200">
          <h2 className="text-xl font-semibold text-center mb-10">Built on three principles</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <div className="text-2xl mb-3">◇</div>
              <h3 className="font-medium mb-2">Minimal surface</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                No sprints forced on you. No 40 custom fields. Just the hierarchy
                PMs actually think in: Goals → Initiatives → Items.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <div className="text-2xl mb-3">◎</div>
              <h3 className="font-medium mb-2">Connected by default</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Feedback attaches to items. Items roll up to initiatives.
                Updates are one click from current state. Context never lives in five tools.
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <div className="text-2xl mb-3">○</div>
              <h3 className="font-medium mb-2">Calm by design</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Generous whitespace. Clear typography. Keyboard friendly.
                The tool disappears so you can focus on the product.
              </p>
            </div>
          </div>
        </section>

        {/* Setup note */}
        <section className="max-w-3xl mx-auto px-6 py-16 border-t border-zinc-200">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-sm text-amber-900">
            <p className="font-medium mb-2">Setup required</p>
            <ol className="list-decimal list-inside space-y-1 text-amber-800">
              <li>Create a Supabase project and run <code className="bg-amber-100 px-1 rounded">supabase/schema.sql</code></li>
              <li>Copy <code className="bg-amber-100 px-1 rounded">.env.local.example</code> → <code className="bg-amber-100 px-1 rounded">.env.local</code> and fill your URL + publishable key</li>
              <li>Run <code className="bg-amber-100 px-1 rounded">npm install && npm run dev</code></li>
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500">
        Kelly — open source, minimalist product management
      </footer>
    </div>
  )
}
