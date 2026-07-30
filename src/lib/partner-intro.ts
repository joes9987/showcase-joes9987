export type PartnerIntroInput = {
  company?: string
  contact_name?: string
  email?: string
  student_handles?: string[]
  message?: string
}

export type PartnerIntroParsed = {
  company: string
  contact_name: string
  email: string
  student_handles: string[]
  message: string
}

export function parsePartnerIntro (body: PartnerIntroInput):
  | { ok: true; data: PartnerIntroParsed }
  | { ok: false; error: string } {
  const company = body.company?.trim() ?? ''
  const contact_name = body.contact_name?.trim() ?? ''
  const email = body.email?.trim() ?? ''
  const message = body.message?.trim() ?? ''
  const student_handles = (body.student_handles ?? [])
    .map((h) => String(h).replace(/^@/, '').trim())
    .filter(Boolean)

  if (!company || !contact_name || !email || !message) {
    return { ok: false, error: 'company, contact_name, email, and message are required' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Invalid email' }
  }

  return { ok: true, data: { company, contact_name, email, student_handles, message } }
}
