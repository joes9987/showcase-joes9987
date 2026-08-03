export type ForthLiveProbe = {
  ok: boolean
  status: number | null
  checkedAt: string
  title?: string
}

const TITLE_RE = /<title[^>]*>([^<]*)<\/title>/i

/** Probe Forth homepage reachability. Never throws. */
export async function probeForth (
  sourceUrl: string,
  timeoutMs = 8000
): Promise<ForthLiveProbe> {
  const checkedAt = new Date().toISOString()
  try {
    const res = await fetch(sourceUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'eudamarket-forth-probe' },
      signal: AbortSignal.timeout(timeoutMs),
      cache: 'no-store'
    })
    let title: string | undefined
    if (res.ok) {
      const html = await res.text().catch(() => '')
      const match = TITLE_RE.exec(html)
      if (match?.[1]) title = match[1].trim().slice(0, 120)
    }
    return {
      ok: res.ok,
      status: res.status,
      checkedAt,
      title
    }
  } catch {
    return { ok: false, status: null, checkedAt }
  }
}

/** Narrative snapshot is "fresh" if updatedAt is within maxAgeDays. */
export function isNarrativeFresh (updatedAt: string, maxAgeDays = 7): boolean {
  const ts = Date.parse(updatedAt)
  if (Number.isNaN(ts)) return false
  const ageMs = Date.now() - ts
  return ageMs >= 0 && ageMs <= maxAgeDays * 24 * 60 * 60 * 1000
}

export function formatProbeCheckedAt (checkedAt: string): string {
  const ts = Date.parse(checkedAt)
  if (Number.isNaN(ts)) return checkedAt
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}
