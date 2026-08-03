import type { Metadata } from 'next'
import { PeopleDirectory } from '@/components/PeopleDirectory'
import { deployCoverage } from '@/lib/deploy-coverage'
import { listPublicMembers } from '@/lib/members'
import { ui } from '@/lib/ui'

export const metadata: Metadata = {
  title: 'People',
  description: 'Browse and filter Hult Summer Pilot cohort members by skill, project, or campus.'
}

export default async function PeoplePage () {
  const members = await listPublicMembers()
  const coverage = deployCoverage(members)

  return (
    <div className={ui.pageMain}>
      <p className={ui.eyebrow}>Roster</p>
      <h1 className={ui.pageTitle}>People</h1>
      <p className={`${ui.pageSubtitle} mt-2 max-w-2xl`}>
        Every enrolled builder has a page. Opted-out profiles show a private placeholder. Filter by skill or project, then open GitHub and suite links.
      </p>
      <p className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--card-foreground)]">
        <span className="font-semibold text-[var(--foreground)]">
          {coverage.withDeploy} of {coverage.total}
        </span>{' '}
        public builders have a verified live Project 1 or Project 2 deploy chip. Others stay GitHub-only until a public URL returns HTTP 200 — we do not invent deploys.
      </p>
      <PeopleDirectory members={members} />
    </div>
  )
}
