# Tech Stack & Tooling — BookLuxuryYacht 2.0

Every choice below is justified against your v1 stack (React-Vite / Express / Mongoose / MongoDB)
and the goal: a getmyboat-class marketplace, premium audience, multi-destination, future mobile apps.

## Frontend (web) — `apps/web` (built now)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router, React 19, TypeScript)** | SSR/ISR for SEO (your #1 growth problem), file-based routing for 3 portals, API routes for stubs, Vercel-grade performance |
| Styling | **Tailwind CSS 4** | Design-system speed; consistent premium look |
| Animation | **Framer Motion** | Getmyboat-quality scroll reveals, page transitions, micro-interactions, parallax hero |
| Icons | **lucide-react** | Clean, consistent icon set |
| Fonts | **Playfair Display + Inter** (next/font) | Luxury serif display + neutral UI sans |
| State | React Server Components + **Zustand** (client islands: search filters, booking widget) | Minimal client JS; you know Redux — Zustand is the lighter modern equivalent |
| Forms/validation | **react-hook-form + Zod** | Shared schemas with API and mobile |
| Maps | **Mapbox GL JS** | Marina locations, search-by-map (Google Maps ok too; Mapbox cheaper at scale, prettier) |
| Images | next/image + **Cloudflare Images/R2** | Owner uploads: automatic resizing, WebP/AVIF, global CDN |

## Backend — `apps/api` (phase 1b)

| Layer | Choice | Why |
|---|---|---|
| Runtime/framework | **Node.js 22 LTS + NestJS 11 (TypeScript)** | Your team knows Node/Express; Nest adds the module/service/repository structure your v1 docs already describe, plus DI, guards (RBAC), OpenAPI generation for the mobile app client |
| ORM | **Prisma** | Type-safe queries, migrations, same DX as Mongoose but relational |
| Database | **PostgreSQL 16** (Neon or AWS RDS) | Transactions for bookings/payments, exclusion constraints kill double-bookings |
| Cache/queue | **Redis (Upstash) + BullMQ** | Sessions, rate limits, jobs: emails, search indexing, payout release, review reminders |
| Search | **Meilisearch** | Faceted + geo search under 50 ms; simpler/cheaper than Elasticsearch/Algolia |
| Auth | **JWT + refresh rotation; OAuth Google/Apple/Facebook** | Same tokens for web + mobile; Apple login required for iOS App Store |
| Payments | **Stripe Connect (Express accounts)** | Marketplace split payments, owner KYC/payouts, PCI handled; add PayPal later if data shows demand |
| Email | **Resend** (+ react-email templates) | Transactional: OTP, confirmations, payout notices |
| SMS/WhatsApp | **Twilio** | Booking reminders; WhatsApp matters for Dubai audience |
| Push | **FCM + APNs** via Expo | Phase 2 apps |
| File storage | **Cloudflare R2** (S3-compatible) | No egress fees for media-heavy listings |

## Mobile (phase 2) — `apps/mobile`

- **React Native + Expo (EAS Build)** — one TS codebase for iOS + Android, shares Zod schemas
  and the OpenAPI-generated client with web. Team's React skills transfer directly.
- Expo Router, React Native Reanimated (same animation feel), Stripe Payment Sheet.

## Infrastructure & DevOps

| Concern | Choice |
|---|---|
| Web hosting | **Vercel** (Next.js native, edge CDN, preview deploys per PR) |
| API hosting | **Railway or Fly.io** to start → AWS ECS when scale demands (Docker from day 1) |
| DB | Neon (serverless Postgres, branching) or RDS |
| DNS/CDN/WAF | **Cloudflare** (bot protection, rate limiting, image CDN) |
| CI/CD | **GitHub Actions**: lint → typecheck → test → build → deploy; preview envs per PR |
| Monitoring | **Sentry** (errors, web + api + mobile), **Axiom/Grafana** (logs), UptimeRobot |
| Analytics | **PostHog** (product analytics, funnels: search → view → book), GA4 for marketing |
| Error budget | Stripe/webhook alerting via Slack |

## Third-party service checklist (accounts you'll need)

1. Stripe (Connect enabled) — payments/payouts/KYC
2. Cloudflare — DNS, R2, Images, WAF
3. Vercel — web hosting
4. Neon/Railway — Postgres + API hosting
5. Upstash — Redis
6. Meilisearch Cloud (or self-host on the API box)
7. Mapbox — maps
8. Resend — email; Twilio — SMS/WhatsApp
9. Sentry, PostHog
10. Apple Developer + Google Play accounts (phase 2)
11. Expo EAS (phase 2)

## Estimated monthly cost (pre-scale)

- Vercel Pro $20 · Neon $19 · Railway ~$20 · Upstash ~$10 · Meilisearch ~$30
- Cloudflare R2/Images ~$15 · Resend $20 · Mapbox free tier · Sentry/PostHog free tiers
- **≈ $150–200/mo** until real traffic; scales linearly after.

## Team & tooling conventions

- TypeScript everywhere, strict mode. ESLint + Prettier. Conventional commits.
- Zod schemas in `packages/schemas` are the single source of truth for types
  across web/api/mobile.
- OpenAPI spec generated from NestJS decorators → typed client via `openapi-typescript`.
- Every feature ships with a Playwright e2e happy-path test (web) and Vitest unit tests (api).
