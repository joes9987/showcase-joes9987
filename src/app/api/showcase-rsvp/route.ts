import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendPlacementEmail } from '@/lib/notify'

function adminClient () {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

export async function POST (request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    name?: string
    email?: string
    company?: string
  }

  const name = body.name?.trim() ?? ''
  const email = body.email?.trim() ?? ''
  const company = body.company?.trim() || null

  if (!name || !email) {
    return NextResponse.json({ error: 'name and email are required' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const supabase = adminClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
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
