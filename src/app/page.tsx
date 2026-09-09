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
                Built by a PM, for product decision-making
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900 leading-[1.12]">
                See where you are.
                <br />
                Choose what&apos;s next.
              </h1>
              <p className="mt-6 text-lg text-zinc-600 max-w-lg leading-relaxed">
                Kelly is the command center for product priorities: a shared
                Now&nbsp;/&nbsp;Next&nbsp;/&nbsp;Later board so leadership, eng,
                and design answer the same three questions every week — what
                we&apos;re advancing, what&apos;s queued, and what we&apos;re
                deliberately deferring.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-600">
                <li className="flex gap-2">
                  <span className="text-zinc-400">→</span>
                  Influence decisions with evidence on the work, not slide decks
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-400">→</span>
                  Align agile teams without becoming another Jira
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-400">→</span>
                  Connect roadmap bets to outcomes (OKRs) without cascade theater
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
                  href="/#why"
                  className="border border-zinc-300 text-zinc-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-50 transition"
                >
                  Why Kelly exists
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
            <p className="text-zinc-500 text-center text-sm mb-10 max-w-xl mx-auto">
              A product built from two decades in the gap between project delivery and product judgment.
            </p>

            <div className="max-w-3xl mx-auto mb-14 text-zinc-600 leading-relaxed space-y-4 text-[15px]">
              <p>
                For more than twenty years I&apos;ve worked as an IT project manager
                and product manager — sitting between engineering trackers, executive
                decks, and the real question every week: <em>what should we do now,
                what comes next, and what can wait?</em>
              </p>
              <p>
                The tools never matched the job. Jira and Linear are excellent at
                delivery: issues, sprints, velocity. Strategy suites and OKR platforms
                are excellent at cascading goals on paper. In between lives the PM&apos;s
                actual work — choosing a short list of bets, defending them with
                customer evidence, aligning the team, and giving leadership a calm
                picture of reality. That middle layer was always improvised: slides,
                spreadsheets, Slack threads, and status meetings that existed only
                because the system of record couldn&apos;t tell the story.
              </p>
              <p>
                Kelly is that missing layer. Not another issue tracker. Not a heavy
                PPM suite. A straight-to-the-point command center so anyone — PM,
                tech lead, or executive — can open one board and understand{' '}
                <strong className="text-zinc-800 font-medium">where we are, what we&apos;re doing next, and what we&apos;re doing later</strong>.
                The goal is influence: better decisions, less theater, shared clarity.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white border border-zinc-200 rounded-xl p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Problem
                </p>
                <h3 className="font-medium mb-2">The middle is missing</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Feedback in sheets, priorities in slides, status in Slack, delivery
                  in Linear or Jira. Context fractures. Executives ask for clarity;
                  PMs rebuild the narrative every week from fragments.
                </p>
              </div>
              <div className="bg-white border border-zinc-200 rounded-xl p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Principle
                </p>
                <h3 className="font-medium mb-2">Priority, not process</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  One unit of work. Locked Now / Next / Later. Optional goals for
                  outcome context. No issue types, sprint machinery, or initiative
                  trees to administer — those stay in your delivery tool.
                </p>
              </div>
              <div className="bg-white border border-zinc-200 rounded-xl p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Outcome
                </p>
                <h3 className="font-medium mb-2">Decide & communicate</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Prioritize in minutes. Evidence lives on the item. Owners are
                  visible. Stakeholder updates come from the board — so influence
                  is continuous, not a quarterly scramble.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* Now Next Later + alignment */}
        <section id="now-next-later" className="border-t border-zinc-200">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <h2 className="text-2xl font-semibold text-center mb-3">
              Now, Next, Later — priority, not a calendar
            </h2>
            <p className="text-sm text-zinc-500 text-center max-w-2xl mx-auto mb-12 leading-relaxed">
              People always ask what the time boxes are. Kelly does not invent fake
              sprints. Columns answer <em>what we choose</em>, not <em>when the Gantt
              says so</em>. Optional horizons and target dates add soft timing when you need it.
            </p>
            <div className="grid md:grid-cols-3 gap-5 mb-14">
              <div className="border border-zinc-200 rounded-xl p-5 bg-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">Now</p>
                <h3 className="font-medium mb-2">Actively advancing</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  The short list of bets capacity is on. Not “due this Friday” —
                  <em>chosen</em> for focus. Executives should be able to scan Now
                  and know the company&apos;s product attention.
                </p>
              </div>
              <div className="border border-zinc-200 rounded-xl p-5 bg-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 mb-2">Next</p>
                <h3 className="font-medium mb-2">Queued when capacity opens</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Ready to pull forward — not scheduled into a fictional sprint.
                  Drag here when Now is full. Keeps the pipeline honest without
                  pretending certainty.
                </p>
              </div>
              <div className="border border-zinc-200 rounded-xl p-5 bg-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Later</p>
                <h3 className="font-medium mb-2">Deliberately deferred</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Visible on purpose — not a shame backlog. Later means we said no
                  for now. That honesty is what stops every request from becoming a
                  silent commitment.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="rounded-xl border border-zinc-200 p-6 bg-zinc-50">
                <h3 className="font-medium mb-2">For executives</h3>
                <p className="text-sm text-zinc-600 leading-relaxed mb-3">
                  Open one board. See the priority stack, owners, and evidence.
                  Read a short Update (progress, risks, asks) instead of a
                  slide rebuild. Kelly supports decision and alignment — not
                  delivery micromanagement. Ship dates and capacity stay in
                  Linear or Jira.
                </p>
                <p className="text-xs text-zinc-500">
                  Ask: What are we choosing? Why? Who owns it? What blocked us?
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-6 bg-zinc-50">
                <h3 className="font-medium mb-2">OKRs & agile alignment</h3>
                <p className="text-sm text-zinc-600 leading-relaxed mb-3">
                  Optional Goals hold outcome context (the “why this quarter”).
                  Items are the bets that might move those outcomes — directional
                  alignment, not a rigid KR cascade. For agile teams, Kelly is the
                  shared product priority surface; sprints and tickets remain the
                  delivery system of record.
                </p>
                <p className="text-xs text-zinc-500">
                  Strategy → ranked bets → evidence → narrative. Execution tools do the rest.
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
              Kelly vs Linear vs Jira
            </h2>
            <p className="text-sm text-zinc-500 text-center max-w-xl mx-auto mb-10">
              Linear and Jira excel at execution. Kelly exists for the decision
              loop twenty years of PM work kept reinventing in slides: prioritize,
              attach evidence, align the team, brief leadership — without becoming
              another issue tracker. See also{' '}
              <a href="https://linear.app/docs" className="underline hover:text-zinc-800" target="_blank" rel="noreferrer">
                Linear docs
              </a>{' '}
              and{' '}
              <a href="https://www.atlassian.com/software/jira/guides" className="underline hover:text-zinc-800" target="_blank" rel="noreferrer">
                Jira guides
              </a>
              .
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-zinc-200 rounded-xl overflow-hidden bg-white">
                <thead>
                  <tr className="bg-zinc-100 text-left">
                    <th className="p-3 font-medium">Dimension</th>
                    <th className="p-3 font-medium">Kelly</th>
                    <th className="p-3 font-medium">Linear</th>
                    <th className="p-3 font-medium">Jira</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-600">
                  <tr className="border-t border-zinc-100">
                    <td className="p-3 font-medium text-zinc-900">Primary user</td>
                    <td className="p-3">Product managers</td>
                    <td className="p-3">Engineering teams</td>
                    <td className="p-3">Delivery / IT teams</td>
                  </tr>
                  <tr className="border-t border-zinc-100 bg-zinc-50/50">
                    <td className="p-3 font-medium text-zinc-900">Core object</td>
                    <td className="p-3">Item (roadmap unit)</td>
                    <td className="p-3">Issue in a Team</td>
                    <td className="p-3">Issue / work item</td>
                  </tr>
                  <tr className="border-t border-zinc-100">
                    <td className="p-3 font-medium text-zinc-900">Statuses</td>
                    <td className="p-3">Locked Now / Next / Later</td>
                    <td className="p-3">Workflow + cycles</td>
                    <td className="p-3">Fully custom workflows</td>
                  </tr>
                  <tr className="border-t border-zinc-100 bg-zinc-50/50">
                    <td className="p-3 font-medium text-zinc-900">Hierarchy</td>
                    <td className="p-3">Product → Items</td>
                    <td className="p-3">Initiatives → Projects → Issues</td>
                    <td className="p-3">Epics → Stories → Sub-tasks</td>
                  </tr>
                  <tr className="border-t border-zinc-100">
                    <td className="p-3 font-medium text-zinc-900">Customer feedback</td>
                    <td className="p-3">First-class on each Item</td>
                    <td className="p-3">Comments / links</td>
                    <td className="p-3">Comments / linked issues</td>
                  </tr>
                  <tr className="border-t border-zinc-100 bg-zinc-50/50">
                    <td className="p-3 font-medium text-zinc-900">Stakeholder updates</td>
                    <td className="p-3">Built for PM narrative</td>
                    <td className="p-3">Project updates</td>
                    <td className="p-3">Dashboards / reports</td>
                  </tr>
                  <tr className="border-t border-zinc-100">
                    <td className="p-3 font-medium text-zinc-900">Configuration</td>
                    <td className="p-3">Almost none</td>
                    <td className="p-3">Teams, cycles, workflows</td>
                    <td className="p-3">Heavy admin surface</td>
                  </tr>
                  <tr className="border-t border-zinc-100 bg-zinc-50/50">
                    <td className="p-3 font-medium text-zinc-900">Philosophy</td>
                    <td className="p-3">Decide & communicate</td>
                    <td className="p-3">Purpose-built for software teams</td>
                    <td className="p-3">Track any work at scale</td>
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
                ['Built from the middle', 'Twenty years between delivery trackers and executive decks showed the gap: a simple view of Now, Next, and Later that can influence real decisions.'],
                ['Priority over process', 'Locked Now / Next / Later beats infinite workflows. Configuration is not a feature; clarity is.'],
                ['Evidence on the work', 'Feedback lives on the Item so the rationale never drifts into a separate wiki or Slack thread.'],
                ['Align without absorbing delivery', 'Shared boards and owners help agile teams and OKR intent stay coherent — while Linear and Jira remain the system of record for execution.'],
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
