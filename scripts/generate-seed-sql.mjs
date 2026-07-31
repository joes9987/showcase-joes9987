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

function lit (value) {
  return value ? `'${esc(value)}'` : 'null'
}

function skillsLit (skills) {
  if (!skills?.length) return "'{}'::text[]"
  return `array[${skills.map((s) => `'${esc(s)}'`).join(', ')}]::text[]`
}

const values = roster.map((row) => {
  const links = esc(
    JSON.stringify(row.links ?? { github: `https://github.com/${row.github_handle}` })
  )
  return `  ('${esc(row.github_handle)}', '${esc(row.display_name)}', ${lit(row.headline)}, ${lit(row.bio)}, ${lit(row.campus)}, ${skillsLit(row.skills)}, '${links}'::jsonb, ${row.opt_out === true})`
})

console.log('-- Seed showcase_members from roster.json (claimed rows keep their own copy)')
console.log(`insert into public.showcase_members
  (github_handle, display_name, headline, bio, campus, skills, links, opt_out)
values
${values.join(',\n')}
on conflict (github_handle) do update set
  display_name = case when showcase_members.claimed_by is null then excluded.display_name else showcase_members.display_name end,
  headline = case when showcase_members.claimed_by is null then excluded.headline else coalesce(showcase_members.headline, excluded.headline) end,
  bio = case when showcase_members.claimed_by is null then excluded.bio else coalesce(showcase_members.bio, excluded.bio) end,
  campus = case when showcase_members.claimed_by is null then excluded.campus else coalesce(showcase_members.campus, excluded.campus) end,
  skills = case when showcase_members.claimed_by is null or cardinality(showcase_members.skills) = 0 then excluded.skills else showcase_members.skills end,
  links = case when showcase_members.claimed_by is null then excluded.links else excluded.links || coalesce(showcase_members.links, '{}'::jsonb) end,
  opt_out = case when showcase_members.claimed_by is null then excluded.opt_out else showcase_members.opt_out end,
  updated_at = now();`)
