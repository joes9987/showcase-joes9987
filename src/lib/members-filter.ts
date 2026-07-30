import type { ShowcaseMember } from '@/lib/site'

export function filterMembers (
  members: ShowcaseMember[],
  query: string,
  skill: string
): ShowcaseMember[] {
  const q = query.trim().toLowerCase()
  const skillNeedle = skill.trim().toLowerCase()

  return members.filter((m) => {
    if (skillNeedle && !(m.skills ?? []).some((s) => s.toLowerCase().includes(skillNeedle))) {
      return false
    }
    if (!q) return true
    const hay = [
      m.display_name,
      m.github_handle,
      m.headline ?? '',
      m.campus ?? '',
      ...(m.skills ?? [])
    ]
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  })
}
