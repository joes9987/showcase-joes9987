'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ShowcaseMember } from '@/lib/site'
import { ui } from '@/lib/ui'

type Props = {
  userId: string
  email: string
  suggestedHandle: string
  existing: ShowcaseMember | null
}

export function ProfileClaimEditor ({ userId, email, suggestedHandle, existing }: Props) {
  const router = useRouter()
  const [githubHandle, setGithubHandle] = useState(existing?.github_handle ?? suggestedHandle)
  const [displayName, setDisplayName] = useState(existing?.display_name ?? email.split('@')[0] ?? '')
  const [headline, setHeadline] = useState(existing?.headline ?? '')
  const [bio, setBio] = useState(existing?.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(existing?.avatar_url ?? '')
  const [optOut, setOptOut] = useState(existing?.opt_out ?? false)
  const [pmDeploy, setPmDeploy] = useState(existing?.links?.pmDeploy ?? '')
  const [chatDeploy, setChatDeploy] = useState(existing?.links?.chatDeploy ?? '')
  const [pmRepo, setPmRepo] = useState(existing?.links?.pmRepo ?? '')
  const [chatRepo, setChatRepo] = useState(existing?.links?.chatRepo ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function onSubmit (event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const handle = githubHandle.trim().replace(/^@/, '')
    if (!/^[A-Za-z0-9-]{1,39}$/.test(handle)) {
      setLoading(false)
      setError('GitHub handle must be 1–39 letters, numbers, or hyphens.')
      return
    }

    const supabase = createClient()
    const payload = {
      github_handle: handle,
      display_name: displayName.trim() || handle,
      headline: headline.trim() || null,
      bio: bio.trim() || null,
      avatar_url: avatarUrl.trim() || null,
      opt_out: optOut,
      claimed_by: userId,
      updated_at: new Date().toISOString(),
      links: {
        github: `https://github.com/${handle}`,
        pmRepo: pmRepo.trim() || null,
        pmDeploy: pmDeploy.trim() || null,
        chatRepo: chatRepo.trim() || null,
        chatDeploy: chatDeploy.trim() || null,
        showcaseRepo: 'https://github.com/joes9987/showcase-joes9987',
        showcaseDeploy: 'https://showcase-joes9987.vercel.app',
        forth: 'https://forth-bice.vercel.app'
      }
    }

    const { error: upsertError } = await supabase
      .from('showcase_members')
      .upsert(payload, { onConflict: 'github_handle' })

    setLoading(false)
    if (upsertError) {
      setError(upsertError.message)
      return
    }

    setSuccess('Showcase profile saved.')
    router.refresh()
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className={`${ui.card} mx-auto max-w-lg space-y-4`}>
      <div>
        <p className={ui.eyebrow}>Your showcase card</p>
        <h1 className="font-display mt-1 text-2xl font-semibold">Claim or edit your public profile</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Signed in as {email}. Public pages never show your email.
        </p>
      </div>
      <label className={ui.label}>
        GitHub handle
        <input required className={ui.field} value={githubHandle} onChange={(e) => setGithubHandle(e.target.value)} />
      </label>
      <label className={ui.label}>
        Display name
        <input required className={ui.field} value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      </label>
      <label className={ui.label}>
        Headline
        <input className={ui.field} value={headline} onChange={(e) => setHeadline(e.target.value)} maxLength={120} />
      </label>
      <label className={ui.label}>
        Bio
        <textarea className={`${ui.field} min-h-[100px]`} value={bio} onChange={(e) => setBio(e.target.value)} maxLength={800} />
      </label>
      <label className={ui.label}>
        Avatar URL
        <input className={ui.field} value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://…" />
      </label>
      <label className={ui.label}>
        EudaPM deploy URL
        <input className={ui.field} value={pmDeploy} onChange={(e) => setPmDeploy(e.target.value)} />
      </label>
      <label className={ui.label}>
        EudaPM repo URL
        <input className={ui.field} value={pmRepo} onChange={(e) => setPmRepo(e.target.value)} />
      </label>
      <label className={ui.label}>
        EudaChat deploy URL
        <input className={ui.field} value={chatDeploy} onChange={(e) => setChatDeploy(e.target.value)} />
      </label>
      <label className={ui.label}>
        EudaChat repo URL
        <input className={ui.field} value={chatRepo} onChange={(e) => setChatRepo(e.target.value)} />
      </label>
      <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
        <input type="checkbox" checked={optOut} onChange={(e) => setOptOut(e.target.checked)} />
        Opt out of public profile (show private placeholder)
      </label>
      <button type="submit" disabled={loading} className={ui.btnPrimary}>
        {loading ? 'Saving…' : 'Save profile'}
      </button>
      {success && <p className={ui.alertSuccess}>{success}</p>}
      {error && <p className={ui.alertError}>{error}</p>}
    </form>
  )
}
