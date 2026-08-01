# Public Fleet Database Integration

This document outlines the migration of public fleet data from static runtime mocks to PostgreSQL via Prisma.

## Architecture

**Previous Architecture:**
```text
src/data/yachts.ts (Mock data array)
       ↓
src/services/data.service.ts (DataService class)
       ↓
Client/Server Components (UI)
```

**New Architecture:**
```text
PostgreSQL (Supabase)
       ↓
Prisma Client
       ↓
src/server/repositories/yacht.repository.ts (Server-side data access layer)
       ↓
src/server/actions/yacht.actions.ts (Next.js Server Actions)
       ↓
Client/Server Components (UI)
```

## Key Changes
1. **Yacht Repository**: Created `yacht.repository.ts` to strictly handle Prisma `db.yacht.findMany` and `findUnique` operations.
2. **Server Actions**: Introduced `getAllYachtsAction()` to safely fetch database records and make them accessible to Client Components (like `src/app/fleet/page.tsx` and context providers).
3. **UI Model Mapping**: Added `mapPrismaYachtToPublicModel` to safely convert Prisma types (like `Decimal` to `number`) into the existing `Yacht` TypeScript interface, avoiding a complete rewrite of the UI components.
4. **Detail Page**: The dynamic route `src/app/fleet/[slug]/page.tsx` now calls the repository directly. If a slug does not exist in the database, it properly triggers Next.js `notFound()`.
5. **Metadata**: SEO metadata (`generateMetadata`) is now strictly database-driven.

## Caching & Rendering Strategy
- **Client Components**: `FleetPage` uses `useYachts` which invokes a server action. The data is fetched dynamically.
- **Server Components**: `YachtDetailPage` fetches directly from the repository.
- **Failover**: If the database is unreachable, the repository handles the error gracefully and returns empty results to prevent exposure of raw Prisma stack traces or secrets to the public frontend.

## Prisma Decimal Serialization
Prisma returns PostgreSQL numeric fields as `Decimal` objects. To prevent serialization errors when passing data from Server Actions to Client Components, `mapPrismaYachtToPublicModel` converts `pricePerHour`, `rating`, and `length` to native JavaScript `number` types.

## Homepage Featured Fallback
Currently, the database has all yachts seeded with `isFeatured = false`. The `FeaturedFleet` component uses `getFeaturedYachts(3)` which first queries for featured yachts. If none are found, it safely falls back to displaying the first 3 active yachts to ensure the homepage never looks broken.

## Source Data Dependency
The static file `src/data/yachts.ts` remains in the codebase **only** for database seeding/migration purposes. It is no longer read by the application at runtime.
