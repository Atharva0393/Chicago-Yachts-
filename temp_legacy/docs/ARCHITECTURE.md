# BookLuxuryYacht 2.0 — Platform Architecture

> Global luxury yacht charter marketplace — Miami, Dubai, Toronto, Chicago, Cancun and beyond.
> Successor to bookluxuryyacht.com (React-Vite + Express + MongoDB) and the per-city WordPress sites.
> Designed API-first so the same backend powers the website **and** the future iOS/Android apps.

---

## 1. Why this architecture

Your previous setup had two problems this design solves:

| Problem | Solution |
|---|---|
| One WordPress site per city — nightmare to manage | **One multi-tenant platform** with destination pages (`/destinations/miami`, `/destinations/dubai`) driven by a single database. Add a city = add a row, not a website. |
| bookluxuryyacht.com got no organic traction | **Next.js server-side rendering** — every yacht listing and destination page is a fast, SEO-indexable page (WordPress-level SEO with marketplace-level functionality). Structured data (schema.org `Product`/`BoatTrip`) baked in. |
| Web only, apps later | **API-first**: all business logic lives behind a REST/JSON API. The Next.js site and the future React Native apps are both just clients. |

## 2. High-level system diagram

```
                        ┌────────────────────────────────────────┐
                        │            CLIENTS                     │
                        │  Next.js Web (SSR/ISR)                 │
                        │  iOS / Android (React Native + Expo)   │
                        │  Admin SPA (part of Next.js app)       │
                        └───────────────┬────────────────────────┘
                                        │ HTTPS / JSON
                        ┌───────────────▼────────────────────────┐
                        │        API LAYER (NestJS)              │
                        │  REST /api/v1  +  OpenAPI spec         │
                        │  Auth (JWT + refresh, OAuth Google/    │
                        │  Apple/Facebook), RBAC guards          │
                        └──┬─────────┬─────────┬─────────┬───────┘
                           │         │         │         │
            ┌──────────────▼──┐ ┌────▼────┐ ┌──▼──────┐ ┌▼──────────────┐
            │ Core services   │ │ Search  │ │ Payments│ │ Notifications │
            │ users/owners/   │ │ Meili-  │ │ Stripe  │ │ Resend(email) │
            │ yachts/bookings │ │ search  │ │ Connect │ │ Twilio (SMS)  │
            │ reviews/support │ │ (geo+   │ │ (split  │ │ FCM/APNs push │
            │                 │ │ facets) │ │ payouts)│ │               │
            └──────┬──────────┘ └────┬────┘ └──┬──────┘ └───────────────┘
                   │                 │         │
            ┌──────▼─────────────────▼─────────▼──────┐
            │  DATA LAYER                             │
            │  PostgreSQL 16 (Prisma ORM)  — source   │
            │  of truth: users, yachts, bookings,     │
            │  payments, reviews, disputes            │
            │  Redis — sessions, rate-limit, caching, │
            │  BullMQ job queues                      │
            │  Cloudflare R2 / S3 — photos & videos   │
            │  (behind Cloudflare Images/CDN)         │
            └─────────────────────────────────────────┘
```

## 3. The three portals (same as your v1, upgraded)

### 3.1 Customer portal (`/`)
- Browse/search yachts by destination, date, group size, price, captain option, amenities
- Map + list results (Mapbox GL), instant filter facets (Meilisearch)
- Listing page: gallery, video, reviews, availability calendar, transparent pricing
- Booking flow: request-to-book **or** instant book → Stripe payment (deposit or full)
- Dashboard: trips, messages with owner/captain, cancellations, refunds
- Reviews & ratings after completed trips (verified-booking-only)

### 3.2 Owner/operator portal (`/owner`)
- Onboarding with KYC (Stripe Connect Express) + document verification (insurance, registration)
- Listing manager: photos/video upload, pricing (hourly/half-day/day/week), seasonal rates,
  discounts, custom charter packages, add-ons (jet ski, catering, water toys)
- Availability calendar with blocked dates + iCal sync
- Booking inbox: approve/decline requests, message customers
- Earnings dashboard: payouts, statements, tax exports

### 3.3 Admin portal (`/admin`)
- KPI dashboard: GMV, bookings, take rate, top destinations
- User & owner management (approve/suspend/verify)
- Listing moderation queue (approve/reject with reasons)
- Booking oversight: refunds, cancellations, disputes
- Support module with roles: **super-admin, manager, customer-service** (RBAC)
- CMS: destination pages, FAQs, promos, journal/blog
- Reports: bookings, revenue, user growth (CSV/PDF export)

## 4. Key data model (PostgreSQL)

Carried over from your MongoDB schema, normalized:

