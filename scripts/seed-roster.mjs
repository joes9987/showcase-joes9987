/**
 * Seed showcase_members from data/roster.json (service role bypasses RLS).
 *
 * Usage (from repo root, with .env.local):
 *   node --env-file=.env.local scripts/seed-roster.mjs
 *
 * Or apply via pm-joes9987 linked Supabase SQL after generating rows.
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

const rows = roster.map((row) => ({
  github_handle: row.github_handle,
  display_name: row.display_name,
  headline: row.headline ?? null,
  bio: row.bio ?? null,
  avatar_url: row.avatar_url ?? null,
  banner_url: null,
  opt_out: false,
  links: row.links ?? { github: `https://github.com/${row.github_handle}` },
  updated_at: new Date().toISOString()
}))

const { data, error } = await supabase
  .from('showcase_members')
  .upsert(rows, { onConflict: 'github_handle', ignoreDuplicates: false })
  .select('github_handle')

if (error) {
  console.error(error)
  process.exit(1)
}

console.log(`Upserted ${data?.length ?? rows.length} showcase_members`)
