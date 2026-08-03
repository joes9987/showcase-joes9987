# EudaMarket

Partner-facing public showcase for the **Hult Summer Pilot 2026**.

Inspect builders on GitHub, follow portfolio deploys into **EudaPM** and **EudaChat**, read **Forth** PM status from a real daily snapshot, and request a warm intro.

**Production:** https://showcase-joes9987.vercel.app  
**Repo:** https://github.com/joes9987/showcase-joes9987

## Eligibility / PM status

PM status from a manual Forth snapshot + portfolio links to EudaPM/EudaChat deploys. See [`data/forth-status.json`](data/forth-status.json) (source: https://forth-bice.vercel.app). Edit project notes from Forth when status changes, then run `npm run sync:forth` (verifies Forth is reachable, then bumps `updatedAt`). UI badge: “Snapshot from Forth · {timestamp}”.

**Privacy demo:** https://showcase-joes9987.vercel.app/people/rebekah-dev

**Peer reviewers:** See [docs/REVIEWER.md](docs/REVIEWER.md) for a public smoke checklist (no self-score).

## What partners see

- Homepage narrative (≥200 words) focused on public proof of work — not internal infrastructure details
- People directory with search/filter by skill or project, GitHub avatars, bios, and portfolio links
- Profile pages with campus/skills when set, GitHub + deploy/repo links, Forth status strip
- `/partners` — how to hire, ~25% first-year fee summary, request-intro + showcase RSVP
- `/for-partners` — ten-minute evidence walkthrough for hiring partners
- `/suite` — deep links to EudaPM, EudaChat, and Forth
- Connected suite: one participant account across EudaPM, EudaChat, and EudaMarket (sign in per host)

## Partner intro

`/partners` → form posts to `POST /api/partner-intro`, which always persists to `partner_requests` (fail-open). If `RESEND_API_KEY` is set, the placement lead is emailed as well.

Placement fee summary: ~**25% of first-year cash compensation** for successful hires (confirm terms with the placement lead before engagement).

## Local setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Use the same auth project URL/anon key as EudaPM / EudaChat. Public pages work without signing in.

### Schema + seed

1. Apply `supabase/migrations/001_eudamarket.sql`, `002_showcase_partner_fields.sql`, and `003_claim_handle_lock.sql` to project `vidprovlxevofniwyhgs` (via linked `pm-joes9987` CLI: `supabase db query --linked -f …`).
2. Seed roster: set `SUPABASE_SERVICE_ROLE_KEY` and run `npm run seed:roster`. Seed fills bios/skills/links from [`data/roster.json`](data/roster.json); claimed customizations are preserved.
3. In Supabase Auth → URL configuration, allow redirect URLs:
   - `https://showcase-joes9987.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback`

## Claim your profile

Sign in with the same email as EudaPM / EudaChat → **Claim profile** (header becomes **My profile / Edit / Sign out** after claim) → enrich bio, campus, skills, avatar, and deploy links. Cookies are per-host (no silent SSO across `*.vercel.app`).

**Claim rule:** the GitHub handle is locked to your email local-part (must match a seeded roster row). Forgot password: `/forgot-password` (shared suite password).

## Sample profiles

- https://showcase-joes9987.vercel.app/people/joes9987
- https://showcase-joes9987.vercel.app/people/CodingWCal
- https://showcase-joes9987.vercel.app/people/nikjain15

## Stack

Next.js 16 · React 19 · Tailwind 4 · Supabase Auth SSR · next-themes

```bash
npm test   # vitest
npm run build
```

See [AGENTS.md](AGENTS.md) for agent conventions.
