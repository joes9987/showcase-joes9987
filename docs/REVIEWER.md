# Reviewer guide — EudaMarket

Production: https://showcase-joes9987.vercel.app

Public pages need no login. Score against the Project 3 rubric from the live site + code — there is no builder self-scorecard.

## Smoke checklist

| Area | Where |
|------|-------|
| Hireable narrative (≥200 words) | `/` |
| Forth status strip | `/` `#forth-status` — **Forth reachable · checked …** (live probe) + **Program snapshot** rows (curated; no public ticket API) |
| Ops health | `/api/health` — `app: "eudamarket"`, Forth probe + `partnerWritesConfigured` |
| People directory + coverage strip | `/people` — “N of M … verified live … deploy” |
| Sample profiles | `/people/joes9987`, `/people/CodingWCal`, `/people/nikjain15` |
| Recent GitHub activity | Profile pages (empty state if rate-limited / no public events) |
| Opt-out placeholder | `/people/rebekah-dev` |
| Partners / intro / RSVP | `/partners` (no public fee % or placement email) |
| Partner evidence walkthrough | `/for-partners` |
| Suite deep links | `/suite` |
| Password reset | `/forgot-password` (shared suite account with EudaPM / EudaChat) |

## Claim / edit (optional)

Signup/login uses the shared suite Supabase project. New claims require the GitHub handle to match the signed-in email **local-part** against a seeded roster row — there is no guest demo that can claim another builder’s card. Peers reviewing claim UX should use their own cohort email if it matches their handle.

## Operator notes

- Forth: live reachability via `npm run sync:forth` + GitHub Actions `sync-forth` cron (every 12h). Narrative `projects[]` still curated — Forth has no public ticket API.
- Partner APIs require `SUPABASE_SERVICE_ROLE_KEY` in production (no anon-key write fallback).
- Tests: `npm test` (vitest) · `npm run test:e2e` (Playwright public smoke after build)
