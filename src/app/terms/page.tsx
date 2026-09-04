import Link from 'next/link'
import { SiteFooter } from '@/components/SiteFooter'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-zinc-200">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-3 text-sm">
          <Link href="/" className="font-semibold">Kelly</Link>
          <span className="text-zinc-300">/</span>
          <span>Terms of use</span>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 text-sm text-zinc-600 space-y-4 leading-relaxed">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-6">Terms of use</h1>
        <p>Last updated: September 4, 2026</p>
        <p>
          By accessing Kelly (the website, application, or related documentation)
          you agree to these terms. If you do not agree, do not use the service.
        </p>
        <h2 className="text-base font-semibold text-zinc-900 pt-4">The service</h2>
        <p>
          Kelly provides product management tooling including roadmaps, feedback
          attachment, and related features. The software may be offered as a
          hosted service and/or as open-source code you run yourself.
        </p>
        <h2 className="text-base font-semibold text-zinc-900 pt-4">Your content</h2>
        <p>
          You retain ownership of content you submit. You grant the operators a
          limited license to host and process that content solely to provide the
          service. You are responsible for having the rights to material you upload.
        </p>
        <h2 className="text-base font-semibold text-zinc-900 pt-4">Acceptable use</h2>
        <p>
          Do not misuse the service (probing vulnerabilities without permission,
          abusing authentication, infringing others’ rights, or unlawful activity).
          Operators may suspend access for abuse.
        </p>
        <h2 className="text-base font-semibold text-zinc-900 pt-4">Disclaimer</h2>
        <p>
          Kelly is provided “as is” without warranties of any kind. To the fullest
          extent permitted by law, operators are not liable for indirect or
          consequential damages arising from use of the service.
        </p>
        <h2 className="text-base font-semibold text-zinc-900 pt-4">Changes</h2>
        <p>
          Terms may be updated periodically. Continued use after changes constitutes
          acceptance of the revised terms.
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
