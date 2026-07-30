import type { Metadata } from 'next'
import { AuthForm } from '@/components/AuthForm'
import { ui } from '@/lib/ui'

export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Create an account to claim your EudaMarket showcase profile.'
}

export default function SignupPage () {
  return (
    <div className={ui.pageMainNarrow}>
      <p className={ui.eyebrow}>Account</p>
      <h1 className={`${ui.pageTitle} mb-6`}>Sign up</h1>
      <AuthForm mode="signup" />
    </div>
  )
}
