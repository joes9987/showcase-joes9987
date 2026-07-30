import type { Metadata } from 'next'
import { AuthForm } from '@/components/AuthForm'
import { ui } from '@/lib/ui'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to claim your EudaMarket showcase profile.'
}

export default function LoginPage () {
  return (
    <div className={ui.pageMainNarrow}>
      <p className={ui.eyebrow}>Account</p>
      <h1 className={`${ui.pageTitle} mb-6`}>Sign in</h1>
      <AuthForm mode="login" />
    </div>
  )
}
