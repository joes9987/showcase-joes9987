import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import type { ShowcaseMember } from '@/lib/site'
import roster from '../../data/roster.json'

const MEMBER_SELECT =
  'github_handle, display_name, headline, bio, avatar_url, banner_url, campus, skills, opt_out, links, claimed_by, updated_at'

type RosterRow = {
  github_handle: string
  display_name: string
  headline?: string
  bio?: string
  campus?: string
  skills?: string[]
  opt_out?: boolean
  links?: ShowcaseMember['links']
}

export function fallbackRoster (): ShowcaseMember[] {
  return (roster as RosterRow[]).map((row) => ({
    github_handle: row.github_handle,
    display_name: row.display_name,
    headline: row.headline ?? null,
    bio: row.bio ?? null,
    avatar_url: null,
    banner_url: null,
    campus: row.campus ?? null,
    skills: row.skills ?? [],
    opt_out: row.opt_out ?? false,
    links: row.links ?? { github: `https://github.com/${row.github_handle}` },
    claimed_by: null
  }))
}

function linkRichness (member: ShowcaseMember): number {
  const links = member.links ?? {}
  return ['pmDeploy', 'chatDeploy', 'showcaseDeploy', 'pmRepo', 'chatRepo']
    .filter((key) => Boolean((links as Record<string, unknown>)[key]))
    .length
}

/** Collapse case-variant handles; prefer claimed + richer portfolio links. */
export function dedupeMembersByHandle (members: ShowcaseMember[]): ShowcaseMember[] {
  const byKey = new Map<string, ShowcaseMember>()
  for (const raw of members) {
    const key = raw.github_handle.toLowerCase()
    const member = {
      ...raw,
      github_handle: key,
      campus: raw.campus ?? null,
      skills: raw.skills ?? []
    }
    const prev = byKey.get(key)
    if (!prev) {
      byKey.set(key, member)
      continue
    }
    const preferNew =
      (Boolean(member.claimed_by) && !prev.claimed_by) ||
      (Boolean(member.claimed_by) === Boolean(prev.claimed_by) &&
        linkRichness(member) > linkRichness(prev))
    const winner = preferNew ? member : prev
    const loser = preferNew ? prev : member
    byKey.set(key, {
      ...winner,
      links: { ...(loser.links ?? {}), ...(winner.links ?? {}) },
      headline: winner.headline ?? loser.headline,
      bio: winner.bio ?? loser.bio,
      campus: winner.campus ?? loser.campus,
      skills: (winner.skills?.length ? winner.skills : loser.skills) ?? [],
      display_name: winner.display_name || loser.display_name
    })
  }
  return [...byKey.values()].sort((a, b) =>
    a.display_name.localeCompare(b.display_name, undefined, { sensitivity: 'base' })
  )
}

/** Prefer richer portfolio cards on public grids when DB rows are thin. */
export function mergeRosterEnrichment (member: ShowcaseMember): ShowcaseMember {
  const seed = fallbackRoster().find(
    (r) => r.github_handle.toLowerCase() === member.github_handle.toLowerCase()
  )
  if (!seed) return member

  const links = { ...(seed.links ?? {}), ...(member.links ?? {}) }
  return {
    ...member,
    github_handle: member.github_handle.toLowerCase(),
    headline: member.headline ?? seed.headline,
    bio: member.bio ?? seed.bio,
    campus: member.campus ?? seed.campus,
    skills: (member.skills?.length ? member.skills : seed.skills) ?? [],
    links
  }
}

export async function listPublicMembers (): Promise<ShowcaseMember[]> {
  if (!isSupabaseConfigured()) {
    return dedupeMembersByHandle(fallbackRoster().filter((m) => !m.opt_out))
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('showcase_members')
      .select(MEMBER_SELECT)
      .eq('opt_out', false)
      .order('display_name')

    if (error || !data?.length) {
      return dedupeMembersByHandle(fallbackRoster().filter((m) => !m.opt_out))
    }
    return dedupeMembersByHandle(
      (data as ShowcaseMember[]).map((m) =>
        mergeRosterEnrichment({
          ...m,
          campus: m.campus ?? null,
          skills: m.skills ?? []
        })
      )
    )
  } catch {
    return dedupeMembersByHandle(fallbackRoster().filter((m) => !m.opt_out))
  }
}

function privatePlaceholder (handle: string): ShowcaseMember {
  return {
    github_handle: handle,
    display_name: 'Private profile',
    headline: null,
    bio: null,
    avatar_url: null,
    banner_url: null,
    campus: null,
    skills: [],
    opt_out: true,
    links: { github: `https://github.com/${handle}` },
    claimed_by: null
  }
}

export async function getMember (handle: string): Promise<ShowcaseMember | null> {
  const needle = handle.toLowerCase()
  const rosterHit = fallbackRoster().find((m) => m.github_handle.toLowerCase() === needle)

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('showcase_members')
        .select(MEMBER_SELECT)
        .ilike('github_handle', handle)
        .maybeSingle()

      if (data) {
        if (data.opt_out) return privatePlaceholder(data.github_handle)
        return mergeRosterEnrichment({
          ...(data as ShowcaseMember),
          campus: (data as ShowcaseMember).campus ?? null,
          skills: (data as ShowcaseMember).skills ?? []
        })
      }

      const { count } = await supabase
        .from('showcase_members')
        .select('*', { count: 'exact', head: true })
      if ((count ?? 0) > 0 && rosterHit) {
        if (rosterHit.opt_out) return privatePlaceholder(rosterHit.github_handle)
        return privatePlaceholder(rosterHit.github_handle)
      }
    } catch {
      // fall through
    }
  }

  if (rosterHit?.opt_out) return privatePlaceholder(rosterHit.github_handle)
  return rosterHit ?? null
}
