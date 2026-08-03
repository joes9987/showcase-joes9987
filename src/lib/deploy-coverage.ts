import type { ShowcaseMember } from '@/lib/site'

export function memberHasLiveDeploy (member: ShowcaseMember): boolean {
  const links = member.links ?? {}
  return Boolean(links.pmDeploy || links.chatDeploy || links.showcaseDeploy)
}

export function deployCoverage (members: ShowcaseMember[]): {
  withDeploy: number
  total: number
} {
  const publicMembers = members.filter((m) => !m.opt_out)
  return {
    withDeploy: publicMembers.filter(memberHasLiveDeploy).length,
    total: publicMembers.length
  }
}
