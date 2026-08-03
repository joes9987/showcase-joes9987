import type { Metadata } from 'next'
import Link from 'next/link'
import { PartnerIntroForm } from '@/components/PartnerIntroForm'
import { ShowcaseRsvpForm } from '@/components/ShowcaseRsvpForm'
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
              what the group is shipping this week. When you want a conversation, request an intro — we connect you with
              program / placement staff, who confirm student interest and share current placement terms before anything is
              scheduled.
            </p>
            <p>
              This showcase does not publish fee schedules or commit builders to commercial terms. Placement staff reply to
              intro requests with next steps; fees and process are confirmed with the program, not inferred from this page.
            </p>
            <p className={`${ui.alertWarning} text-sm`}>
              Roster cards are the enrolled Summer Pilot cohort (seeded for partners). Builders can opt out of a public card
              via Sign in → Claim / Edit profile; opted-out pages show a private placeholder (example:{' '}
              <Link className={ui.linkAccent} href="/people/rebekah-dev">
                /people/rebekah-dev
              </Link>
              ).
            </p>
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              <li>
                Browse and filter <Link className={ui.linkAccent} href="/people">people</Link> by skill or project.
              </li>
              <li>Open live apps (EudaPM, EudaChat, Forth, peer deploys).</li>
              <li>Submit the intro form with the handles you care about.</li>
              <li>RSVP for the end-of-pilot showcase event below.</li>
              <li>Placement staff reply with next steps.</li>
            </ol>
            <p className="text-sm">
              <Link className={ui.linkAccent} href="/for-partners">
                How we present evidence →
              </Link>
              {' '}
              (ten-minute partner walkthrough)
            </p>
          </div>
          <ShowcaseRsvpForm />
        </section>
        <PartnerIntroForm />
      </div>
    </div>
  )
}
