export type GithubActivityItem = {
  id: string
  type: string
  label: string
  repo: string
  repoUrl: string
  at: string
}

type GithubEvent = {
  id: string
  type: string
  created_at: string
  repo?: { name?: string; url?: string }
  payload?: {
    ref?: string
    action?: string
    pull_request?: { number?: number; title?: string; html_url?: string }
    issue?: { number?: number; title?: string; html_url?: string }
    commits?: unknown[]
  }
}

const INTERESTING = new Set([
  'PushEvent',
  'PullRequestEvent',
  'IssuesEvent',
  'CreateEvent',
  'ReleaseEvent'
])

export function mapGithubEvent (event: GithubEvent): GithubActivityItem | null {
  if (!INTERESTING.has(event.type)) return null
  const repoFull = event.repo?.name ?? 'unknown/repo'
  const repoUrl = `https://github.com/${repoFull}`

  let label = event.type.replace(/Event$/, '')
  if (event.type === 'PushEvent') {
    const n = event.payload?.commits?.length ?? 0
    const ref = event.payload?.ref?.replace(/^refs\/heads\//, '') ?? 'branch'
    label = n > 0 ? `Pushed ${n} commit${n === 1 ? '' : 's'} to ${ref}` : `Pushed to ${ref}`
  } else if (event.type === 'PullRequestEvent') {
    const action = event.payload?.action ?? 'updated'
    const num = event.payload?.pull_request?.number
    const title = event.payload?.pull_request?.title
    label = num ? `PR #${num} ${action}${title ? `: ${title}` : ''}` : `Pull request ${action}`
  } else if (event.type === 'IssuesEvent') {
    const action = event.payload?.action ?? 'updated'
    const num = event.payload?.issue?.number
    const title = event.payload?.issue?.title
    label = num ? `Issue #${num} ${action}${title ? `: ${title}` : ''}` : `Issue ${action}`
  } else if (event.type === 'CreateEvent') {
    label = `Created ${event.payload?.ref ?? 'ref'}`
  } else if (event.type === 'ReleaseEvent') {
    label = `Release ${event.payload?.action ?? 'published'}`
  }

  return {
    id: event.id,
    type: event.type,
    label: label.slice(0, 160),
    repo: repoFull,
    repoUrl,
    at: event.created_at
  }
}

export function mapGithubEvents (events: GithubEvent[], limit = 5): GithubActivityItem[] {
  const out: GithubActivityItem[] = []
  for (const event of events) {
    const item = mapGithubEvent(event)
    if (!item) continue
    out.push(item)
    if (out.length >= limit) break
  }
  return out
}

/** Public GitHub events; never throws — returns [] on failure / rate limit. */
export async function fetchGithubActivity (
  handle: string,
  limit = 5
): Promise<GithubActivityItem[]> {
  const cleaned = handle.replace(/[^A-Za-z0-9-]/g, '').slice(0, 39)
  if (!cleaned) return []

  try {
    const res = await fetch(`https://api.github.com/users/${cleaned}/events/public?per_page=30`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'eudamarket-showcase'
      },
      next: { revalidate: 600 }
    })
    if (!res.ok) return []
    const events = (await res.json()) as GithubEvent[]
    if (!Array.isArray(events)) return []
    return mapGithubEvents(events, limit)
  } catch {
    return []
  }
}
