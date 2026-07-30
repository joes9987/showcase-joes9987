import { readFileSync } from 'fs'
import { join } from 'path'
import { describe, expect, it } from 'vitest'
import type { ForthStatus } from '@/lib/forth-status'

describe('forth-status.json', () => {
  const raw = readFileSync(join(process.cwd(), 'data', 'forth-status.json'), 'utf8')
  const status = JSON.parse(raw) as ForthStatus

  it('has a real Forth source URL', () => {
    expect(status.source).toContain('forth')
    expect(status.source.startsWith('https://')).toBe(true)
  })

  it('has projects with owners and non-lorem notes', () => {
    expect(status.projects.length).toBeGreaterThan(0)
    for (const project of status.projects) {
      expect(project.title.length).toBeGreaterThan(3)
      expect(project.owner.length).toBeGreaterThan(1)
      expect(project.note.toLowerCase()).not.toContain('lorem')
      expect(project.note.toLowerCase()).not.toContain('ipsum')
    }
  })

  it('has a parseable updatedAt', () => {
    expect(Number.isNaN(Date.parse(status.updatedAt))).toBe(false)
  })
})
