# CLAUDE.md — AI development instructions for BookLuxuryYacht 2.0

## What this project is

A luxury yacht charter marketplace (successor to bookluxuryyacht.com). Three portals in one
Next.js app: customer (`/`), owner (`/owner`), admin (`/admin`), backed by a real NestJS +
Prisma API in `api/`. Read `docs/ARCHITECTURE.md` before making structural changes.

## Running it locally

Both halves must run together — the frontend has no mock data left.

```bash
# terminal 1 — api/
npm install && npx prisma migrate dev && npm run seed && npm run start:dev   # :4000

# terminal 2 — repo root
npm install && npm run dev   # :3000 (or next free port)
```

## Commands

- `npm run dev` / `npm run build` / `npm run lint` — frontend (repo root)
- `npm run start:dev` / `npm run build` / `npm run seed` — API (`api/`)
- The root `tsconfig.json` excludes `api/` — it's a separate TS project with its own
  decorator-based config; don't remove that exclusion or `next build` breaks.

## Architecture rules

- **All network access goes through `src/lib/api.ts`.** It normalizes the NestJS API's JSON
  shape into the frontend types in `src/lib/types.ts` (`Yacht`, `Destination`, `Booking`) —
  components never see raw API responses. When the API's response shape changes, only the
  normalizer functions in `api.ts` change; components stay untouched.
- **Auth state lives in `src/lib/auth-context.tsx`** (`useAuth()`), tokens persisted to
  `localStorage`. Gate protected pages with `<RequireAuth role="...">` from
  `src/components/RequireAuth.tsx` — see `owner/OwnerDashboard.tsx` or `admin/AdminDashboard.tsx`
  for the pattern (a thin default export wraps an inner component with the real page).
- **Server components fetch directly** (`await fetchYachts(...)` etc.) for public read-only
  pages (home, search shell, destination/yacht detail). Client components fetch via
  `useEffect` + the same `api.ts` functions, passing the access token for anything
  authenticated.
- `src/lib/data.ts` now only holds `fmtMoney()` and static `testimonials` — don't add
  data-shaped exports back there; new entities belong in the API + `api.ts`.
- Since every page is dynamically rendered from the database, don't add
  `generateStaticParams` back to `destinations/[slug]` or `yacht/[slug]`.

## Design system

- Colors are CSS variables in `globals.css`, exposed as Tailwind tokens: `navy-950/900/800/700`
  (backgrounds), `gold-300/400/500/600` (accents/CTAs), `ivory-50/100/200` (light surfaces),
  `sea-400/500` (success/instant-book). Never introduce raw hex values in components.
- Typography: `font-display` (Playfair Display) for headings/prices, Inter for body.
- Animations use Framer Motion via the primitives in `src/components/motion.tsx`
  (`FadeIn`, `Stagger`, `StaggerItem`) with the shared ease `[0.22, 1, 0.36, 1]`.
  Scroll reveals: `whileInView` + `viewport={{ once: true }}`. Respect `useReducedMotion`.
- Buttons: pill-shaped (`rounded-full`); primary = gold bg + navy text, secondary = bordered.
- Cards use `.card-lift` for hover elevation.

## Conventions

- TypeScript strict; no `any`.
- Images are plain `<img>` — listing photos are Unsplash placeholders in the seed data for
  now (real owner uploads go through Cloudflare R2 in a later pass — switch to `next/image`
  once real, size-known images exist).
- Currency formatting via `fmtMoney()` from `src/lib/data.ts` — supports USD/AED/CAD/EUR.
- New destination = add one entry to the `destinations` array in `api/prisma/seed.ts`, then
  re-run `npm run seed` (or `prisma migrate reset` if you need a clean DB first — that's a
  destructive action, confirm with the user before running it).
- Keep SEO in mind: every public page exports `metadata`.

## Backend conventions (`api/`)

- Prisma schema (`api/prisma/schema.prisma`) deliberately avoids Postgres-only features
  (native enums, arrays) so SQLite (dev) and PostgreSQL (prod) both work with the same
  schema file — only `datasource.provider`/`url` change at deploy time.
- RBAC guard order matters: `@UseGuards(JwtAuthGuard, RolesGuard)` then `@Roles(...)`.
  `RolesGuard` treats `admin`/`manager` as able to reach anything an explicitly listed lower
  role can (see `src/common/guards/roles.guard.ts`).
- New yacht listings always enter `status: 'pending'`; only the admin moderation endpoints
  flip them to `live`/`rejected`. Don't add a path that sets a listing live directly from the
  owner side.
- Migrations that touch/reset the database are destructive — always get explicit user
  confirmation before running `prisma migrate reset` (Prisma itself gates this for AI agents).

## Future phases (do not build prematurely)

Phase 2 adds Stripe Connect (currently stubbed as local `Payment` rows — see
`api/src/bookings/bookings.service.ts`), real OAuth, email/SMS notifications, and
Meilisearch. Phase 4 adds an Expo mobile app; the monorepo layout described in
`docs/ARCHITECTURE.md` (`apps/web`, `apps/api`, `packages/schemas`) is the target once that
starts — don't restructure into it prematurely, it's a deliberate deferral, not an oversight.
