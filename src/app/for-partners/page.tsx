import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE } from '@/lib/site'
import { ui } from '@/lib/ui'

export const metadata: Metadata = {
  title: 'For partners',
  description:
    'What a hiring partner can verify on EudaMarket in about ten minutes — people, portfolios, Forth status, and how to request an intro.'
}

const CHECKS = [
  {
    title: 'Production readiness',
    body: 'Public HTTPS pages load without signing in. Browse on a phone; the header and people grid stay usable.',
    href: '/',
    linkLabel: 'Open homepage'
  },
  {
    title: 'People you can inspect',
    body: 'Every enrolled builder has a page. Filter by skill or project, then open GitHub and live deploys. Opted-out profiles show a private placeholder.',
    href: '/people',
    linkLabel: 'Browse people'
  },
  {
    title: 'Portfolio links that work',
    body: 'Profile cards link to real repositories and production apps from the cohort — not placeholder URLs.',
    href: '/people/joes9987',
    linkLabel: 'Sample profile'
  },
  {
    title: 'Forth project status',
    body: 'A dated snapshot from the cohort PM platform (Forth) sits on the home page and on profiles, with a direct link into Forth.',
    href: '/#forth-status',
    linkLabel: 'See Forth snapshot'
  },
  {
    title: 'Hire path + privacy',
    body: 'Partners page summarizes how to hire (~25% first-year fee), request an introduction, and RSVP for the end-of-pilot showcase. Privacy opt-out is demonstrable.',
    href: '/partners',
    linkLabel: 'Partners + intro'
  },
  {
    title: 'Connected suite',
    body: 'EudaMarket sits with EudaPM and EudaChat. Participants use one account across those surfaces; deep links keep evaluation on the same builders.',
    href: '/suite',
    linkLabel: 'Suite overview'
  }
]

export default function ForPartnersPage () {
  return (
    <div className={ui.pageMain}>
      <p className={ui.eyebrow}>Hiring partners</p>
      <h1 className={ui.pageTitle}>What you can verify in ten minutes</h1>
      <p className={`${ui.pageSubtitle} mt-2 max-w-2xl`}>
        {SITE.name} is built so a hiring partner can judge builders from public proof — GitHub, deploys, and Forth status —
        then request a warm intro. Use this checklist as a short walkthrough; you do not need a GitHub account to use the site.
      </p>

      <ol className="mt-10 space-y-4">
        {CHECKS.map((item, index) => (
          <li key={item.title} className={`${ui.cardSm} list-none`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs text-[var(--muted)]">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h2 className="font-display mt-1 text-lg font-semibold text-[var(--foreground)]">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--card-foreground)]">{item.body}</p>
              </div>
              <Link href={item.href} className={`${ui.btnSecondary} shrink-0`}>
                {item.linkLabel}
              </Link>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-sm text-[var(--muted)]">
        Ready to talk?{' '}
        <Link href="/partners#intro" className={ui.linkAccent}>
          Request an intro
        </Link>
        {' · '}
        <Link href="/partners#rsvp" className={ui.linkAccent}>
          RSVP for the showcase
        </Link>
        {' · '}
        Privacy demo:{' '}
        <Link href="/people/rebekah-dev" className={ui.linkAccent}>
          /people/rebekah-dev
        </Link>
      </p>
    </div>
  )
}
