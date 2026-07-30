import { redirect } from 'next/navigation'
import { ProfileClaimEditor } from '@/components/ProfileClaimEditor'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import type { ShowcaseMember } from '@/lib/site'
import { ui } from '@/lib/ui'

export default async function ProfileClaimPage () {
  if (!isSupabaseConfigured()) {
    return (
      <div className={ui.pageMainNarrow}>
        <div className={ui.card}>
          <h1 className={ui.pageTitle}>Supabase not configured</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to claim a profile.
          </p>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: existing } = await supabase
    .from('showcase_members')
    .select('github_handle, display_name, headline, bio, avatar_url, banner_url, campus, skills, opt_out, links, claimed_by, updated_at')
    .eq('claimed_by', user.id)
    .maybeSingle()

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url, bio, banner_url')
    .eq('id', user.id)
    .maybeSingle()

  const email = user.email ?? ''
  const suggestedHandle =
    existing?.github_handle ??
    email.split('@')[0]?.replace(/[^A-Za-z0-9-]/g, '').slice(0, 39) ??
    'your-handle'

  const alreadyClaimed = Boolean(existing?.github_handle)

  const seeded: ShowcaseMember | null = existing
    ? {
        ...(existing as ShowcaseMember),
        campus: (existing as ShowcaseMember).campus ?? null,
        skills: (existing as ShowcaseMember).skills ?? []
      }
    : profile
      ? {
          github_handle: suggestedHandle,
          display_name: profile.display_name ?? suggestedHandle,
          headline: null,
          bio: profile.bio ?? null,
          avatar_url: profile.avatar_url ?? null,
          banner_url: profile.banner_url ?? null,
          campus: null,
          skills: [],
          opt_out: false,
          links: null,
          claimed_by: user.id
        }
      : null

  return (
    <div className={`${ui.pageMain} py-10`}>
      <ProfileClaimEditor
        userId={user.id}
        email={email}
        suggestedHandle={suggestedHandle}
        existing={seeded}
        alreadyClaimed={alreadyClaimed}
      />
    </div>
  )
}
