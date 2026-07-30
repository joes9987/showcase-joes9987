/**
 * Seed showcase_members from data/roster.json (service role bypasses RLS).
 * Preserves claimed bio/avatar when claimed_by is set.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const roster = JSON.parse(readFileSync(join(root, 'data', 'roster.json'), 'utf8'))

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key, { auth: { persistSession: false } })

const { data: existing } = await supabase
  .from('showcase_members')
  .select('github_handle, claimed_by, bio, avatar_url, banner_url, display_name, headline, campus, skills')

const byHandle = new Map((existing ?? []).map((r) => [r.github_handle.toLowerCase(), r]))

const rows = roster.map((row) => {
  const prev = byHandle.get(String(row.github_handle).toLowerCase())
  const claimed = Boolean(prev?.claimed_by)
  return {
    github_handle: row.github_handle,
    display_name: claimed && prev.display_name ? prev.display_name : row.display_name,
    headline: claimed && prev.headline ? prev.headline : (row.headline ?? null),
    bio: claimed && prev.bio ? prev.bio : (row.bio ?? null),
    avatar_url: claimed && prev.avatar_url ? prev.avatar_url : (row.avatar_url ?? null),
    banner_url: claimed && prev.banner_url ? prev.banner_url : null,
    campus: claimed && prev.campus ? prev.campus : (row.campus ?? null),
    skills: claimed && prev.skills?.length ? prev.skills : (row.skills ?? []),
    opt_out: row.opt_out === true,
    links: row.links ?? { github: `https://github.com/${row.github_handle}` },
    claimed_by: prev?.claimed_by ?? null,
    updated_at: new Date().toISOString()
  }
})

const { data, error } = await supabase
  .from('showcase_members')
  .upsert(rows, { onConflict: 'github_handle' })
  .select('github_handle')

if (error) {
  console.error(error)
  process.exit(1)
}

console.log(`Upserted ${data?.length ?? rows.length} showcase_members`)
