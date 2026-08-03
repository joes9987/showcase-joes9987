import { NextResponse } from 'next/server'
import { sendPlacementEmail } from '@/lib/notify'
import { checkPartnerRateLimit, type RateLimitClient } from '@/lib/partner-guard'
import { parseShowcaseRsvp } from '@/lib/partner-intro'
import { createServiceClient } from '@/lib/supabase/admin'

export async function POST (request: Request) {
  const body = await request.json().catch(() => ({}))
  const parsed = parseShowcaseRsvp(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const { name, email, company } = parsed.data

  const supabase = createServiceClient()
  if (!supabase) {
    return NextResponse.json(
      { error: 'Partner writes require SUPABASE_SERVICE_ROLE_KEY' },
      { status: 503 }
    )
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
