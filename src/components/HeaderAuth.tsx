import Link from 'next/link'
import { SignOutButton } from '@/components/SignOutButton'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { ui } from '@/lib/ui'

export async function HeaderAuth () {
  if (!isSupabaseConfigured()) {
    return (
      <>
        <Link href="/login" className={`${ui.btnGhost} hidden sm:inline-flex`}>
          Sign in
        </Link>
        <Link href="/partners#intro" className={ui.btnPrimary}>
          Request intro
        </Link>
      </>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <>
        <Link href="/login" className={`${ui.btnGhost} hidden sm:inline-flex`}>
          Sign in
        </Link>
        <Link href="/app/profile" className={`${ui.btnGhost} sm:hidden`}>
          Claim
        </Link>
        <Link href="/partners#intro" className={ui.btnPrimary}>
          <span className="hidden sm:inline">Request intro</span>
          <span className="sm:hidden">Intro</span>
        </Link>
      </>
    )
  }

  const { data: claimed } = await supabase
    .from('showcase_members')
    .select('github_handle')
    .eq('claimed_by', user.id)
    .maybeSingle()

  if (!claimed?.github_handle) {
    return (
      <>
        <Link href="/app/profile" className={ui.btnGhost}>
          <span className="hidden sm:inline">Claim profile</span>
          <span className="sm:hidden">Claim</span>
        </Link>
        <SignOutButton />
        <Link href="/partners#intro" className={`${ui.btnPrimary} hidden sm:inline-flex`}>
          Request intro
        </Link>
      </>
    )
  }

  return (
    <>
      <Link href={`/people/${claimed.github_handle}`} className={ui.btnGhost}>
        <span className="hidden sm:inline">My profile</span>
        <span className="sm:hidden">Profile</span>
      </Link>
      <Link href="/app/profile" className={`${ui.btnGhost} hidden sm:inline-flex`}>
        Edit
      </Link>
      <SignOutButton />
      <Link href="/partners#intro" className={`${ui.btnPrimary} hidden md:inline-flex`}>
        Request intro
      </Link>
    </>
  )
}
