import Link from 'next/link'
import { ForthStatusPanel } from '@/components/ForthStatusPanel'
import { MemberCard } from '@/components/MemberCard'
import { loadForthStatus } from '@/lib/forth-status'
import { listPublicMembers } from '@/lib/members'
import { SITE } from '@/lib/site'
import { ui } from '@/lib/ui'

export default async function HomePage () {
  const [members, forth] = await Promise.all([listPublicMembers(), loadForthStatus()])
  const featured = members.slice(0, 6)

  return (
    <div className={ui.pageMain}>
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] px-6 py-14 shadow-[var(--shadow-elevated)] sm:px-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--glow-1)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-[var(--glow-2)] blur-3xl" />
        <p className={`${ui.eyebrow} animate-fade-up`}>{SITE.cohort}</p>
        <h1 className="font-display animate-fade-up mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl">
          <span className="text-gradient">{SITE.name}</span>
        </h1>
        <p className="animate-fade-up mt-4 max-w-2xl text-lg text-[var(--muted-foreground)]" style={{ animationDelay: '60ms' }}>
          {SITE.tagline}
        </p>
        <div className="animate-fade-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: '120ms' }}>
          <Link href="/people" className={ui.btnPrimaryLg}>
            Browse people
          </Link>
          <Link href="/partners#intro" className={ui.btnSecondary}>
            Request an intro
          </Link>
          <a href={SITE.pmUrl} target="_blank" rel="noreferrer" className={ui.btnGhost}>
            Open EudaPM
          </a>
          <a href={SITE.chatUrl} target="_blank" rel="noreferrer" className={ui.btnGhost}>
            Open EudaChat
          </a>
        </div>
      </section>

      <section className="mt-12 max-w-3xl space-y-4 text-[var(--card-foreground)] leading-relaxed">
        <h2 className="font-display text-2xl font-semibold text-[var(--foreground)]">Why this cohort is hireable</h2>
        <p>
          The Hult Summer Pilot is not a lecture series with slide decks. Each week, participants ship production software under
          the same constraints hiring partners care about: public GitHub history, peer review, deploy URLs that actually load, and
          a competitive vote that rewards usable products—not pitch theater. Project 1 produced a cohort project-management
          platform; Forth won and now operates as the shared PM surface. Project 2 produced internal communications platforms
          (including EudaChat). Project 3—this site—is the partner-facing showcase: a single place to inspect people, follow
          their portfolio links into live apps, and request a warm intro when someone stands out.
        </p>
        <p>
          EudaMarket sits in a shared suite with EudaPM and EudaChat on the same Supabase identity. That means the profile you
          claim here is the same account you use to manage work and talk with peers. Partners do not need another login to evaluate
          builders: open a profile, click through to GitHub repositories and Vercel deploys, then read the Forth status strip for
          what the cohort is currently building. PM status on this site comes from a committed Forth snapshot refreshed for partner
          pages, plus deep links into live EudaPM and EudaChat deploys—proof you can click, not brochure copy.
        </p>
        <p>
          If you are hiring for internships, associate engineering, or product roles that reward agentic builders, start on the
          people grid. Look for merged PRs, honest READMEs, and deploy links that match the submission. When you want a conversation,
          use the partners page: we persist every intro request and notify the placement lead. Placement fees are summarized there
          (~25% of first-year cash compensation for successful hires). Opted-out participants appear as private placeholders so the
          roster stays complete without exposing anyone who prefers not to be public.
        </p>
      </section>

      <div className="mt-12">
        <ForthStatusPanel status={forth} />
      </div>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className={ui.eyebrow}>Featured builders</p>
            <h2 className="font-display mt-1 text-2xl font-semibold">Meet the cohort</h2>
          </div>
          <Link href="/people" className={ui.linkAccent}>
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((member) => (
            <MemberCard key={member.github_handle} member={member} />
          ))}
        </div>
      </section>
    </div>
  )
}
