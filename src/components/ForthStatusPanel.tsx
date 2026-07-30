import { SITE } from '@/lib/site'
import type { ForthStatus } from '@/lib/forth-status'
import { ui } from '@/lib/ui'

export function ForthStatusPanel ({ status }: { status: ForthStatus }) {
  const updated = new Date(status.updatedAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  })

  return (
    <section className={`${ui.card} animate-fade-up`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={ui.eyebrow}>PM platform status</p>
          <h2 className="font-display mt-1 text-xl font-semibold">{status.sourceLabel}</h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">{status.summary}</p>
        </div>
        <a href={SITE.forthUrl} target="_blank" rel="noreferrer" className={ui.btnSecondary}>
          Open Forth
        </a>
      </div>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {status.projects.map((project) => (
          <li key={project.id} className="rounded-xl border border-[var(--border)] bg-[var(--card-solid)]/60 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--foreground)]">{project.title}</p>
              <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent-foreground)]">
                {project.status}
              </span>
            </div>
            <p className="mt-1 font-mono text-xs text-[var(--muted)]">@{project.owner}</p>
            <p className="mt-2 text-sm text-[var(--card-foreground)]">{project.note}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-mono text-xs text-[var(--muted)]">Snapshot updated {updated} · source {status.source}</p>
    </section>
  )
}
