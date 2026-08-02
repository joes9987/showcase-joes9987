export const PARTNER_LIMITS = {
  name: 120,
  company: 120,
  email: 254,
  message: 2000,
  maxHandles: 10,
  handleLen: 39,
  perEmailPerHour: 5,
  globalPerHour: 60
} as const

export function wouldRateLimit (counts: {
  emailCount: number
  globalCount: number
}): { limited: true; reason: string } | { limited: false } {
  if (counts.emailCount >= PARTNER_LIMITS.perEmailPerHour) {
    return {
      limited: true,
      reason: `Too many submissions from this email (max ${PARTNER_LIMITS.perEmailPerHour}/hour). Try again later.`
    }
  }
  if (counts.globalCount >= PARTNER_LIMITS.globalPerHour) {
    return {
      limited: true,
      reason: `Too many submissions right now (max ${PARTNER_LIMITS.globalPerHour}/hour). Try again later.`
    }
  }
  return { limited: false }
}

type CountResult = { count: number | null; error: { message: string } | null }

/** Minimal shape used by checkPartnerRateLimit (admin supabase client). */
export type RateLimitClient = {
  from: (table: string) => {
    select: (
      columns: string,
      options: { count: 'exact'; head: boolean }
    ) => {
      eq: (column: string, value: string) => {
        gte: (column: string, value: string) => PromiseLike<CountResult>
      }
      gte: (column: string, value: string) => PromiseLike<CountResult>
    }
  }
}

export async function checkPartnerRateLimit (
  supabase: RateLimitClient,
  table: 'partner_requests' | 'showcase_rsvps',
  email: string
): Promise<{ ok: true } | { ok: false; status: 429 | 500; error: string }> {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const normalized = email.trim().toLowerCase()

  const emailQuery = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq('email', normalized)
    .gte('created_at', since)

  if (emailQuery.error) {
    return { ok: false, status: 500, error: emailQuery.error.message }
  }

  const globalQuery = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .gte('created_at', since)

  if (globalQuery.error) {
    return { ok: false, status: 500, error: globalQuery.error.message }
  }

  const decision = wouldRateLimit({
    emailCount: emailQuery.count ?? 0,
    globalCount: globalQuery.count ?? 0
  })

  if (decision.limited) {
    return { ok: false, status: 429, error: decision.reason }
  }

  return { ok: true }
}
