import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { SITE } from '@/lib/site'

type Body = {
  company?: string
  contact_name?: string
  email?: string
  student_handles?: string[]
  message?: string
}

function adminClient () {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

async function maybeEmail (payload: {
  company: string
  contact_name: string
  email: string
  student_handles: string[]
  message: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.PLACEMENT_LEAD_EMAIL ?? SITE.placementEmail
  if (!apiKey || !to) return { emailed: false as const }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? 'EudaMarket <onboarding@resend.dev>',
      to: [to],
      subject: `Partner intro: ${payload.company}`,
      text: [
        `Company: ${payload.company}`,
        `Contact: ${payload.contact_name} <${payload.email}>`,
        `Students: ${payload.student_handles.join(', ') || '(none)'}`,
        '',
        payload.message
      ].join('\n')
    })
  })

  return { emailed: res.ok as boolean }
}

export async function POST (request: Request) {
  const body = (await request.json().catch(() => ({}))) as Body
  const company = body.company?.trim() ?? ''
  const contact_name = body.contact_name?.trim() ?? ''
  const email = body.email?.trim() ?? ''
  const message = body.message?.trim() ?? ''
  const student_handles = (body.student_handles ?? [])
    .map((h) => String(h).replace(/^@/, '').trim())
    .filter(Boolean)

  if (!company || !contact_name || !email || !message) {
    return NextResponse.json({ error: 'company, contact_name, email, and message are required' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

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

  const mail = await maybeEmail({ company, contact_name, email, student_handles, message }).catch(() => ({
    emailed: false as const
  }))

  return NextResponse.json({ ok: true, emailed: mail.emailed })
}
