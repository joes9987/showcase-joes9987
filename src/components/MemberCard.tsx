import Link from 'next/link'
import { memberAvatarUrl } from '@/lib/avatars'
import type { ShowcaseMember } from '@/lib/site'
import { ui } from '@/lib/ui'

export function MemberCard ({ member }: { member: ShowcaseMember }) {
  const avatar = memberAvatarUrl(member.avatar_url, member.github_handle)

  return (
    <Link
      href={`/people/${member.github_handle}`}
      className={`${ui.cardSm} block transition hover:border-[var(--primary)]`}
    >
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt=""
          className="h-12 w-12 rounded-full object-cover ring-1 ring-[var(--border)]"
        />
        <div className="min-w-0">
          <p className="truncate font-semibold text-[var(--foreground)]">{member.display_name}</p>
          <p className="truncate font-mono text-xs text-[var(--muted)]">@{member.github_handle}</p>
        </div>
      </div>
      {member.headline && (
        <p className="mt-3 line-clamp-2 text-sm text-[var(--card-foreground)]">{member.headline}</p>
      )}
      {(member.skills?.length > 0 || member.campus) && (
        <p className="mt-2 truncate text-xs text-[var(--muted)]">
          {[member.campus, ...(member.skills ?? []).slice(0, 3)].filter(Boolean).join(' · ')}
        </p>
      )}
    </Link>
  )
}
