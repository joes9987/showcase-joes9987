import { describe, expect, it } from 'vitest'
import { deployCoverage, memberHasLiveDeploy } from '@/lib/deploy-coverage'
import type { ShowcaseMember } from '@/lib/site'

function member (partial: Partial<ShowcaseMember> & { github_handle: string }): ShowcaseMember {
  return {
    display_name: partial.display_name ?? partial.github_handle,
    headline: null,
    bio: null,
    avatar_url: null,
    banner_url: null,
    campus: null,
    skills: [],
    opt_out: false,
    links: null,
    claimed_by: null,
    ...partial
  }
}

describe('deployCoverage', () => {
  it('counts only public members with a deploy chip', () => {
    const members = [
      member({ github_handle: 'a', links: { pmDeploy: 'https://a.example' } }),
      member({ github_handle: 'b', links: { chatRepo: 'https://github.com/b' } }),
      member({ github_handle: 'c', opt_out: true, links: { chatDeploy: 'https://c.example' } })
    ]
    expect(memberHasLiveDeploy(members[0])).toBe(true)
    expect(memberHasLiveDeploy(members[1])).toBe(false)
    expect(deployCoverage(members)).toEqual({ withDeploy: 1, total: 2 })
  })
})
