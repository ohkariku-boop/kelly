import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-zinc-200 bg-white flex flex-col">
        <div className="h-14 flex items-center px-4 border-b border-zinc-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">K</span>
            </div>
            <span className="font-semibold text-sm">Kelly</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 text-sm">
          <a className="flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-100 text-zinc-900 font-medium">
            Roadmap
          </a>
          <a className="flex items-center gap-2 px-3 py-2 rounded-md text-zinc-600 hover:bg-zinc-50">
            Goals
          </a>
          <a className="flex items-center gap-2 px-3 py-2 rounded-md text-zinc-600 hover:bg-zinc-50">
            Initiatives
          </a>
          <a className="flex items-center gap-2 px-3 py-2 rounded-md text-zinc-600 hover:bg-zinc-50">
            Feedback
          </a>
          <a className="flex items-center gap-2 px-3 py-2 rounded-md text-zinc-600 hover:bg-zinc-50">
            Updates
          </a>
        </nav>
        <div className="p-3 border-t border-zinc-200 text-xs text-zinc-500">
          MVP scaffold
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="h-14 border-b border-zinc-200 bg-white flex items-center justify-between px-6">
          <h1 className="font-semibold">Roadmap</h1>
          <button className="bg-zinc-900 text-white text-sm px-3 py-1.5 rounded-md hover:bg-zinc-800">
            + New item
          </button>
        </header>

        <div className="p-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center">
            <p className="text-zinc-500 mb-2">Your roadmap is empty</p>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              After connecting Supabase and running the schema, items will appear here.
              Use Now / Next / Later columns or a simple list to prioritize.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-lg mx-auto text-left">
              <div className="border border-dashed border-zinc-300 rounded-lg p-4 min-h-[120px]">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">Now</p>
              </div>
              <div className="border border-dashed border-zinc-300 rounded-lg p-4 min-h-[120px]">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">Next</p>
              </div>
              <div className="border border-dashed border-zinc-300 rounded-lg p-4 min-h-[120px]">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">Later</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
