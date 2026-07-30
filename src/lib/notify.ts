import { SITE } from '@/lib/site'

export async function sendPlacementEmail (opts: {
  subject: string
  text: string
}): Promise<{ emailed: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.PLACEMENT_LEAD_EMAIL ?? SITE.placementEmail
  if (!apiKey) return { emailed: false, reason: 'RESEND_API_KEY unset' }
  if (!to) return { emailed: false, reason: 'PLACEMENT_LEAD_EMAIL unset' }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? 'EudaMarket <onboarding@resend.dev>',
      to: [to],
      subject: opts.subject,
      text: opts.text
    })
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    return { emailed: false, reason: detail.slice(0, 200) || `HTTP ${res.status}` }
  }

  return { emailed: true }
}
