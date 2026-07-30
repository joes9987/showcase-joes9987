'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { MemberCard } from '@/components/MemberCard'
import { filterMembers } from '@/lib/members-filter'
import type { ShowcaseMember } from '@/lib/site'
import { ui } from '@/lib/ui'

export function PeopleDirectory ({ members }: { members: ShowcaseMember[] }) {
  const [query, setQuery] = useState('')
  const [skill, setSkill] = useState('')
  const deferredQuery = useDeferredValue(query)
  const deferredSkill = useDeferredValue(skill)

  const skills = useMemo(() => {
    const set = new Set<string>()
    for (const m of members) {
      for (const s of m.skills ?? []) set.add(s)
    }
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [members])

  const filtered = useMemo(
    () => filterMembers(members, deferredQuery, deferredSkill),
    [members, deferredQuery, deferredSkill]
  )

  return (
    <div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className={`${ui.label} flex-1`}>
          Search
          <input
            className={ui.field}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, handle, campus, skill…"
          />
        </label>
        <label className={`${ui.label} sm:w-56`}>
          Skill / project
          <select className={`${ui.select} mt-1.5 w-full`} value={skill} onChange={(e) => setSkill(e.target.value)}>
            <option value="">All</option>
            {skills.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-3 text-xs text-[var(--muted)]">
        Showing {filtered.length} of {members.length}
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((member) => (
          <MemberCard key={member.github_handle} member={member} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-8 text-sm text-[var(--muted)]">No builders match that filter.</p>
      )}
    </div>
  )
}
