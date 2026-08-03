/**
 * Refresh path for data/forth-status.json.
 * Checks that the Forth source URL is reachable, then bumps updatedAt.
 * Does not invent project rows — edit projects/summary manually from Forth.
 */
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'forth-status.json')
const status = JSON.parse(readFileSync(file, 'utf8'))
const source = status.source || 'https://forth-bice.vercel.app'

let reachable = false
try {
  const res = await fetch(source, {
    method: 'GET',
    redirect: 'follow',
    headers: { 'User-Agent': 'eudamarket-sync-forth' },
    signal: AbortSignal.timeout(15000)
  })
  reachable = res.ok
  console.log(`Forth source ${source} → HTTP ${res.status}`)
} catch (err) {
  console.error(`Forth source unreachable: ${err?.message || err}`)
}

if (!reachable) {
  console.error('Refusing to bump updatedAt while Forth is unreachable.')
  process.exit(1)
}

status.updatedAt = new Date().toISOString()
const stamp = new Date(status.updatedAt).toISOString().slice(0, 10)
if (typeof status.summary === 'string') {
  const base = status.summary
    .replace(/\s*Source last verified reachable[^.]*\./i, '')
    .trim()
  status.summary = `${base} Source last verified reachable ${stamp}.`
}

writeFileSync(file, `${JSON.stringify(status, null, 2)}\n`)
console.log(`Bumped forth-status updatedAt → ${status.updatedAt}`)
console.log('Edit projects/summary details from live Forth before committing if status changed.')
