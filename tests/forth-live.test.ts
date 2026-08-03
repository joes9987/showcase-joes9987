import { afterEach, describe, expect, it, vi } from 'vitest'
import { isNarrativeFresh, probeForth } from '@/lib/forth-live'

describe('isNarrativeFresh', () => {
  it('returns true for a timestamp within 7 days', () => {
    const recent = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    expect(isNarrativeFresh(recent)).toBe(true)
  })

  it('returns false for a timestamp older than 7 days', () => {
    const old = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    expect(isNarrativeFresh(old)).toBe(false)
  })

  it('returns false for invalid dates', () => {
    expect(isNarrativeFresh('not-a-date')).toBe(false)
  })
})

describe('probeForth', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns ok when Forth responds 200', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response('<html><title>Forth — Project work with a pulse</title></html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        })
      )
    )
    const probe = await probeForth('https://forth-bice.vercel.app')
    expect(probe.ok).toBe(true)
    expect(probe.status).toBe(200)
    expect(probe.title).toContain('Forth')
    expect(Number.isNaN(Date.parse(probe.checkedAt))).toBe(false)
  })

  it('returns not ok on non-200 without throwing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('nope', { status: 503 }))
    )
    const probe = await probeForth('https://forth-bice.vercel.app')
    expect(probe.ok).toBe(false)
    expect(probe.status).toBe(503)
  })

  it('returns not ok on network failure without throwing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down')
      })
    )
    const probe = await probeForth('https://forth-bice.vercel.app')
    expect(probe.ok).toBe(false)
    expect(probe.status).toBeNull()
  })
})
