import { PARTNER_LIMITS } from '@/lib/partner-guard'

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
  const email = body.email?.trim().toLowerCase() ?? ''
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

  if (company.length > PARTNER_LIMITS.company) {
    return { ok: false, error: `company must be ≤ ${PARTNER_LIMITS.company} characters` }
  }
  if (contact_name.length > PARTNER_LIMITS.name) {
    return { ok: false, error: `contact_name must be ≤ ${PARTNER_LIMITS.name} characters` }
  }
  if (email.length > PARTNER_LIMITS.email) {
    return { ok: false, error: `email must be ≤ ${PARTNER_LIMITS.email} characters` }
  }
  if (message.length > PARTNER_LIMITS.message) {
    return { ok: false, error: `message must be ≤ ${PARTNER_LIMITS.message} characters` }
  }
  if (student_handles.length > PARTNER_LIMITS.maxHandles) {
    return { ok: false, error: `at most ${PARTNER_LIMITS.maxHandles} student handles` }
  }
  if (student_handles.some((h) => h.length > PARTNER_LIMITS.handleLen || !/^[A-Za-z0-9-]+$/.test(h))) {
    return { ok: false, error: 'each student handle must be 1–39 letters, numbers, or hyphens' }
  }

  return { ok: true, data: { company, contact_name, email, student_handles, message } }
}

export type ShowcaseRsvpInput = {
  name?: string
  email?: string
  company?: string
}

export type ShowcaseRsvpParsed = {
  name: string
  email: string
  company: string | null
}

export function parseShowcaseRsvp (body: ShowcaseRsvpInput):
  | { ok: true; data: ShowcaseRsvpParsed }
  | { ok: false; error: string } {
  const name = body.name?.trim() ?? ''
  const email = body.email?.trim().toLowerCase() ?? ''
  const companyRaw = body.company?.trim() ?? ''
  const company = companyRaw || null

  if (!name || !email) {
    return { ok: false, error: 'name and email are required' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Invalid email' }
  }
  if (name.length > PARTNER_LIMITS.name) {
    return { ok: false, error: `name must be ≤ ${PARTNER_LIMITS.name} characters` }
  }
  if (email.length > PARTNER_LIMITS.email) {
    return { ok: false, error: `email must be ≤ ${PARTNER_LIMITS.email} characters` }
  }
  if (company && company.length > PARTNER_LIMITS.company) {
    return { ok: false, error: `company must be ≤ ${PARTNER_LIMITS.company} characters` }
  }

  return { ok: true, data: { name, email, company } }
}
