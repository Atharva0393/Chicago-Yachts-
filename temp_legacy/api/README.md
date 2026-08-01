# BookLuxuryYacht API

The real backend behind the marketplace — NestJS + Prisma, replacing the mock
`/api/v1/*` routes in the Next.js frontend (`../src/app/api/v1/`) one-for-one
with the same JSON contracts.

## Stack

NestJS 11 · Prisma 6 · SQLite (dev) / PostgreSQL (prod) · JWT auth (access +
refresh) · class-validator · Swagger/OpenAPI

## Quick start

```bash
npm install
npx prisma migrate dev   # creates prisma/dev.db and applies the schema
npm run seed              # loads demo destinations, yachts and users
npm run start:dev         # http://localhost:4000
```

- API base: `http://localhost:4000/v1`
- Interactive docs: `http://localhost:4000/docs`

Seeded accounts (password for all: `password123`):

| Role | Email |
|---|---|
| Admin | admin@bookluxuryyacht.com |
| Owner | andres@miamivip.com |
| Customer | shankss.verma@gmail.com |

## What's implemented

- **Auth**: register (customer/owner), login, JWT access + refresh tokens, `/auth/me`
- **RBAC**: `customer < owner < support < manager < admin` guard (`src/common/guards`)
- **Destinations**: list + get by slug
- **Yachts**: public search/filter, get by slug (media, amenities, packages, reviews),
  owner create/update (new listings enter `pending` for admin review)
- **Bookings**: create with availability + capacity + min-hours validation, double-booking
  guard, live price calc (10% service fee), owner approve/reject, customer cancel
- **Reviews**: create for completed bookings only, recomputes the yacht's aggregate rating
- **Admin**: platform overview (GMV, counts), listing moderation queue, user status
  management, all-bookings view, support ticket list

## What's stubbed for phase 2

- Payments are recorded as local `Payment` rows, not real Stripe PaymentIntents —
  swap in Stripe Connect per `../docs/ARCHITECTURE.md` §5
- Email/SMS notifications, OAuth (Google/Apple/Facebook), Meilisearch indexing

## Database

Local dev uses SQLite for zero-setup. The schema (`prisma/schema.prisma`) deliberately
avoids Postgres-only features (native enums, arrays) so switching to production is just:

```bash
# .env
DATABASE_URL="postgresql://..."
```
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
```bash
npx prisma migrate deploy
```

## Project structure

```
src/
  auth/          register, login, refresh, JWT strategy
  common/        roles guard, current-user decorator, shared types
  destinations/  destination CRUD (read-heavy)
  yachts/        search/filter, owner listing management
  bookings/      booking creation, approval, cancellation
  reviews/       post-trip reviews, rating aggregation
  admin/         moderation queue, users, platform KPIs, support tickets
  prisma/        PrismaService (global module)
```
