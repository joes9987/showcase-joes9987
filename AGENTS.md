# AGENTS.md — EudaMarket (showcase-joes9987)

Public showcase for the Hult Summer Pilot (Phase 1 Project 3).

## Stack

- Next.js 16 App Router · React 19 · Tailwind 4 · `next-themes`
- Shared Supabase project with EudaPM / EudaChat (`vidprovlxevofniwyhgs`)
- Auth SSR via `@supabase/ssr` (`getAll` / `setAll` only)

## Product

| Route | Auth |
|-------|------|
| `/`, `/people`, `/people/[handle]`, `/partners`, `/suite` | Public |
| `/login`, `/signup`, `/app/profile` | Claim/edit own showcase card |

Never expose emails on public pages. Opt-out members render a private placeholder.

## Data

- `showcase_members` — public roster rows (GitHub handle PK)
- `partner_requests` — intro form submissions (anon insert; staff select)
- `data/roster.json` — seed + offline fallback
- `data/forth-status.json` — daily Forth PM snapshot (no public Forth API)

Migration source of truth: `supabase/migrations/001_eudamarket.sql`. Apply to the shared project via the linked **pm-joes9987** Supabase CLI (`supabase db push --linked`).

## Commands

```bash
cp .env.example .env.local   # fill Supabase + suite URLs
npm install
npm run dev
npm run build
npm run seed:roster          # needs SUPABASE_SERVICE_ROLE_KEY
npm run sync:forth           # bump snapshot timestamp
```

## Env

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (same as PM/Chat)
- `NEXT_PUBLIC_EUDA_PM_URL`, `NEXT_PUBLIC_EUDA_CHAT_URL`, `NEXT_PUBLIC_FORTH_URL`, `NEXT_PUBLIC_SITE_URL`
- `PLACEMENT_LEAD_EMAIL`, optional `RESEND_API_KEY` / `RESEND_FROM_EMAIL`
- Optional `SUPABASE_SERVICE_ROLE_KEY` for seed script and partner API fallback

## Deploy

- GitHub: `joes9987/showcase-joes9987` (public)
- Vercel: `showcase-joes9987.vercel.app`

## Conventions

- Brand: cyan `#0891b2` / indigo `#6366f1`, Syne + IBM Plex — match EudaChat `globals.css` / `ui.ts`
- Minimal diffs; do not alter PM/Chat tables
- Public pages must work with auth unset
