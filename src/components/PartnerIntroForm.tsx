'use client'

import { useState } from 'react'
import { ui } from '@/lib/ui'

export function PartnerIntroForm () {
  const [company, setCompany] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [students, setStudents] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function onSubmit (event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const student_handles = students
      .split(/[,\s]+/)
      .map((s) => s.replace(/^@/, '').trim())
      .filter(Boolean)

    const res = await fetch('/api/partner-intro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company,
        contact_name: contactName,
        email,
        student_handles,
        message
      })
    })

    const body = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) {
      setError(body.error ?? 'Could not send intro request. Try again.')
      return
    }

    setSuccess('Intro request received. The placement lead will follow up shortly.')
    setCompany('')
    setContactName('')
    setEmail('')
    setStudents('')
    setMessage('')
  }

  return (
    <form id="intro" onSubmit={(e) => void onSubmit(e)} className={`${ui.card} space-y-4 scroll-mt-24`}>
      <div>
        <p className={ui.eyebrow}>Request an intro</p>
        <h2 className="font-display mt-1 text-xl font-semibold">Meet builders you can evaluate on GitHub</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Tell us who you want to meet. Students opt in before any intro call is scheduled.
        </p>
      </div>
      <label className={ui.label}>
        Company
        <input required className={ui.field} value={company} onChange={(e) => setCompany(e.target.value)} />
      </label>
      <label className={ui.label}>
        Your name
        <input required className={ui.field} value={contactName} onChange={(e) => setContactName(e.target.value)} />
      </label>
      <label className={ui.label}>
        Work email
        <input required type="email" className={ui.field} value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className={ui.label}>
        Student GitHub handles
        <input
          className={ui.field}
          value={students}
          onChange={(e) => setStudents(e.target.value)}
          placeholder="joes9987, CodingWCal"
        />
        <span className="mt-1 block text-xs font-normal text-[var(--muted)]">Comma-separated</span>
      </label>
      <label className={ui.label}>
        Message
        <textarea
          required
          className={`${ui.field} min-h-[120px] resize-y`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Roles you are hiring for, timeline, and why these builders stood out."
        />
      </label>
      <button type="submit" disabled={loading} className={ui.btnPrimary}>
        {loading ? 'Sending…' : 'Send intro request'}
      </button>
      {success && <p className={ui.alertSuccess} role="status">{success}</p>}
      {error && <p className={ui.alertError} role="alert">{error}</p>}
    </form>
  )
}
