import { describe, expect, it } from 'vitest'
import { handleFromEmail, isValidGithubHandle } from '@/lib/claim-handle'

describe('handleFromEmail', () => {
  it('uses the email local-part', () => {
    expect(handleFromEmail('joes9987@example.com')).toBe('joes9987')
  })

  it('strips invalid characters and lowercases', () => {
    expect(handleFromEmail('MitchellDante99.create@mail.com')).toBe('mitchelldante99create')
  })

  it('keeps hyphens', () => {
    expect(handleFromEmail('Celicia-Kitty@example.com')).toBe('celicia-kitty')
  })

  it('truncates to 39 characters', () => {
    const local = 'a'.repeat(50)
    expect(handleFromEmail(`${local}@x.com`).length).toBe(39)
  })

  it('returns empty for missing local-part', () => {
    expect(handleFromEmail('@example.com')).toBe('')
  })
})

describe('isValidGithubHandle', () => {
  it('accepts alphanumeric and hyphens', () => {
    expect(isValidGithubHandle('joes9987')).toBe(true)
    expect(isValidGithubHandle('CodingWCal')).toBe(true)
    expect(isValidGithubHandle('ryanroper79-alt')).toBe(true)
  })

  it('rejects empty, too long, or invalid characters', () => {
    expect(isValidGithubHandle('')).toBe(false)
    expect(isValidGithubHandle('a'.repeat(40))).toBe(false)
    expect(isValidGithubHandle('bad_handle')).toBe(false)
    expect(isValidGithubHandle('has.dot')).toBe(false)
  })
})
