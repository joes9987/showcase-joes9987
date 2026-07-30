'use client'

import { useState } from 'react'
import { ui } from '@/lib/ui'

export function ShowcaseRsvpForm () {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function onSubmit (event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const res = await fetch('/api/showcase-rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, company })
    })
    const body = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) {
      setError(body.error ?? 'Could not save RSVP.')
      return
    }

    setSuccess(
      body.emailed
        ? 'RSVP saved and emailed to the placement lead.'
        : 'RSVP saved. Placement lead notified via the database queue (email pending if Resend is unset).'
    )
    setName('')
    setEmail('')
    setCompany('')
  }

  return (
    <form id="rsvp" onSubmit={(e) => void onSubmit(e)} className={`${ui.card} mt-8 space-y-4 scroll-mt-24`}>
      <div>
        <p className={ui.eyebrow}>End-of-pilot showcase</p>
        <h2 className="font-display mt-1 text-xl font-semibold">RSVP for the hiring showcase</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Partners can reserve a seat for the cohort showcase event. We confirm details by email.
        </p>
      </div>
      <label className={ui.label}>
        Name
        <input required className={ui.field} value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className={ui.label}>
        Work email
        <input required type="email" className={ui.field} value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className={ui.label}>
        Company
        <input className={ui.field} value={company} onChange={(e) => setCompany(e.target.value)} />
      </label>
      <button type="submit" disabled={loading} className={ui.btnPrimary}>
        {loading ? 'Saving…' : 'RSVP'}
      </button>
      {success && <p className={ui.alertSuccess}>{success}</p>}
      {error && <p className={ui.alertError}>{error}</p>}
    </form>
  )
}
