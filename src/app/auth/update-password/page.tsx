import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { UpdatePasswordForm } from '@/components/UpdatePasswordForm'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { ui } from '@/lib/ui'

export const metadata: Metadata = {
  title: 'Set new password',
  description: 'Choose a new password for your EudaMarket account.'
}

export default async function UpdatePasswordPage () {
  if (!isSupabaseConfigured()) {
    return (
      <div className={ui.pageMainNarrow}>
        <div className={ui.card}>
          <h1 className={ui.pageTitle}>Auth not configured</h1>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/forgot-password')

  return (
    <div className={ui.pageMainNarrow}>
      <p className={ui.eyebrow}>Account</p>
      <h1 className={`${ui.pageTitle} mb-2`}>Set a new password</h1>
      <p className={`${ui.pageSubtitle} mb-6`}>
        Signed in as {user.email}. This updates the shared suite password.
      </p>
      <UpdatePasswordForm />
    </div>
  )
}
