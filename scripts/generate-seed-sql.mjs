/** Emit SQL upserts from data/roster.json for SQL editor / supabase db execute */
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const roster = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'roster.json'), 'utf8')
)

function esc (s) {
  return String(s).replace(/'/g, "''")
}

console.log('-- Seed showcase_members from roster.json')
console.log('begin;')
for (const row of roster) {
  const links = esc(JSON.stringify(row.links ?? { github: `https://github.com/${row.github_handle}` }))
  console.log(`insert into public.showcase_members (github_handle, display_name, headline, bio, links, opt_out)
values ('${esc(row.github_handle)}', '${esc(row.display_name)}', ${row.headline ? `'${esc(row.headline)}'` : 'null'}, ${row.bio ? `'${esc(row.bio)}'` : 'null'}, '${links}'::jsonb, false)
on conflict (github_handle) do update set
  display_name = excluded.display_name,
  headline = coalesce(showcase_members.headline, excluded.headline),
  links = showcase_members.links || excluded.links,
  updated_at = now();`)
}
console.log('commit;')
