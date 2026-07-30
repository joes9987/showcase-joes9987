import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ForthStatusPanel } from '@/components/ForthStatusPanel'
import { loadForthStatus } from '@/lib/forth-status'
import { getMember, listPublicMembers } from '@/lib/members'
import { SITE } from '@/lib/site'
import { ui } from '@/lib/ui'

type Props = { params: Promise<{ handle: string }> }

export async function generateStaticParams () {
  const members = await listPublicMembers()
  return members.map((m) => ({ handle: m.github_handle }))
}

export async function generateMetadata ({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const member = await getMember(handle)
  if (!member) return { title: 'Member not found' }
  if (member.opt_out) {
    return {
      title: `@${member.github_handle}`,
      description: 'Private profile on EudaMarket.'
    }
  }
  return {
    title: `${member.display_name} (@${member.github_handle})`,
    description: member.headline ?? `${member.display_name} — ${SITE.cohort}`
  }
}

function LinkRow ({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`${ui.btnSecondary} block text-center`}>
      {label}
    </a>
  )
}

export default async function PersonPage ({ params }: Props) {
  const { handle } = await params
  const [member, forth] = await Promise.all([getMember(handle), loadForthStatus()])
  if (!member) notFound()

  const owned = forth.projects.filter(
    (p) => p.owner.toLowerCase() === member.github_handle.toLowerCase()
  )

  if (member.opt_out) {
    return (
      <div className={ui.pageMainNarrow}>
        <div className={ui.card}>
          <p className={ui.eyebrow}>@{member.github_handle}</p>
          <h1 className="font-display mt-2 text-2xl font-semibold">Private profile</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            This builder opted out of a public showcase card. GitHub may still be public on github.com.
          </p>
          <Link href="/people" className={`${ui.linkAccent} mt-6 inline-block`}>
            ← Back to people
          </Link>
        </div>
      </div>
    )
  }

  const links = member.links ?? {}

  return (
    <div className={ui.pageMain}>
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-card)]">
        <div
          className="h-28 bg-gradient-to-r from-[var(--primary)]/30 via-[var(--accent)]/25 to-transparent"
          style={
            member.banner_url
              ? { backgroundImage: `url(${member.banner_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : undefined
          }
        />
        <div className="px-6 pb-8 sm:px-10">
          <div className="-mt-10 flex flex-wrap items-end gap-4">
            {member.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.avatar_url}
                alt=""
                className="h-20 w-20 rounded-2xl object-cover ring-4 ring-[var(--card-solid)]"
              />
            ) : (
              <div
                className="flex h-20 w-20 items-center justify-center rounded-2xl text-xl font-bold ring-4 ring-[var(--card-solid)]"
                style={{ background: 'var(--nav-active)', color: 'var(--nav-active-fg)' }}
              >
                {member.display_name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 pb-1">
              <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">{member.display_name}</h1>
              <p className="font-mono text-sm text-[var(--muted)]">@{member.github_handle}</p>
            </div>
          </div>
          {member.headline && (
            <p className="mt-4 text-lg text-[var(--card-foreground)]">{member.headline}</p>
          )}
          {member.bio && (
            <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted-foreground)]">
              {member.bio}
            </p>
          )}
          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {(links.github || `https://github.com/${member.github_handle}`) && (
              <LinkRow label="GitHub" href={links.github || `https://github.com/${member.github_handle}`} />
            )}
            {links.pmDeploy && <LinkRow label="EudaPM deploy" href={links.pmDeploy} />}
            {links.pmRepo && <LinkRow label="EudaPM repo" href={links.pmRepo} />}
            {links.chatDeploy && <LinkRow label="EudaChat deploy" href={links.chatDeploy} />}
            {links.chatRepo && <LinkRow label="EudaChat repo" href={links.chatRepo} />}
            {links.showcaseDeploy && <LinkRow label="Showcase" href={links.showcaseDeploy} />}
            {(links.forth || SITE.forthUrl) && (
              <LinkRow label="Forth PM" href={links.forth || SITE.forthUrl} />
            )}
          </div>
        </div>
      </div>

      {owned.length > 0 && (
        <section className={`${ui.card} mt-8`}>
          <p className={ui.eyebrow}>Forth / PM status</p>
          <h2 className="font-display mt-1 text-xl font-semibold">Projects tied to this builder</h2>
          <ul className="mt-4 space-y-3">
            {owned.map((project) => (
              <li key={project.id} className="rounded-xl border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{project.title}</p>
                  <span className="text-xs font-semibold uppercase text-[var(--accent-foreground)]">{project.status}</span>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">{project.note}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8">
        <ForthStatusPanel status={forth} />
      </div>
    </div>
  )
}
