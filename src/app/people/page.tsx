import type { Metadata } from 'next'
import { MemberCard } from '@/components/MemberCard'
import { listPublicMembers } from '@/lib/members'
import { ui } from '@/lib/ui'

export const metadata: Metadata = {
  title: 'People',
  description: 'Browse Hult Summer Pilot cohort members, GitHub profiles, and portfolio deploys.'
}

export default async function PeoplePage () {
  const members = await listPublicMembers()

  return (
    <div className={ui.pageMain}>
      <p className={ui.eyebrow}>Roster</p>
      <h1 className={ui.pageTitle}>People</h1>
      <p className={`${ui.pageSubtitle} mt-2 max-w-2xl`}>
        Every enrolled builder has a page. Opted-out profiles show a private placeholder. Click through for GitHub and suite links.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <MemberCard key={member.github_handle} member={member} />
        ))}
      </div>
    </div>
  )
}
