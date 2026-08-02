import type { Metadata } from 'next'
import Link from 'next/link'
import { ForgotPasswordForm } from '@/components/ForgotPasswordForm'
import { ui } from '@/lib/ui'

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Reset your EudaMarket password (same account as EudaPM / EudaChat).'
}

export default function ForgotPasswordPage () {
  return (
    <div className={ui.pageMainNarrow}>
      <p className={ui.eyebrow}>Account</p>
      <h1 className={`${ui.pageTitle} mb-2`}>Reset password</h1>
      <p className={`${ui.pageSubtitle} mb-6`}>
        We email a reset link for the same account used on EudaPM / EudaChat.
      </p>
      <ForgotPasswordForm />
      <p className="mt-4 text-sm text-[var(--muted)]">
        <Link href="/login" className={ui.linkAccent}>
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
