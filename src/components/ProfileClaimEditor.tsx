'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { handleFromEmail, isValidGithubHandle } from '@/lib/claim-handle'
import { createClient } from '@/lib/supabase/client'
import type { ShowcaseMember } from '@/lib/site'
import { ui } from '@/lib/ui'

type Props = {
  userId: string
  email: string
  suggestedHandle: string
  existing: ShowcaseMember | null
  alreadyClaimed: boolean
  rosterExists: boolean
  rosterClaimedByOther: boolean
}

export function ProfileClaimEditor ({
  userId,
  email,
  suggestedHandle,
  existing,
  alreadyClaimed,
  rosterExists,
  rosterClaimedByOther
}: Props) {
  const router = useRouter()
  const lockedHandle = alreadyClaimed
    ? (existing?.github_handle ?? suggestedHandle)
    : handleFromEmail(email) || suggestedHandle

  const [displayName, setDisplayName] = useState(existing?.display_name ?? lockedHandle)
  const [headline, setHeadline] = useState(existing?.headline ?? '')
  const [bio, setBio] = useState(existing?.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(existing?.avatar_url ?? '')
  const [campus, setCampus] = useState(existing?.campus ?? '')
  const [skills, setSkills] = useState((existing?.skills ?? []).join(', '))
  const [optOut, setOptOut] = useState(existing?.opt_out ?? false)
  const [pmDeploy, setPmDeploy] = useState(existing?.links?.pmDeploy ?? '')
  const [chatDeploy, setChatDeploy] = useState(existing?.links?.chatDeploy ?? '')
  const [pmRepo, setPmRepo] = useState(existing?.links?.pmRepo ?? '')
  const [chatRepo, setChatRepo] = useState(existing?.links?.chatRepo ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const canClaim =
    alreadyClaimed || (rosterExists && !rosterClaimedByOther && isValidGithubHandle(lockedHandle))

  async function onSubmit (event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const handle = lockedHandle
    if (!isValidGithubHandle(handle)) {
      setLoading(false)
      setError('Your email local-part must look like a GitHub handle (letters, numbers, hyphens).')
      return
    }

    if (!alreadyClaimed) {
      if (!rosterExists) {
        setLoading(false)
        setError(`No roster card for @${handle}. Sign up with an email whose local-part matches your GitHub handle.`)
        return
      }
      if (rosterClaimedByOther) {
        setLoading(false)
        setError(`@${handle} is already claimed.`)
        return
      }
    }

    const skillList = skills
      .split(/[,]+/)
      .map((s) => s.trim())
      .filter(Boolean)

    const JOE_SHOWCASE_REPO = 'https://github.com/joes9987/showcase-joes9987'
    const JOE_SHOWCASE_DEPLOY = 'https://showcase-joes9987.vercel.app'
    const isJoe = handle.toLowerCase() === 'joes9987'

    function cleanShowcaseField (
      value: string | null | undefined,
      joeDefault: string
    ): string | null {
      if (!value) return null
      if (!isJoe && (value === joeDefault || value.startsWith(joeDefault))) return null
      return value
    }

    let showcaseRepo: string | null = null
    let showcaseDeploy: string | null = null
    if (alreadyClaimed) {
      showcaseRepo = cleanShowcaseField(existing?.links?.showcaseRepo, JOE_SHOWCASE_REPO)
      showcaseDeploy = cleanShowcaseField(existing?.links?.showcaseDeploy, JOE_SHOWCASE_DEPLOY)
    } else if (isJoe) {
      showcaseRepo = JOE_SHOWCASE_REPO
      showcaseDeploy = JOE_SHOWCASE_DEPLOY
    }

    const supabase = createClient()
    const payload = {
      github_handle: handle,
      display_name: displayName.trim() || handle,
      headline: headline.trim() || null,
      bio: bio.trim() || null,
      avatar_url: avatarUrl.trim() || null,
      campus: campus.trim() || null,
      skills: skillList,
      opt_out: optOut,
      claimed_by: userId,
      updated_at: new Date().toISOString(),
      links: {
        github: `https://github.com/${handle}`,
        pmRepo: pmRepo.trim() || null,
        pmDeploy: pmDeploy.trim() || null,
        chatRepo: chatRepo.trim() || null,
        chatDeploy: chatDeploy.trim() || null,
        showcaseRepo,
        showcaseDeploy,
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
        <h1 className="font-display mt-1 text-2xl font-semibold">
          {alreadyClaimed ? 'Edit your public profile' : 'Claim your public profile'}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Signed in as {email}. Public pages never show your email. Claimable handle is the email local-part
          ({lockedHandle || '—'}) so peers cannot take another builder’s card.
        </p>
        {alreadyClaimed && existing?.github_handle && (
          <p className="mt-2 text-sm">
            <Link href={`/people/${existing.github_handle}`} className={ui.linkAccent}>
              View public profile →
            </Link>
          </p>
        )}
        {!alreadyClaimed && !canClaim && (
          <p className={`${ui.alertWarning} mt-3`}>
            {!rosterExists
              ? `No seeded roster row for @${lockedHandle}. Use an account whose email local-part matches your GitHub handle, or ask staff.`
              : `@${lockedHandle} is already claimed by someone else.`}
          </p>
        )}
      </div>
      <label className={ui.label}>
        GitHub handle
        <input required className={ui.field} value={lockedHandle} readOnly disabled />
        <span className="mt-1 block text-xs font-normal text-[var(--muted)]">Locked to your account email</span>
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
        Campus
        <input
          className={ui.field}
          value={campus}
          onChange={(e) => setCampus(e.target.value)}
          placeholder="Boston · London · Dubai…"
        />
      </label>
      <label className={ui.label}>
        Skills / projects
        <input
          className={ui.field}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Next.js, Forth, product"
        />
        <span className="mt-1 block text-xs font-normal text-[var(--muted)]">Comma-separated</span>
      </label>
      <label className={ui.label}>
        Avatar URL
        <input className={ui.field} value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="Leave blank to use GitHub avatar" />
      </label>
      <label className={ui.label}>
        Project 1 deploy URL
        <input className={ui.field} value={pmDeploy} onChange={(e) => setPmDeploy(e.target.value)} />
      </label>
      <label className={ui.label}>
        Project 1 repo URL
        <input className={ui.field} value={pmRepo} onChange={(e) => setPmRepo(e.target.value)} />
      </label>
      <label className={ui.label}>
        Project 2 deploy URL
        <input className={ui.field} value={chatDeploy} onChange={(e) => setChatDeploy(e.target.value)} />
      </label>
      <label className={ui.label}>
        Project 2 repo URL
        <input className={ui.field} value={chatRepo} onChange={(e) => setChatRepo(e.target.value)} />
      </label>
      <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
        <input type="checkbox" checked={optOut} onChange={(e) => setOptOut(e.target.checked)} />
        Opt out of public profile (show private placeholder)
      </label>
      <button type="submit" disabled={loading || !canClaim} className={ui.btnPrimary}>
        {loading ? 'Saving…' : 'Save profile'}
      </button>
      {success && <p className={ui.alertSuccess}>{success}</p>}
      {error && <p className={ui.alertError}>{error}</p>}
    </form>
  )
}
