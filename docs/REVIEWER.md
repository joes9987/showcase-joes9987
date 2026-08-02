# Reviewer guide — EudaMarket

Production: https://showcase-joes9987.vercel.app

Public pages need no login. Score against the Project 3 rubric from the live site + code — there is no builder self-scorecard.

## Smoke checklist

| Area | Where |
|------|-------|
| Hireable narrative (≥200 words) | `/` |
| Forth status strip | `/` `#forth-status` — badge reads **Snapshot from Forth** (manual dated JSON, not a live scrape) |
| People directory + filter | `/people` |
| Sample profiles | `/people/joes9987`, `/people/CodingWCal`, `/people/nikjain15` |
| Recent GitHub activity | Profile pages (public events API; may be empty if rate-limited) |
| Opt-out placeholder | `/people/rebekah-dev` |
| Partners / fee / intro / RSVP | `/partners` |
| Partner evidence walkthrough | `/for-partners` |
| Suite deep links | `/suite` |
| Password reset | `/forgot-password` (shared suite account with EudaPM / EudaChat) |

## Claim / edit (optional)

Signup/login uses the shared suite Supabase project. New claims require the GitHub handle to match the signed-in email **local-part** against a seeded roster row — there is no guest demo that can claim another builder’s card. Peers reviewing claim UX should use their own cohort email if it matches their handle.

## Operator notes

- Forth snapshot: `data/forth-status.json` · `npm run sync:forth` bumps `updatedAt` only
- Tests: `npm test` (partner parse/rate-limit, claim-handle, Forth JSON shape, GitHub event mapping)
