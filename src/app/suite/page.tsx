import type { Metadata } from 'next'
import { SITE } from '@/lib/site'
import { ui } from '@/lib/ui'

export const metadata: Metadata = {
  title: 'Euda suite',
  description: 'EudaPM, EudaChat, and EudaMarket — the shared suite for the Hult Summer Pilot.'
}

const APPS = [
  {
    name: 'EudaPM',
    href: SITE.pmUrl,
    blurb: 'Project management for cohort work: tickets, pace, and proof that tasks move.'
  },
  {
    name: 'EudaChat',
    href: SITE.chatUrl,
    blurb: 'Internal communications: channels, DMs, announcements, and search for the pilot.'
  },
  {
    name: 'EudaMarket',
    href: SITE.marketUrl,
    blurb: 'This site — partner-facing showcase with roster profiles and intro requests.'
  }
]

export default function SuitePage () {
  return (
    <div className={ui.pageMain}>
      <p className={ui.eyebrow}>Cross-app</p>
      <h1 className={ui.pageTitle}>The Euda suite</h1>
      <p className={`${ui.pageSubtitle} mt-2 max-w-2xl`}>
        One Supabase project, three surfaces. Same email account across PM and Chat; Market uses the same identity to claim a
        public showcase card. Cookies are per-host—sign in once per app.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {APPS.map((app) => (
          <a
            key={app.name}
            href={app.href}
            target={app.name === 'EudaMarket' ? undefined : '_blank'}
            rel={app.name === 'EudaMarket' ? undefined : 'noreferrer'}
            className={`${ui.card} block transition hover:border-[var(--primary)]`}
          >
            <h2 className="font-display text-xl font-semibold text-gradient">{app.name}</h2>
            <p className="mt-3 text-sm text-[var(--card-foreground)]">{app.blurb}</p>
            <p className="mt-4 text-sm font-semibold text-[var(--primary)]">Open →</p>
          </a>
        ))}
      </div>
      <section className={`${ui.card} mt-8`}>
        <p className={ui.eyebrow}>Also linked</p>
        <h2 className="font-display mt-1 text-xl font-semibold">Forth</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Forth is the Project 1 winning PM platform operating for the full cohort. EudaMarket shows a daily status snapshot from{' '}
          <a className={ui.linkAccent} href={SITE.forthUrl} target="_blank" rel="noreferrer">
            {SITE.forthUrl}
          </a>
          .
        </p>
      </section>
    </div>
  )
}
