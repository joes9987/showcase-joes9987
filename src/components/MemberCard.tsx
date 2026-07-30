import Link from 'next/link'
import type { ShowcaseMember } from '@/lib/site'
import { ui } from '@/lib/ui'

function initials (name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export function MemberCard ({ member }: { member: ShowcaseMember }) {
  return (
    <Link
      href={`/people/${member.github_handle}`}
      className={`${ui.cardSm} block transition hover:border-[var(--primary)]`}
    >
      <div className="flex items-center gap-3">
        {member.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.avatar_url}
            alt=""
            className="h-12 w-12 rounded-full object-cover ring-1 ring-[var(--border)]"
          />
        ) : (
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold"
            style={{ background: 'var(--nav-active)', color: 'var(--nav-active-fg)' }}
          >
            {initials(member.display_name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-[var(--foreground)]">{member.display_name}</p>
          <p className="truncate font-mono text-xs text-[var(--muted)]">@{member.github_handle}</p>
        </div>
      </div>
      {member.headline && (
        <p className="mt-3 line-clamp-2 text-sm text-[var(--card-foreground)]">{member.headline}</p>
      )}
    </Link>
  )
}
