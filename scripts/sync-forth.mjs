/**
 * Refresh Forth live probe fields in data/forth-status.json.
 * Verifies Forth is reachable, persists live.{lastCheckedAt,reachable,httpStatus},
 * and bumps updatedAt when reachable.
 * Does not invent project rows — edit projects/summary manually from program notes.
 */
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'forth-status.json')
const status = JSON.parse(readFileSync(file, 'utf8'))
const source = status.source || 'https://forth-bice.vercel.app'

const checkedAt = new Date().toISOString()
let reachable = false
let httpStatus = null
let title = null

try {
  const res = await fetch(source, {
    method: 'GET',
    redirect: 'follow',
    headers: { 'User-Agent': 'eudamarket-sync-forth' },
    signal: AbortSignal.timeout(15000)
  })
  httpStatus = res.status
  reachable = res.ok
  if (res.ok) {
    const html = await res.text().catch(() => '')
    const match = /<title[^>]*>([^<]*)<\/title>/i.exec(html)
    if (match?.[1]) title = match[1].trim().slice(0, 120)
  }
  console.log(`Forth source ${source} → HTTP ${res.status}${title ? ` (${title})` : ''}`)
} catch (err) {
  console.error(`Forth source unreachable: ${err?.message || err}`)
}

status.live = {
  lastCheckedAt: checkedAt,
  reachable,
  httpStatus
}

if (!reachable) {
  writeFileSync(file, `${JSON.stringify(status, null, 2)}\n`)
  console.error('Refusing to bump narrative updatedAt while Forth is unreachable.')
  console.log(`Wrote live probe (reachable=false) → ${checkedAt}`)
  process.exit(1)
}

status.updatedAt = checkedAt
const stamp = new Date(checkedAt).toISOString().slice(0, 10)
if (typeof status.summary === 'string') {
  const base = status.summary
    .replace(/\s*Source last verified reachable[^.]*\./i, '')
    .replace(/\s*Live reachability last checked[^.]*\./i, '')
    .trim()
  status.summary = `${base} Live reachability last checked ${stamp}.`
}

status.howToRefresh =
  'Live reachability: npm run sync:forth (or GitHub Actions sync-forth cron) probes Forth and writes live.* fields. Program narrative projects[]: edit manually when phases change — Forth has no public ticket API.'

writeFileSync(file, `${JSON.stringify(status, null, 2)}\n`)
console.log(`Bumped forth-status updatedAt + live probe → ${checkedAt}`)
console.log('Edit projects/summary from program notes before committing if narrative status changed.')
