import Link from 'next/link'
import { HomepageBoard } from '@/components/HomepageBoard'
import { DemoWalkthrough } from '@/components/DemoWalkthrough'
import { SiteFooter } from '@/components/SiteFooter'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-sm font-bold">K</span>
            </div>
            <span className="font-semibold tracking-tight">Kelly</span>
          </div>
          <nav className="flex items-center gap-1 sm:gap-3 text-sm">
            <Link href="/docs" className="text-zinc-600 hover:text-zinc-900 px-2 py-1 hidden sm:inline">
              Docs
            </Link>
            <Link href="/#why" className="text-zinc-600 hover:text-zinc-900 px-2 py-1 hidden sm:inline">
              Why Kelly
            </Link>
            <Link href="/login" className="text-zinc-600 hover:text-zinc-900 px-2 py-1">
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="bg-zinc-900 text-white px-3.5 py-1.5 rounded-md hover:bg-zinc-800 transition text-sm font-medium"
            >
              Open app
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-12 sm:pt-16 pb-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Left: copy */}
            <div className="text-left">
              <p className="text-sm font-medium text-zinc-500 mb-4 tracking-wide uppercase">
                For product managers & their teams
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900 leading-[1.12]">
                Everything a PM needs.
                <br />
                <span className="text-zinc-400">Nothing a PM doesn’t.</span>
              </h1>
              <p className="mt-6 text-lg text-zinc-600 max-w-lg leading-relaxed">
                Kelly is the shared command center for product work: one
                Now&nbsp;/&nbsp;Next&nbsp;/&nbsp;Later board per product, feedback
                on every bet, clear owners, and stakeholder updates without
                ceremony — so the whole team stays aligned day to day.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-600">
                <li className="flex gap-2">
                  <span className="text-zinc-400">→</span>
                  PM prioritizes; eng & design see the same stack
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-400">→</span>
                  Drag to re-order; attach the customer “why”
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-400">→</span>
                  Multi-user workspace with invite links
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard"
                  className="bg-zinc-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
                >
                  Try the roadmap
                </Link>
                <Link
                  href="/docs"
                  className="border border-zinc-300 text-zinc-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-50 transition"
                >
                  Read the docs
                </Link>
              </div>
            </div>

            {/* Right: multi-user demo “video” */}
            <div className="w-full">
              <DemoWalkthrough />
              <p className="mt-3 text-center text-[11px] text-zinc-400">
                Auto-playing walkthrough · Maya (PM), Jordan (Eng), Sam (Design)
              </p>
            </div>
          </div>
        </section>

        {/* Live demo board — primary understanding surface */}
        <section id="roadmap" className="max-w-5xl mx-auto px-6 pb-20">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-zinc-900">
              A sample product roadmap
            </h2>
            <p className="text-sm text-zinc-500 mt-1 max-w-lg mx-auto">
              This is how a PM uses Kelly day to day. Click cards to see outcomes,
              scope, and real customer feedback attached to the work.
            </p>
          </div>
          <HomepageBoard />
        </section>

        {/* Why Kelly */}
        <section id="why" className="border-t border-zinc-200 bg-zinc-50">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <h2 className="text-2xl font-semibold text-center mb-3">Why Kelly exists</h2>
            <p className="text-zinc-600 text-center max-w-2xl mx-auto mb-12 leading-relaxed">
              Most “PM tools” are either heavy strategy suites or engineering
              trackers with a roadmap view bolted on. Product managers live in the
              gap: deciding what matters, defending it with evidence, and telling
              the organization what changed — without drowning in process.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white border border-zinc-200 rounded-xl p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Problem
                </p>
                <h3 className="font-medium mb-2">Tool sprawl</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Feedback in spreadsheets, priorities in slides, status in Slack,
                  delivery in Linear or Jira. Context fractures. Status theater
                  expands.
                </p>
              </div>
              <div className="bg-white border border-zinc-200 rounded-xl p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Principle
                </p>
                <h3 className="font-medium mb-2">Fewer objects than Kaneo</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Kaneo proved project tools can stay minimal. Kelly goes further
                  for PMs: one unit of work (Item), locked Now/Next/Later, optional
                  goals — no initiative hierarchy to maintain.
                </p>
              </div>
              <div className="bg-white border border-zinc-200 rounded-xl p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Outcome
                </p>
                <h3 className="font-medium mb-2">Decide & communicate</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Prioritize in minutes. Open an item and the “why” is already
                  there. Draft stakeholder updates from the board — not from memory.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-zinc-200">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <h2 className="text-2xl font-semibold text-center mb-12">How Kelly works</h2>
            <div className="space-y-10 max-w-2xl mx-auto">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm flex items-center justify-center shrink-0 font-medium">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Capture ideas without ranking them</h3>
                  <p className="text-sm text-zinc-600 mt-1 leading-relaxed">
                    Dump requests and hunches into Ideas. Nothing is forced onto
                    the roadmap until you promote it. Inspired by triage patterns
                    in Linear, without the engineering workflow ceremony.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm flex items-center justify-center shrink-0 font-medium">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Prioritize on Now / Next / Later</h3>
                  <p className="text-sm text-zinc-600 mt-1 leading-relaxed">
                    Fixed columns. No custom workflows to configure. Move work when
                    reality changes — not when a sprint ends. This is the opposite
                    of status proliferation in heavy PMO tools.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm flex items-center justify-center shrink-0 font-medium">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Attach feedback to the work</h3>
                  <p className="text-sm text-zinc-600 mt-1 leading-relaxed">
                    Interviews, support themes, sales notes live on the Item. When
                    someone asks “why this?”, the answer is one click — not a hunt
                    through Notion and Slack.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-sm flex items-center justify-center shrink-0 font-medium">
                  4
                </div>
                <div>
                  <h3 className="font-medium">Communicate without theater</h3>
                  <p className="text-sm text-zinc-600 mt-1 leading-relaxed">
                    Structured Updates (progress, risks, next, asks) keep leadership
                    aligned. Less slide-making. More product time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compare */}
        <section id="compare" className="border-t border-zinc-200 bg-zinc-50">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <h2 className="text-2xl font-semibold text-center mb-3">
              Kelly vs Kaneo vs Linear
            </h2>
            <p className="text-sm text-zinc-500 text-center max-w-xl mx-auto mb-10">
              Kaneo and Linear are excellent at execution. Kelly is built for the
              product manager’s decision loop. See also{' '}
              <a href="https://kaneo.app/docs/core" className="underline hover:text-zinc-800" target="_blank" rel="noreferrer">
                Kaneo docs
              </a>{' '}
              and{' '}
              <a href="https://linear.app/docs" className="underline hover:text-zinc-800" target="_blank" rel="noreferrer">
                Linear docs
              </a>
              .
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-zinc-200 rounded-xl overflow-hidden bg-white">
                <thead>
                  <tr className="bg-zinc-100 text-left">
                    <th className="p-3 font-medium">Dimension</th>
                    <th className="p-3 font-medium">Kelly</th>
                    <th className="p-3 font-medium">Kaneo</th>
                    <th className="p-3 font-medium">Linear</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-600">
                  <tr className="border-t border-zinc-100">
                    <td className="p-3 font-medium text-zinc-900">Primary user</td>
                    <td className="p-3">Product managers</td>
                    <td className="p-3">Dev / delivery teams</td>
                    <td className="p-3">Engineering teams</td>
                  </tr>
                  <tr className="border-t border-zinc-100 bg-zinc-50/50">
                    <td className="p-3 font-medium text-zinc-900">Core object</td>
                    <td className="p-3">Item (roadmap unit)</td>
                    <td className="p-3">Task in a Project</td>
                    <td className="p-3">Issue in a Team</td>
                  </tr>
                  <tr className="border-t border-zinc-100">
                    <td className="p-3 font-medium text-zinc-900">Statuses</td>
                    <td className="p-3">Locked Now/Next/Later</td>
                    <td className="p-3">Custom columns</td>
                    <td className="p-3">Custom workflows + cycles</td>
                  </tr>
                  <tr className="border-t border-zinc-100 bg-zinc-50/50">
                    <td className="p-3 font-medium text-zinc-900">Feedback</td>
                    <td className="p-3">Native on items</td>
                    <td className="p-3">Not first-class</td>
                    <td className="p-3">Customer requests (add-on)</td>
                  </tr>
                  <tr className="border-t border-zinc-100">
                    <td className="p-3 font-medium text-zinc-900">Stakeholder updates</td>
                    <td className="p-3">Built-in structure</td>
                    <td className="p-3">—</td>
                    <td className="p-3">Project updates</td>
                  </tr>
                  <tr className="border-t border-zinc-100 bg-zinc-50/50">
                    <td className="p-3 font-medium text-zinc-900">Philosophy</td>
                    <td className="p-3">Decide & communicate</td>
                    <td className="p-3">All you need, nothing you don’t</td>
                    <td className="p-3">Purpose-built for software teams</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="border-t border-zinc-200">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <h2 className="text-2xl font-semibold text-center mb-10">Design principles</h2>
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {[
                ['Minimal surface', 'If a feature does not help a PM decide, prioritize, or communicate, it does not ship.'],
                ['Fixed over flexible', 'Locked statuses beat infinite custom fields. Configuration is not a feature.'],
                ['Evidence on the work', 'Feedback lives on the Item so rationale never drifts into a separate wiki.'],
                ['Calm by default', 'Generous whitespace, few colors, no notification theater. The tool should disappear.'],
              ].map(([t, d]) => (
                <div key={t} className="border border-zinc-200 rounded-xl p-5">
                  <h3 className="font-medium mb-1">{t}</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-zinc-200 bg-zinc-900 text-white">
          <div className="max-w-5xl mx-auto px-6 py-16 text-center">
            <h2 className="text-2xl font-semibold mb-3">Start with the board</h2>
            <p className="text-zinc-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
              Open the interactive demo above, or sign in to persist your own
              workspace. Full guides live in the docs.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/dashboard"
                className="bg-white text-zinc-900 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-100"
              >
                Open roadmap
              </Link>
              <Link
                href="/docs/getting-started"
                className="border border-zinc-600 text-zinc-200 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800"
              >
                Getting started
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
