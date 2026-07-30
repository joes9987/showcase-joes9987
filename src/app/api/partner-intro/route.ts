import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendPlacementEmail } from '@/lib/notify'
import { parsePartnerIntro } from '@/lib/partner-intro'

function adminClient () {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

export async function POST (request: Request) {
  const body = await request.json().catch(() => ({}))
  const parsed = parsePartnerIntro(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const { company, contact_name, email, student_handles, message } = parsed.data

  const supabase = adminClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
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
