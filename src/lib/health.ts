import { isNarrativeFresh, type ForthLiveProbe } from '@/lib/forth-live'
import type { ForthStatus } from '@/lib/forth-status'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export type HealthPayload = {
  ok: true
  app: 'eudamarket'
  supabaseConfigured: boolean
  partnerWritesConfigured: boolean
  resendConfigured: boolean
  forth: {
    reachable: boolean
    checkedAt: string
    httpStatus: number | null
    narrativeUpdatedAt: string
    narrativeFresh: boolean
  }
}

export function buildHealthPayload (opts: {
  forth: ForthStatus
  live: ForthLiveProbe
}): HealthPayload {
  return {
    ok: true,
    app: 'eudamarket',
    supabaseConfigured: isSupabaseConfigured(),
    partnerWritesConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    forth: {
      reachable: opts.live.ok,
      checkedAt: opts.live.checkedAt,
      httpStatus: opts.live.status,
      narrativeUpdatedAt: opts.forth.updatedAt,
      narrativeFresh: isNarrativeFresh(opts.forth.updatedAt)
    }
  }
}
