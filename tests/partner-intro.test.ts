import { describe, expect, it } from 'vitest'
import { PARTNER_LIMITS, wouldRateLimit } from '@/lib/partner-guard'
import { parsePartnerIntro, parseShowcaseRsvp } from '@/lib/partner-intro'
import { filterMembers } from '@/lib/members-filter'
import type { ShowcaseMember } from '@/lib/site'

describe('parsePartnerIntro', () => {
  it('accepts a valid payload', () => {
    const parsed = parsePartnerIntro({
      company: 'Acme',
      contact_name: 'Pat',
      email: 'pat@acme.com',
      student_handles: ['@joes9987', 'CodingWCal'],
      message: 'Interested in intros'
    })
    expect(parsed.ok).toBe(true)
    if (parsed.ok) {
      expect(parsed.data.student_handles).toEqual(['joes9987', 'CodingWCal'])
      expect(parsed.data.email).toBe('pat@acme.com')
    }
  })

  it('rejects missing fields', () => {
    const parsed = parsePartnerIntro({ company: 'Acme' })
    expect(parsed.ok).toBe(false)
  })

  it('rejects invalid email', () => {
    const parsed = parsePartnerIntro({
      company: 'Acme',
      contact_name: 'Pat',
      email: 'not-an-email',
      message: 'hi'
    })
    expect(parsed.ok).toBe(false)
  })

  it('rejects oversized message', () => {
    const parsed = parsePartnerIntro({
      company: 'Acme',
      contact_name: 'Pat',
      email: 'pat@acme.com',
      message: 'x'.repeat(PARTNER_LIMITS.message + 1)
    })
    expect(parsed.ok).toBe(false)
    if (!parsed.ok) expect(parsed.error).toMatch(/message/)
  })

  it('rejects too many handles', () => {
    const parsed = parsePartnerIntro({
      company: 'Acme',
      contact_name: 'Pat',
      email: 'pat@acme.com',
      message: 'hi',
      student_handles: Array.from({ length: PARTNER_LIMITS.maxHandles + 1 }, (_, i) => `user${i}`)
    })
    expect(parsed.ok).toBe(false)
  })
})

describe('parseShowcaseRsvp', () => {
  it('accepts valid RSVP', () => {
    const parsed = parseShowcaseRsvp({ name: 'Pat', email: 'Pat@Acme.com', company: 'Acme' })
    expect(parsed.ok).toBe(true)
    if (parsed.ok) expect(parsed.data.email).toBe('pat@acme.com')
  })

  it('rejects long company', () => {
    const parsed = parseShowcaseRsvp({
      name: 'Pat',
      email: 'pat@acme.com',
      company: 'c'.repeat(PARTNER_LIMITS.company + 1)
    })
    expect(parsed.ok).toBe(false)
  })
})

describe('wouldRateLimit', () => {
  it('allows under caps', () => {
    expect(wouldRateLimit({ emailCount: 0, globalCount: 0 }).limited).toBe(false)
    expect(wouldRateLimit({ emailCount: 4, globalCount: 59 }).limited).toBe(false)
  })

  it('blocks per-email flood', () => {
    const result = wouldRateLimit({ emailCount: 5, globalCount: 10 })
    expect(result.limited).toBe(true)
  })

  it('blocks global flood', () => {
    const result = wouldRateLimit({ emailCount: 1, globalCount: 60 })
    expect(result.limited).toBe(true)
  })

  it('allows one under each ceiling', () => {
    expect(
      wouldRateLimit({
        emailCount: PARTNER_LIMITS.perEmailPerHour - 1,
        globalCount: PARTNER_LIMITS.globalPerHour - 1
      }).limited
    ).toBe(false)
  })

  it('prefers the email reason when both would trip', () => {
    const result = wouldRateLimit({
      emailCount: PARTNER_LIMITS.perEmailPerHour,
      globalCount: PARTNER_LIMITS.globalPerHour
    })
    expect(result.limited).toBe(true)
    if (result.limited) {
      expect(result.reason).toMatch(/this email/i)
    }
  })
})

describe('filterMembers', () => {
  const members: ShowcaseMember[] = [
    {
      github_handle: 'joes9987',
      display_name: 'Joseph Singh',
      headline: 'Euda suite',
      bio: null,
      avatar_url: null,
      banner_url: null,
      campus: 'Boston',
      skills: ['EudaPM', 'Next.js'],
      opt_out: false,
      links: null,
      claimed_by: null
    },
    {
      github_handle: 'CodingWCal',
      display_name: 'Calvin',
      headline: 'Forth',
      bio: null,
      avatar_url: null,
      banner_url: null,
      campus: null,
      skills: ['Forth'],
      opt_out: false,
      links: null,
      claimed_by: null
    }
  ]

  it('filters by query', () => {
    expect(filterMembers(members, 'euda', '').map((m) => m.github_handle)).toEqual(['joes9987'])
  })

  it('filters by skill', () => {
    expect(filterMembers(members, '', 'Forth').map((m) => m.github_handle)).toEqual(['CodingWCal'])
  })
})
