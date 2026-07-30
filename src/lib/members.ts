import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import type { ShowcaseMember } from '@/lib/site'
import roster from '../../data/roster.json'

export function fallbackRoster (): ShowcaseMember[] {
  return (roster as Array<{
    github_handle: string
    display_name: string
    headline?: string
    bio?: string
    links?: ShowcaseMember['links']
  }>).map((row) => ({
    github_handle: row.github_handle,
    display_name: row.display_name,
    headline: row.headline ?? null,
    bio: row.bio ?? null,
    avatar_url: null,
    banner_url: null,
    opt_out: false,
    links: row.links ?? { github: `https://github.com/${row.github_handle}` },
    claimed_by: null
  }))
}

export async function listPublicMembers (): Promise<ShowcaseMember[]> {
  if (!isSupabaseConfigured()) return fallbackRoster()

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('showcase_members')
      .select('github_handle, display_name, headline, bio, avatar_url, banner_url, opt_out, links, claimed_by, updated_at')
      .eq('opt_out', false)
      .order('display_name')

    if (error || !data?.length) return fallbackRoster()
    return data as ShowcaseMember[]
  } catch {
    return fallbackRoster()
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
        .select('github_handle, display_name, headline, bio, avatar_url, banner_url, opt_out, links, claimed_by, updated_at')
        .ilike('github_handle', handle)
        .maybeSingle()

      if (data) {
        if (data.opt_out) return privatePlaceholder(data.github_handle)
        return data as ShowcaseMember
      }

      // RLS hides opted-out rows. If the table is seeded and the handle is on the roster, show a placeholder.
      const { count } = await supabase
        .from('showcase_members')
        .select('*', { count: 'exact', head: true })
      if ((count ?? 0) > 0 && rosterHit) {
        return privatePlaceholder(rosterHit.github_handle)
      }
    } catch {
      // fall through
    }
  }

  return rosterHit ?? null
}