```
users(id, role[customer|owner|admin|manager|support], email, phone, password_hash,
      oauth_provider, status, locale, currency, created_at)
owner_profiles(user_id, company, stripe_account_id, verification_status, docs[])
destinations(id, slug, name, country, lat, lng, timezone, currency, hero_media, seo_meta)
yachts(id, owner_id, destination_id, title, slug, type[motor|sail|catamaran|mega|jetski|...],
       length_ft, capacity, cabins, crew, with_captain, description, status[draft|pending|live|
       rejected|paused], base_price_hour, min_hours, currency, lat, lng, marina_address)
yacht_media(id, yacht_id, kind[photo|video], url, sort)
yacht_amenities(yacht_id, amenity_id)
packages(id, yacht_id, name, hours, price, includes[])          -- custom charter packages
pricing_rules(id, yacht_id, kind[seasonal|weekend|duration_discount|promo], params jsonb)
availability(id, yacht_id, date, slots jsonb, blocked)
bookings(id, code, yacht_id, customer_id, package_id?, date, start_time, end_time, guests,
         status[pending|approved|paid|confirmed|completed|cancelled|refunded|disputed],
         subtotal, fees, taxes, total, currency, payment_intent_id)
payments(id, booking_id, kind[charge|refund|payout], stripe_id, amount, status)
reviews(id, booking_id, author_id, yacht_id, ratings jsonb{accuracy,value,communication,...},
        comment, owner_reply, status)
messages(id, thread_id, sender_id, body, attachments, read_at)   -- customer<->owner + support
support_tickets(id, user_id, booking_id?, assignee_id, priority, status, thread_id)
audit_logs(id, actor_id, action, entity, entity_id, diff jsonb, at)
```

**Why PostgreSQL over MongoDB this time:** bookings + payments + payouts are relational and
transactional (double-booking prevention needs row-level locking / exclusion constraints;
marketplace money movement needs ACID). Prisma gives you the same developer speed you had
with Mongoose.

## 5. Booking & money flow (Stripe Connect)

1. Customer pays → **PaymentIntent** on the platform account with `application_fee_amount`
   (your take rate, e.g. 10–15%) and `transfer_data.destination = owner's connected account`.
2. Funds held; owner approves (or instant-book skips approval).
3. Trip completes → payout released to owner (minus platform fee) on your schedule.
4. Cancellation policy engine (flexible / moderate / strict per listing) computes refunds.
5. Webhooks (`payment_intent.succeeded`, `charge.refunded`, `account.updated`) drive booking
   state — never trust the client.

## 6. Search

- **Meilisearch** (self-host, ~free) — indexes live yachts with geo, price, capacity,
  type, amenities, rating facets. Synced from Postgres via BullMQ job on listing changes.
- Destination landing pages are ISR-rendered from Postgres for SEO; the interactive
  search UI hits Meilisearch for <50 ms filtering.

## 7. Multi-destination & i18n

- One deployment serves all cities. `destinations` table drives nav, landing pages, SEO.
- `next-intl` for languages (EN first; AR for Dubai, FR for Toronto later).
- Prices stored in listing currency, displayed with FX conversion (cached daily rates).

## 8. Mobile apps (phase 2)

- **React Native + Expo** — shares the TypeScript API client + Zod schemas from a small
  monorepo package. Same auth (JWT + refresh) and endpoints.
- Push notifications via Expo Notifications (FCM/APNs), deep links `blyacht://yacht/123`.
- Nothing on the backend changes — that's the point of API-first.

## 9. Security & compliance

- JWT access (15 min) + rotating refresh tokens (httpOnly cookies on web, SecureStore on mobile)
- RBAC middleware: `customer < owner < support < manager < admin`
- Rate limiting + bot protection (Cloudflare), OWASP headers, input validation with Zod/class-validator
- PCI: card data never touches your servers (Stripe Elements/Payment Sheet)
- GDPR: data export/delete endpoints, consent logging; audit_logs for every admin action
- Media uploads: signed URLs, virus scan, EXIF strip

## 10. Repository layout (monorepo)

```
blb/
├── apps/
│   ├── web/          # Next.js 15 site (this repo today — customer + owner + admin portals)
│   ├── api/          # NestJS API (phase 1b — extract from Next.js API routes)
│   └── mobile/       # Expo app (phase 2)
├── packages/
│   ├── ui/           # shared design system components
│   ├── api-client/   # typed fetch client generated from OpenAPI
│   └── schemas/      # Zod schemas shared web/mobile/api
└── docs/
```

**Today** the frontend ships with typed mock data + Next.js API route stubs so the UI is fully
navigable; the NestJS API replaces the stubs without UI changes (same JSON contracts).

## 11. Phased delivery plan

| Phase | Scope | Duration (small team) |
|---|---|---|
| 1 | This Next.js frontend: all 3 portals UI, mock API, SEO pages, animations | done (this build) |
| 1b | NestJS API + Postgres + auth + listings + search | 4–6 weeks |
| 2 | Stripe Connect payments, booking engine, notifications | 3–4 weeks |
| 3 | Admin/support tooling hardening, reviews, disputes, CMS | 3 weeks |
| 4 | React Native apps (reuse API client) | 6–8 weeks |
