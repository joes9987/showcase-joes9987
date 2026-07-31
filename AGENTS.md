# AGENTS.md — EudaMarket (showcase-joes9987)

Public showcase for the Hult Summer Pilot (Phase 1 Project 3).

## Stack

- Next.js 16 App Router · React 19 · Tailwind 4 · `next-themes`
- Shared auth/DB project with EudaPM / EudaChat (`vidprovlxevofniwyhgs`)
- Auth SSR via `@supabase/ssr` (`getAll` / `setAll` only)

## Product

| Route | Auth |
|-------|------|
| `/`, `/people`, `/people/[handle]`, `/partners`, `/suite` | Public |
| `/login`, `/signup`, `/app/profile` | Claim/edit own showcase card |

Never expose emails on public pages. Opt-out members render a private placeholder.

**Public copy rules:** Partner-facing pages describe a connected suite and shared participant accounts. Do not name vendor internals (e.g. “Supabase”) on marketing surfaces — keep that in this file / README operator sections only.

## Data

- `showcase_members` — public roster rows (GitHub handle PK; campus, skills[], links jsonb, opt_out)
- `partner_requests` — intro form submissions (anon insert; staff select)
- `showcase_rsvps` — end-of-pilot showcase RSVP (anon insert; staff select)
- `data/roster.json` — seed + offline fallback (+ merge enrichment when DB fields are thin)
- `data/forth-status.json` — daily Forth PM snapshot (no public Forth API)

Migrations: `supabase/migrations/001_eudamarket.sql`, `002_showcase_partner_fields.sql`. Apply via linked **pm-joes9987** CLI (`supabase db query --linked -f …`).

## Commands

```bash
cp .env.example .env.local   # fill auth + suite URLs
npm install
npm run dev
npm run build
npm test
npm run seed:roster          # needs SUPABASE_SERVICE_ROLE_KEY
npm run sync:forth           # bump snapshot timestamp
```

## Env

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (same as PM/Chat)
- `NEXT_PUBLIC_EUDA_PM_URL`, `NEXT_PUBLIC_EUDA_CHAT_URL`, `NEXT_PUBLIC_FORTH_URL`, `NEXT_PUBLIC_SITE_URL`
- `PLACEMENT_LEAD_EMAIL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (verified sending domain)
- Optional `SUPABASE_SERVICE_ROLE_KEY` for seed script

## Deploy

- GitHub: `joes9987/showcase-joes9987` (public)
- Vercel: `showcase-joes9987.vercel.app`

## Conventions

- Brand: cyan `#0891b2` / indigo `#6366f1`, Syne + IBM Plex — match EudaChat `globals.css` / `ui.ts`
- Minimal diffs; do not alter PM/Chat tables
- Public pages must work with auth unset
- Header auth states: signed out → Sign in; signed in unclaimed → Claim; claimed → My profile / Edit / Sign out
