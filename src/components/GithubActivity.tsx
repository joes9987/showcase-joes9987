import type { GithubActivityItem } from '@/lib/github-activity'
import { ui } from '@/lib/ui'

export function GithubActivity ({ items }: { items: GithubActivityItem[] }) {
  return (
    <section className={`${ui.card} mt-8 animate-fade-up`}>
      <p className={ui.eyebrow}>Public GitHub</p>
      <h2 className="font-display mt-1 text-lg font-semibold">Recent activity</h2>
      <p className="mt-1 text-xs text-[var(--muted)]">
        From the public events API (cached ~10 min). Empty if the account has no recent public events or GitHub rate-limits the request.
      </p>
      {items.length === 0 ? (
        <p className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--card-solid)]/60 px-3 py-3 text-sm text-[var(--muted)]">
          No recent public events (or GitHub rate-limited this request).
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => {
            const when = new Date(item.at).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short'
            })
            return (
              <li
                key={item.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--card-solid)]/60 px-3 py-2"
              >
                <p className="text-sm font-medium text-[var(--foreground)]">{item.label}</p>
                <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
                  <a
                    href={item.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[var(--primary)] hover:underline"
                  >
                    {item.repo}
                  </a>
                  <span>{when}</span>
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
