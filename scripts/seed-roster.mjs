/**
 * Seed showcase_members from data/roster.json (service role bypasses RLS).
 * Preserves claimed bio/avatar when claimed_by is set.
 * Normalizes handles to lowercase and deletes case-variant duplicate rows.
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
  .select('github_handle, claimed_by, bio, avatar_url, banner_url, display_name, headline, campus, skills, links')

const byHandle = new Map((existing ?? []).map((r) => [r.github_handle.toLowerCase(), r]))

const JOE_SHOWCASE_REPO = 'https://github.com/joes9987/showcase-joes9987'
const JOE_SHOWCASE_DEPLOY = 'https://showcase-joes9987.vercel.app'

function stripStampedJoeShowcase (handle, links) {
  if (!links || typeof links !== 'object') return links ?? {}
  const out = { ...links }
  if (String(handle).toLowerCase() === 'joes9987') return out
  if (out.showcaseRepo === JOE_SHOWCASE_REPO) out.showcaseRepo = null
  if (out.showcaseDeploy === JOE_SHOWCASE_DEPLOY) out.showcaseDeploy = null
  return out
}

const canonicalHandles = new Set(
  roster.map((row) => String(row.github_handle).toLowerCase())
)

const caseVariants = (existing ?? []).filter((row) => {
  const lower = row.github_handle.toLowerCase()
  return canonicalHandles.has(lower) && row.github_handle !== lower
})

if (caseVariants.length) {
  const toDelete = caseVariants.map((r) => r.github_handle)
  const { error: delError } = await supabase
    .from('showcase_members')
    .delete()
    .in('github_handle', toDelete)
  if (delError) {
    console.error('Failed to delete case-variant rows:', delError)
    process.exit(1)
  }
  console.log(`Deleted case-variant handles: ${toDelete.join(', ')}`)
  for (const row of caseVariants) {
    const key = row.github_handle.toLowerCase()
    const kept = byHandle.get(key)
    if (!kept || kept.github_handle !== row.github_handle) {
      // Prefer claimed variant when merging into the map for seed overlay
      if (!kept || (row.claimed_by && !kept.claimed_by)) {
        byHandle.set(key, { ...row, github_handle: key })
      } else if (kept && row.claimed_by) {
        byHandle.set(key, {
          ...kept,
          claimed_by: kept.claimed_by ?? row.claimed_by,
          links: { ...(row.links ?? {}), ...(kept.links ?? {}) },
          display_name: kept.display_name || row.display_name,
          headline: kept.headline || row.headline,
          bio: kept.bio || row.bio
        })
      }
    }
  }
}

const rows = roster.map((row) => {
  const handle = String(row.github_handle).toLowerCase()
  const prev = byHandle.get(handle)
  const claimed = Boolean(prev?.claimed_by)
  const rosterLinks = {
    ...(row.links ?? { github: `https://github.com/${handle}` }),
    github: `https://github.com/${handle}`
  }
  const prevLinks = claimed && prev?.links
    ? stripStampedJoeShowcase(handle, prev.links)
    : {}
  return {
    github_handle: handle,
    display_name: (claimed && prev.display_name) ? prev.display_name : row.display_name,
    headline: (claimed && prev.headline) ? prev.headline : (row.headline ?? null),
    bio: (claimed && prev.bio) ? prev.bio : (row.bio ?? null),
    avatar_url: (claimed && prev.avatar_url) ? prev.avatar_url : (row.avatar_url ?? null),
    banner_url: (claimed && prev.banner_url) ? prev.banner_url : null,
    campus: (claimed && prev.campus) ? prev.campus : (row.campus ?? null),
    skills: (claimed && prev.skills?.length) ? prev.skills : (row.skills ?? []),
    opt_out: row.opt_out === true,
    links: {
      ...rosterLinks,
      ...prevLinks
    },
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
