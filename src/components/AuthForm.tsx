'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ui } from '@/lib/ui'

type Mode = 'login' | 'signup'

export function AuthForm ({ mode }: { mode: Mode }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit (event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()

    if (mode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      setLoading(false)
      if (signUpError) {
        setError(signUpError.message)
        return
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (signInError) {
        setError(signInError.message)
        return
      }
    }

    router.push('/app/profile')
    router.refresh()
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className={`${ui.card} space-y-4`}>
      <label className={ui.label}>
        Email
        <input
          required
          type="email"
          className={ui.field}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>
      <label className={ui.label}>
        Password
        <input
          required
          type="password"
          minLength={6}
          className={ui.field}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
      </label>
      <button type="submit" disabled={loading} className={ui.btnPrimary}>
        {loading ? 'Working…' : mode === 'login' ? 'Sign in' : 'Create account'}
      </button>
      {error && <p className={ui.alertError}>{error}</p>}
      <p className="text-sm text-[var(--muted)]">
        Same account as EudaPM / EudaChat.{' '}
        {mode === 'login' ? (
          <Link href="/signup" className={ui.linkAccent}>Sign up</Link>
        ) : (
          <Link href="/login" className={ui.linkAccent}>Sign in</Link>
        )}
      </p>
    </form>
  )
}
