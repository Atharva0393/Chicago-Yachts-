# BookLuxuryYacht 2.0

Global luxury yacht charter marketplace — the successor to bookluxuryyacht.com and the
per-city WordPress sites, unified into **one platform** for Miami, Dubai, Toronto, Chicago,
Cancún, Ibiza and every destination to come.

Getmyboat-class functionality with a premium, high-end brand: customer marketplace,
owner/operator portal and admin console, running on a real database with a real API —
built API-first so the future iOS/Android apps share the same backend.

## Quick start

Run both — the frontend calls the API directly, nothing works stand-alone.

**1. Backend API** (`api/` — NestJS + Prisma):
```bash
cd api
npm install
npx prisma migrate dev
npm run seed
npm run start:dev
```
API at http://localhost:4000/v1 · interactive docs at http://localhost:4000/docs
See [api/README.md](api/README.md) for seeded test accounts and endpoint list.

**2. Frontend** (repo root):
```bash
npm install
npm run dev
```
Open http://localhost:3000 (falls back to 3001+ automatically if 3000 is taken by
another project on your machine — check the terminal output for the actual port).

## What's inside

| Route | Portal | What it does |
|---|---|---|
| `/` | Customer | Animated hero + search, live destinations, featured fleet, experiences, testimonials, FAQ |
| `/search` | Customer | Live filtering against the API: destination, type, price, guests, captain, instant book + sorting |
| `/yacht/[slug]` | Customer | Gallery, specs, amenities, charter packages, reviews, **interactive booking widget** — real bookings, requires sign-in |
| `/destinations/[slug]` | Customer | SEO destination landing pages with live fleet |
| `/dashboard` | Customer | My Trips — real bookings, cancel action |
| `/auth/login`, `/auth/register` | All | Real email/password auth (JWT), customer/owner role selection |
| `/owner` | Owner | Real KPIs from your own listings/bookings, approve/decline requests, create new listings (enters moderation) |
| `/admin` | Admin | Real platform KPIs, listing moderation queue, user suspend/reinstate, all bookings, support tickets |

Every page above reads from and writes to the NestJS API in `api/` — there is no mock data
layer left in the frontend (see `src/lib/api.ts`).

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — full system design, data model, money flow, phases
- [docs/TECH-STACK.md](docs/TECH-STACK.md) — every tool/service choice with reasoning + costs
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Vercel deploy today, API/DB environments for phase 1b+
- [api/README.md](api/README.md) — backend setup, seeded accounts, endpoint list
- [CONTRIBUTING.md](CONTRIBUTING.md) — branch strategy, PR flow, local setup for the team
- [CLAUDE.md](CLAUDE.md) — instructions for AI-assisted development on this repo

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · lucide-react
NestJS 11 · Prisma 6 · SQLite (dev) / PostgreSQL (prod) · JWT auth

## Known gaps (by design, not oversight)

- **Payments are stubbed.** Bookings record a local `Payment` row instantly; there's no
  real Stripe PaymentIntent yet (phase 2).
- **OAuth buttons are disabled.** Google/Apple/Facebook sign-in is phase 2.
- **Owner earnings chart is illustrative.** Real payout history needs Stripe Connect first.
- **Support tickets have no creation UI yet** — the admin console reads real tickets but
  nothing currently writes them (would come with a customer-facing "contact support" flow).

## Roadmap

1. **Phase 1 (done)** — Next.js frontend, all three portals, mock API
2. **Phase 1b (done)** — real NestJS + Prisma API (`api/`): JWT auth + RBAC, destinations,
   yacht search/CRUD with moderation queue, bookings with availability/price logic, reviews,
   admin console endpoints — **and the frontend is fully wired to it**, no mock data left.
   Still on SQLite locally; swapping to PostgreSQL (Neon) is a two-line change for deployment
   (see api/README.md).
3. **Phase 2** — Stripe Connect payments, notifications (Resend/Twilio), OAuth, Meilisearch
4. **Phase 3** — admin/support hardening, disputes, CMS
5. **Phase 4** — React Native (Expo) iOS + Android apps sharing the same API
