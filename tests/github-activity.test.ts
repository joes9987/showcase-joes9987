import { describe, expect, it } from 'vitest'
import { mapGithubEvent, mapGithubEvents } from '@/lib/github-activity'

describe('mapGithubEvent', () => {
  it('maps push events', () => {
    const item = mapGithubEvent({
      id: '1',
      type: 'PushEvent',
      created_at: '2026-08-02T12:00:00Z',
      repo: { name: 'joes9987/showcase-joes9987' },
      payload: { ref: 'refs/heads/main', commits: [{}, {}] }
    })
    expect(item?.label).toBe('Pushed 2 commits to main')
    expect(item?.repoUrl).toBe('https://github.com/joes9987/showcase-joes9987')
  })

  it('maps pull request events', () => {
    const item = mapGithubEvent({
      id: '2',
      type: 'PullRequestEvent',
      created_at: '2026-08-02T12:00:00Z',
      repo: { name: 'org/repo' },
      payload: {
        action: 'opened',
        pull_request: { number: 12, title: 'Add demo' }
      }
    })
    expect(item?.label).toContain('PR #12 opened')
    expect(item?.label).toContain('Add demo')
  })

  it('ignores WatchEvent', () => {
    expect(
      mapGithubEvent({
        id: '3',
        type: 'WatchEvent',
        created_at: '2026-08-02T12:00:00Z',
        repo: { name: 'a/b' }
      })
    ).toBeNull()
  })
})

describe('mapGithubEvents', () => {
  it('respects the limit and skips noise', () => {
    const events = [
      { id: 'a', type: 'WatchEvent', created_at: '2026-08-01T00:00:00Z', repo: { name: 'a/b' } },
      {
        id: 'b',
        type: 'PushEvent',
        created_at: '2026-08-01T01:00:00Z',
        repo: { name: 'a/b' },
        payload: { ref: 'refs/heads/main', commits: [{}] }
      },
      {
        id: 'c',
        type: 'IssuesEvent',
        created_at: '2026-08-01T02:00:00Z',
        repo: { name: 'a/b' },
        payload: { action: 'opened', issue: { number: 1, title: 'Bug' } }
      },
      {
        id: 'd',
        type: 'PushEvent',
        created_at: '2026-08-01T03:00:00Z',
        repo: { name: 'a/b' },
        payload: { ref: 'refs/heads/main', commits: [{}] }
      }
    ]
    const mapped = mapGithubEvents(events, 2)
    expect(mapped).toHaveLength(2)
    expect(mapped[0].id).toBe('b')
    expect(mapped[1].id).toBe('c')
  })
})
