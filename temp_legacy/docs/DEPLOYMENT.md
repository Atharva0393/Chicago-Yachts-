# Deployment Guide — BookLuxuryYacht 2.0

## Phase 1 (this repo — Next.js frontend with mock API)

### Local development
```bash
npm install
npm run dev        # http://localhost:3000
```

### Deploy to Vercel (recommended, ~5 minutes)
1. Repo: https://github.com/shanksdj/New-BLB — branches `main` (production) and
   `staging` (pre-prod). See [../CONTRIBUTING.md](../CONTRIBUTING.md) for the full
   branch workflow.
2. Go to vercel.com → Add New Project → import `shanksdj/New-BLB`.
3. Framework preset auto-detects Next.js (root directory `/`, **not** `api/`).
4. Set the Production Branch to `main` in Vercel project settings. Vercel automatically
   creates a Preview environment for every other branch/PR (including `staging`) — no
   extra config needed.
5. Add `NEXT_PUBLIC_API_URL` per environment: production → your production API URL,
   preview/staging → your staging API URL (see Environments table below).
6. Add your domain (e.g. bookluxuryyacht.com): Vercel → Settings → Domains →
   point the domain's DNS (keep DNS on Cloudflare, add a CNAME to `cname.vercel-dns.com`,
   proxy OFF for the apex/`www` records Vercel manages).

### Production checklist before launch
- [ ] Set real OG images / favicons (`src/app/` metadata)
- [ ] Add GA4 + PostHog snippets
- [ ] robots.txt / sitemap.xml (next-sitemap) — destination + yacht pages
- [ ] 301-redirect the old per-city WordPress domains to the matching
      `/destinations/<city>` pages (huge SEO win — preserves existing link equity)

## Phase 1b/2 (API + database)

### Environments
| Env | Web | API | DB |
|---|---|---|---|
| dev | localhost:3000 | localhost:4000 | Neon branch `dev` |
| staging | staging.bookluxuryyacht.com | api-staging.… | Neon branch `staging` |
| prod | bookluxuryyacht.com | api.bookluxuryyacht.com | Neon `main` |

### API deployment (Railway/Fly.io, Docker)
```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./ && RUN npm ci
COPY . . && RUN npm run build
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]
```
- Railway: connect repo → add `DATABASE_URL`, `REDIS_URL`, `STRIPE_SECRET_KEY`,
  `STRIPE_WEBHOOK_SECRET`, `JWT_SECRET`, `RESEND_API_KEY`, `MEILI_HOST`, `MEILI_KEY`.
- Run `prisma migrate deploy` as the release command.
- Stripe webhooks: point `https://api…/payments/webhook` in the Stripe dashboard,
  one endpoint per environment.

### CI/CD (GitHub Actions)
- On every PR (into `staging` or `main`): `lint → typecheck → vitest → playwright (web) → build`
- Merge to `staging` → deploys the staging API (Railway/Fly) automatically; Vercel's
  Preview deployment for the `staging` branch updates the same way.
- Merge `staging` → `main` → deploys production API + Vercel Production.
- Vercel handles frontend previews per-PR automatically — no extra Actions config needed
  for the frontend, only for the API deploy + shared test/lint gate.

### Backups & DR
- Neon: point-in-time recovery enabled (7–30 days).
- Nightly `pg_dump` to R2 as belt-and-braces.
- Media in R2 is versioned; Meilisearch index is rebuildable from Postgres.

### Observability
- Sentry DSN in web + api. Alert rules: payment webhook failures, booking
  creation errors, p95 API latency > 500 ms.
- UptimeRobot on `/` and `/api/v1/health`.

## Phase 4 (mobile)
- Expo EAS Build → TestFlight / Play internal track.
- OTA updates via EAS Update for JS-only changes.
- App Store review needs: Apple sign-in, privacy nutrition labels, account-deletion endpoint (already in API for GDPR).
