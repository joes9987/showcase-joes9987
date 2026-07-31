import Link from 'next/link'
import { ForthStatusPanel } from '@/components/ForthStatusPanel'
import { MemberCard } from '@/components/MemberCard'
import { loadForthStatus } from '@/lib/forth-status'
import { listPublicMembers } from '@/lib/members'
import { SITE } from '@/lib/site'
import { ui } from '@/lib/ui'

function featuredScore (member: Awaited<ReturnType<typeof listPublicMembers>>[number]) {
  const links = member.links ?? {}
  let score = 0
  if (member.bio) score += 3
  if (member.campus) score += 1
  if ((member.skills?.length ?? 0) >= 2) score += 2
  if (links.pmDeploy || links.chatDeploy || links.showcaseDeploy) score += 4
  if (links.pmRepo || links.chatRepo) score += 2
  if (member.headline && !/full-stack cohort builder/i.test(member.headline)) score += 2
  return score
}

export default async function HomePage () {
  const [members, forth] = await Promise.all([listPublicMembers(), loadForthStatus()])
  const featured = [...members].sort((a, b) => featuredScore(b) - featuredScore(a)).slice(0, 6)

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
          The Hult Summer Pilot asks builders to prove themselves the way hiring teams already evaluate engineers: ship working
          software in public, accept peer review, and keep a deploy URL that loads. Each week is a production cycle—not a case
          competition with slides. Project 1 produced the cohort project-management platform; Forth won and now operates as the
          shared workspace for tickets and pace. Project 2 produced internal communications tools used by the same participants.
          Project 3—this site—is the partner-facing showcase: browse people, open their GitHub and live apps, and request an
          introduction when someone stands out.
        </p>
        <p>
          EudaMarket is part of a connected suite with EudaPM and EudaChat. Participants use one account across those surfaces, so
          the builder you meet here is the same person managing work and collaborating with peers day to day. You do not need a
          separate login to evaluate them: open a profile, follow links to repositories and production deploys, and check the Forth
          status strip for what the cohort is shipping this week. That status is refreshed from the live Forth platform for partner
          pages—so the narrative stays tied to real project progress, not marketing copy.
        </p>
        <p>
          If you are hiring for internships, associate engineering, or product roles that reward builders who can operate with
          modern tooling, start on the people grid. Filter by skill or project, read merged PRs and READMEs, and click through to
          running demos. When you want a conversation, use the partners page—we route intro requests to the placement lead and
          confirm student interest before scheduling. Placement terms are summarized there (typically about 25% of first-year cash
          compensation for successful hires). Participants who prefer privacy can opt out; their page shows a private placeholder
          without removing them from the enrolled roster.
        </p>
      </section>

      <div id="forth-status" className="mt-12 scroll-mt-24">
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
