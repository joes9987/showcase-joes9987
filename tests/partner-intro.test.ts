import { describe, expect, it } from 'vitest'
import { parsePartnerIntro } from '@/lib/partner-intro'
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
