import Link from 'next/link'
import { EudaMarketLogo } from '@/components/EudaMarketLogo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SITE } from '@/lib/site'
import { ui } from '@/lib/ui'

const NAV = [
  { href: '/people', label: 'People' },
  { href: '/suite', label: 'Suite' },
  { href: '/partners', label: 'Partners' }
]

export function SiteHeader () {
  return (
    <header className="app-header sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <EudaMarketLogo />
          <span className="font-display text-base font-bold">
            <span className="text-gradient">{SITE.name}</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={ui.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/app/profile" className={ui.btnGhost}>
            Claim profile
          </Link>
          <Link href="/partners#intro" className={ui.btnPrimary}>
            Request intro
          </Link>
        </div>
      </div>
    </header>
  )
}

export function SiteFooter () {
  return (
    <footer className="mt-16 border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold">
            <span className="text-gradient">{SITE.name}</span>
          </p>
          <p className="mt-1 max-w-sm text-sm text-[var(--muted)]">
            Public showcase for {SITE.cohort}. Same identity as EudaPM and EudaChat.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <a className={ui.linkAccent} href={SITE.pmUrl} target="_blank" rel="noreferrer">
            EudaPM
          </a>
          <a className={ui.linkAccent} href={SITE.chatUrl} target="_blank" rel="noreferrer">
            EudaChat
          </a>
          <a className={ui.linkAccent} href={SITE.forthUrl} target="_blank" rel="noreferrer">
            Forth
          </a>
          <Link className={ui.linkAccent} href="/partners">
            Partners
          </Link>
        </div>
      </div>
    </footer>
  )
}
