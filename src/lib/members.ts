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

/** Prefer richer portfolio cards on public grids when DB rows are thin. */
export function mergeRosterEnrichment (member: ShowcaseMember): ShowcaseMember {
  const seed = fallbackRoster().find(
    (r) => r.github_handle.toLowerCase() === member.github_handle.toLowerCase()
  )
  if (!seed) return member

  const links = { ...(seed.links ?? {}), ...(member.links ?? {}) }
  return {
    ...member,
    headline: member.headline ?? seed.headline,
    bio: member.bio ?? seed.bio,
    campus: member.campus ?? seed.campus,
    skills: (member.skills?.length ? member.skills : seed.skills) ?? [],
    links
  }
}

export async function listPublicMembers (): Promise<ShowcaseMember[]> {
  if (!isSupabaseConfigured()) {
    return fallbackRoster().filter((m) => !m.opt_out)
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('showcase_members')
      .select(MEMBER_SELECT)
      .eq('opt_out', false)
      .order('display_name')

    if (error || !data?.length) {
      return fallbackRoster().filter((m) => !m.opt_out)
    }
    return (data as ShowcaseMember[]).map((m) =>
      mergeRosterEnrichment({
        ...m,
        campus: m.campus ?? null,
        skills: m.skills ?? []
      })
    )
  } catch {
    return fallbackRoster().filter((m) => !m.opt_out)
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
