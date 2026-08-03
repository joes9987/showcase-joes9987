import { describe, expect, it } from 'vitest'
import { dedupeMembersByHandle } from '@/lib/members'
import type { ShowcaseMember } from '@/lib/site'

function member (partial: Partial<ShowcaseMember> & { github_handle: string }): ShowcaseMember {
  return {
    display_name: partial.display_name ?? partial.github_handle,
    headline: partial.headline ?? null,
    bio: partial.bio ?? null,
    avatar_url: null,
    banner_url: null,
    campus: null,
    skills: partial.skills ?? [],
    opt_out: false,
    links: partial.links ?? { github: `https://github.com/${partial.github_handle}` },
    claimed_by: partial.claimed_by ?? null,
    ...partial
  }
}

describe('dedupeMembersByHandle', () => {
  it('collapses case variants into one lowercase handle', () => {
    const out = dedupeMembersByHandle([
      member({
        github_handle: 'lorra-V',
        display_name: 'Lorra',
        links: { github: 'https://github.com/lorra-V', showcaseDeploy: 'https://example.com' }
      }),
      member({
        github_handle: 'lorra-v',
        display_name: 'Lorra',
        links: { github: 'https://github.com/lorra-v', chatDeploy: 'https://conexus-rust.vercel.app' },
        claimed_by: 'user-1'
      })
    ])
    expect(out).toHaveLength(1)
    expect(out[0].github_handle).toBe('lorra-v')
    expect(out[0].claimed_by).toBe('user-1')
    expect(out[0].links?.chatDeploy).toBe('https://conexus-rust.vercel.app')
    expect(out[0].links?.showcaseDeploy).toBe('https://example.com')
  })
})
