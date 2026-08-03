import { NextResponse } from 'next/server'
import { sendPlacementEmail } from '@/lib/notify'
import { checkPartnerRateLimit, type RateLimitClient } from '@/lib/partner-guard'
import { parsePartnerIntro } from '@/lib/partner-intro'
import { createServiceClient } from '@/lib/supabase/admin'

export async function POST (request: Request) {
  const body = await request.json().catch(() => ({}))
  const parsed = parsePartnerIntro(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const { company, contact_name, email, student_handles, message } = parsed.data

  const supabase = createServiceClient()
  if (!supabase) {
    return NextResponse.json(
      { error: 'Partner writes require SUPABASE_SERVICE_ROLE_KEY' },
      { status: 503 }
    )
  }

  const rate = await checkPartnerRateLimit(supabase as unknown as RateLimitClient, 'partner_requests', email)
  if (!rate.ok) {
    return NextResponse.json({ error: rate.error }, { status: rate.status })
  }

  const { error } = await supabase.from('partner_requests').insert({
    company,
    contact_name,
    email,
    student_handles,
    message
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const mail = await sendPlacementEmail({
    subject: `Partner intro: ${company}`,
    text: [
      `Company: ${company}`,
      `Contact: ${contact_name} <${email}>`,
      `Students: ${student_handles.join(', ') || '(none)'}`,
      '',
      message
    ].join('\n')
  }).catch(() => ({ emailed: false as const, reason: 'send failed' }))

  return NextResponse.json({ ok: true, emailed: mail.emailed, emailReason: mail.reason ?? null })
}
