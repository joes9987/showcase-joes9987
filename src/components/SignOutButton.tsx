'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ui } from '@/lib/ui'

export function SignOutButton () {
  const router = useRouter()

  async function signOut () {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button type="button" onClick={() => void signOut()} className={ui.btnGhost}>
      <span className="hidden sm:inline">Sign out</span>
      <span className="sm:hidden">Out</span>
    </button>
  )
}
