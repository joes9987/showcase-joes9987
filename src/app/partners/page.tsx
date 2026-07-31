import type { Metadata } from 'next'
import Link from 'next/link'
import { PartnerIntroForm } from '@/components/PartnerIntroForm'
import { ShowcaseRsvpForm } from '@/components/ShowcaseRsvpForm'
import { SITE } from '@/lib/site'
import { ui } from '@/lib/ui'

export const metadata: Metadata = {
  title: 'Partners',
  description: 'How to hire from the Hult Summer Pilot, request an introduction, and RSVP for the showcase event.'
}

export default function PartnersPage () {
  return (
    <div className={ui.pageMain}>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <p className={ui.eyebrow}>Hiring partners</p>
          <h1 className={ui.pageTitle}>Hire builders you can inspect</h1>
          <div className="mt-6 space-y-4 text-[var(--card-foreground)] leading-relaxed">
            <p>
              Evaluate candidates the way the cohort works: read their GitHub, click their deploys, and skim Forth status for
              what the group is shipping this week. When you want a conversation, request an intro—we confirm student opt-in
              before scheduling.
            </p>
            <p>
              Placement fee summary: successful hires facilitated through the program are typically billed at approximately{' '}
              <strong className="text-[var(--foreground)]">25% of first-year cash compensation</strong>. Exact terms are
              confirmed with the placement lead ({SITE.placementEmail}) before any engagement letter.
            </p>
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              <li>
                Browse and filter <Link className={ui.linkAccent} href="/people">people</Link> by skill or project.
              </li>
              <li>Open live apps (EudaPM, EudaChat, Forth, peer deploys).</li>
              <li>Submit the intro form with the handles you care about.</li>
              <li>RSVP for the end-of-pilot showcase event below.</li>
              <li>We reply from the placement inbox with next steps.</li>
            </ol>
            <p className="text-sm text-[var(--muted)]">
              Privacy: opted-out builders appear as private placeholders (example:{' '}
              <Link className={ui.linkAccent} href="/people/rebekah-dev">
                /people/rebekah-dev
              </Link>
              ).
            </p>
          </div>
          <ShowcaseRsvpForm />
        </section>
        <PartnerIntroForm />
      </div>
    </div>
  )
}
