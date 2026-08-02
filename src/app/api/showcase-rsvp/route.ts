import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendPlacementEmail } from '@/lib/notify'
import { checkPartnerRateLimit, type RateLimitClient } from '@/lib/partner-guard'
import { parseShowcaseRsvp } from '@/lib/partner-intro'

function adminClient () {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

export async function POST (request: Request) {
  const body = await request.json().catch(() => ({}))
  const parsed = parseShowcaseRsvp(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const { name, email, company } = parsed.data

  const supabase = adminClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const rate = await checkPartnerRateLimit(supabase as unknown as RateLimitClient, 'showcase_rsvps', email)
  if (!rate.ok) {
    return NextResponse.json({ error: rate.error }, { status: rate.status })
  }

  const { error } = await supabase.from('showcase_rsvps').insert({ name, email, company })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const mail = await sendPlacementEmail({
    subject: `Showcase RSVP: ${name}`,
    text: [`Name: ${name}`, `Email: ${email}`, `Company: ${company ?? '(none)'}`].join('\n')
  }).catch(() => ({ emailed: false as const }))

  return NextResponse.json({ ok: true, emailed: mail.emailed })
}
