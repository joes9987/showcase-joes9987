import type { Metadata } from 'next'
import { PeopleDirectory } from '@/components/PeopleDirectory'
import { listPublicMembers } from '@/lib/members'
import { ui } from '@/lib/ui'

export const metadata: Metadata = {
  title: 'People',
  description: 'Browse and filter Hult Summer Pilot cohort members by skill, project, or campus.'
}

export default async function PeoplePage () {
  const members = await listPublicMembers()

  return (
    <div className={ui.pageMain}>
      <p className={ui.eyebrow}>Roster</p>
      <h1 className={ui.pageTitle}>People</h1>
      <p className={`${ui.pageSubtitle} mt-2 max-w-2xl`}>
        Every enrolled builder has a page. Opted-out profiles show a private placeholder. Filter by skill or project, then open GitHub and suite links.
      </p>
      <PeopleDirectory members={members} />
    </div>
  )
}
