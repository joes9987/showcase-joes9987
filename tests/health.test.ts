import { afterEach, describe, expect, it } from 'vitest'
import { buildHealthPayload } from '@/lib/health'
import type { ForthStatus } from '@/lib/forth-status'

const forth: ForthStatus = {
  source: 'https://forth-bice.vercel.app',
  sourceLabel: 'Forth',
  updatedAt: new Date().toISOString(),
  summary: 'test',
  projects: []
}

describe('buildHealthPayload', () => {
  const prev = { ...process.env }

  afterEach(() => {
    process.env = { ...prev }
  })

  it('reports partnerWritesConfigured from service role only', () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'
    const payload = buildHealthPayload({
      forth,
      live: { ok: true, status: 200, checkedAt: forth.updatedAt }
    })
    expect(payload.app).toBe('eudamarket')
    expect(payload.ok).toBe(true)
    expect(payload.partnerWritesConfigured).toBe(false)
    expect(payload.forth.reachable).toBe(true)
    expect(payload.forth.narrativeFresh).toBe(true)
  })

  it('marks partnerWritesConfigured when service role is set', () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test'
    const payload = buildHealthPayload({
      forth,
      live: { ok: false, status: 503, checkedAt: forth.updatedAt }
    })
    expect(payload.partnerWritesConfigured).toBe(true)
    expect(payload.forth.reachable).toBe(false)
    expect(payload.forth.httpStatus).toBe(503)
  })
})
