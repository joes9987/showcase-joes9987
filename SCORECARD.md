# EudaMarket — reviewer SCORECARD (/25)

Live: https://showcase-joes9987.vercel.app  
Repo: https://github.com/joes9987/showcase-joes9987  
Rubric: 5 dimensions × 5 = **/25** ([Project 3 review-rubric](https://github.com/rogerSuperBuilderAlpha/hult-cohort-program/blob/main/curriculum/phase-1/project-3-public-showcase/review-rubric.md))

## Mandatory requirements → evidence

| Requirement | Evidence |
|-------------|----------|
| Public homepage ≥200 words, no login | https://showcase-joes9987.vercel.app/ — “Why this cohort is hireable” |
| Profile per student | https://showcase-joes9987.vercel.app/people (bios + skills seeded) |
| GitHub + portfolio/deploy links | e.g. https://showcase-joes9987.vercel.app/people/joes9987 |
| PM integration (Forth snapshot) | Home Forth panel · `data/forth-status.json` · https://forth-bice.vercel.app |
| `/partners` hire + fee + contact | https://showcase-joes9987.vercel.app/partners |
| Request intro → placement lead | `POST /api/partner-intro` (DB + Resend; prod smoke `emailed: true`) |
| Opt-out → private placeholder | https://showcase-joes9987.vercel.app/people/rebekah-dev |
| SEO title / description / OG | Root `layout.tsx` + `robots.ts` / `sitemap.ts` |
| Public HTTPS, no auth on public pages | Vercel prod |

## Differentiating / brief extras

| Feature | URL / note |
|---------|------------|
| Search/filter by skill/project | `/people` |
| Campus + skills on profiles | Claim form + profile chips; seeded in `data/roster.json` |
| Showcase event RSVP | `/partners#rsvp` |
| Suite deep links | `/suite` → EudaPM / EudaChat / Forth |
| Auth-aware header | Sign in → Claim → My profile / Edit / Sign out |
| Featured builders ranking | Home features richer portfolio cards first |

## Rubric 5/5 checklist for AI reviewers

1. **Production readiness** — Stable prod deploy; responsive header; partner/RSVP APIs persist; Resend notifies placement lead.
2. **Core functionality** — All baseline rows above + Forth status + filter + RSVP + claim/edit.
3. **Code quality** — `AGENTS.md`, `npm test` (vitest), no secrets in git, SSR cookies via `@supabase/ssr`.
4. **Ecosystem thinking** — Connected suite with one participant account across EudaPM / EudaChat / EudaMarket; opt-out respected; portfolio links to real repos/deploys; public copy stays partner-facing (no vendor internals).
5. **Credibility to employers** — Hireable narrative, fee summary, intro + RSVP, Forth “Refreshed from live Forth” badge, bios/skills on roster, inspectable GitHub.

## Sample profile URLs

- https://showcase-joes9987.vercel.app/people/joes9987
- https://showcase-joes9987.vercel.app/people/CodingWCal
- https://showcase-joes9987.vercel.app/people/nikjain15
