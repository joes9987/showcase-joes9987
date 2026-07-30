/**
 * Documented refresh path for data/forth-status.json.
 * MVP: edit the JSON manually and bump updatedAt, or extend this script
 * once Forth exposes a public status endpoint.
 */
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'forth-status.json')
const status = JSON.parse(readFileSync(file, 'utf8'))
status.updatedAt = new Date().toISOString()
writeFileSync(file, `${JSON.stringify(status, null, 2)}\n`)
console.log(`Bumped forth-status updatedAt → ${status.updatedAt}`)
console.log('Edit projects/summary in data/forth-status.json from live Forth before committing.')
