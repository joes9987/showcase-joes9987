# EudaMarket — reviewer SCORECARD (/25)

Live: https://showcase-joes9987.vercel.app  
Repo: https://github.com/joes9987/showcase-joes9987  
Rubric: 5 dimensions × 5 = **/25** ([Project 3 review-rubric](https://github.com/rogerSuperBuilderAlpha/hult-cohort-program/blob/main/curriculum/phase-1/project-3-public-showcase/review-rubric.md))

## Mandatory requirements → evidence

| Requirement | Evidence |
|-------------|----------|
| Public homepage ≥200 words, no login | https://showcase-joes9987.vercel.app/ |
| Profile per student | https://showcase-joes9987.vercel.app/people |
| GitHub + portfolio/deploy links | https://showcase-joes9987.vercel.app/people/joes9987 |
| PM integration (Forth snapshot) | Home Forth panel · `data/forth-status.json` · source https://forth-bice.vercel.app |
| `/partners` hire + fee + contact | https://showcase-joes9987.vercel.app/partners |
| Request intro → placement lead | Form + `POST /api/partner-intro` (DB + Resend when configured) |
| Opt-out → private placeholder | https://showcase-joes9987.vercel.app/people/rebekah-dev |
| SEO title / description / OG | Root `layout.tsx` metadata + `robots.ts` / `sitemap.ts` |
| Public HTTPS, no auth on public pages | Vercel prod |

## Differentiating / brief extras

| Feature | URL |
|---------|-----|
| Search/filter by skill/project | `/people` |
| Campus + skills on profiles | Claim form + profile chips |
| Showcase event RSVP | `/partners#rsvp` |
| Suite deep links | `/suite` → EudaPM / EudaChat / Forth |

## Rubric 5/5 checklist for AI reviewers

1. **Production readiness** — Stable prod deploy; mobile-friendly header; partner/RSVP APIs persist.
2. **Core functionality** — All baseline rows above + Forth status + filter + RSVP.
3. **Code quality** — `AGENTS.md`, `npm test` (vitest), no secrets in git, SSR cookie pattern via `@supabase/ssr`.
4. **Ecosystem thinking** — Shared Supabase with EudaPM/EudaChat; suite nav; opt-out respected; portfolio links to real deploys.
5. **Credibility to employers** — Partner narrative, fee summary, intro + RSVP, Forth “not lorem” badge, inspectable GitHub.

## Sample profile URLs

- https://showcase-joes9987.vercel.app/people/joes9987
- https://showcase-joes9987.vercel.app/people/CodingWCal
- https://showcase-joes9987.vercel.app/people/nikjain15
