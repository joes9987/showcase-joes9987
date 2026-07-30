# EudaMarket

Partner-facing public showcase for the **Hult Summer Pilot 2026**.

Inspect builders on GitHub, follow portfolio deploys into **EudaPM** and **EudaChat**, read **Forth** PM status from a real daily snapshot, and request a warm intro.

**Production:** https://showcase-joes9987.vercel.app  
**Repo:** https://github.com/joes9987/showcase-joes9987

## Eligibility / PM status

PM status on this site comes from the committed Forth snapshot in [`data/forth-status.json`](data/forth-status.json) (source: https://forth-bice.vercel.app) plus portfolio deep links to each member’s EudaPM / EudaChat deploys when known. Refresh with `npm run sync:forth` after editing the JSON from live Forth.

## Partner intro

`/partners` → form posts to `POST /api/partner-intro`, which always persists to `partner_requests` (fail-open). If `RESEND_API_KEY` is set, the placement lead is emailed as well.

Placement fee summary: ~**25% of first-year cash compensation** for successful hires (confirm terms with the placement lead before engagement).

## Local setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Use the same Supabase URL/anon key as EudaPM / EudaChat. Public pages work without signing in.

### Schema + seed

1. Apply `supabase/migrations/001_eudamarket.sql` to project `vidprovlxevofniwyhgs` (via linked `pm-joes9987` CLI: `supabase db push --linked`).
2. Seed roster: set `SUPABASE_SERVICE_ROLE_KEY` and run `npm run seed:roster`, or run `npm run seed:sql` and execute the SQL in the Supabase SQL editor.

## Claim your profile

Sign in with the same email as EudaPM / EudaChat → **Claim profile** → enrich bio, avatar, and deploy links. Cookies are per-host (no silent SSO across `*.vercel.app`).

## Sample profiles

- https://showcase-joes9987.vercel.app/people/joes9987
- https://showcase-joes9987.vercel.app/people/CodingWCal
- https://showcase-joes9987.vercel.app/people/nikjain15

## Stack

Next.js 16 · React 19 · Tailwind 4 · Supabase Auth SSR · next-themes

See [AGENTS.md](AGENTS.md) for agent conventions.
