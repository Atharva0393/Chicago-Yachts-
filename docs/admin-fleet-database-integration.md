# Admin Fleet Database Integration

This document outlines the migration of the Admin Fleet Management module from mock persistence to real PostgreSQL persistence via Prisma.

## Architecture

**Previous Architecture:**
```text
Admin Fleet UI (FleetTable / YachtForm)
       ↓
src/actions/fleet.ts (Mock implementation)
       ↓
src/services/data.service.ts (In-memory/localStorage array)
```

**New Architecture:**
```text
Admin Fleet UI (FleetTable / YachtForm)
       ↓
src/actions/fleet.ts (Prisma Transaction Boundaries)
       ↓
PostgreSQL (Supabase)
```

## Security & Authentication Limitations

> [!WARNING]
> **NOT YET PRODUCTION READY FOR ADMIN AUTH**
> Currently, the Server Actions (`src/actions/fleet.ts`) execute server-side database mutations. However, a real Admin Authentication boundary does not yet exist. A `TODO: enforce authenticated AdminUser authorization` has been added. These routes must be protected via NextAuth/session checks before launching to production.

## CRUD Flow & Validation

- **Create**: Uses a Prisma `$transaction` to ensure the `Yacht`, `YachtImage`, `Amenities` (and their join tables), and a default `PricingRule` are all created atomically.
- **Update**: Re-syncs amenities, recreates the image list (to maintain sort order), and updates the associated `PricingRule`.
- **Validation**: Strict server-side Zod validation is applied via `yachtSchema` in `src/lib/validations/yacht.ts`.
- **Slug Generation**: Slugs are automatically generated from the yacht name, normalized, and guaranteed unique (e.g. `test-yacht`, `test-yacht-1`).

## Delete & Deactivation Strategy

> [!IMPORTANT]
> To protect historical bookings, analytics, and CRM records, yachts are **never hard-deleted**. Instead, deleting a yacht from the Admin panel performs a **soft delete** by setting `isActive = false`. This removes the yacht from the public fleet but preserves it in the Admin system and database.

## Amenity Management
Amenities are maintained in a normalized structure (`Amenity` ↔ `YachtAmenity` ↔ `Yacht`). When a yacht is saved, the server action `upserts` the global amenities to ensure they exist, then rebuilds the `YachtAmenity` joins for that specific yacht.

## Image Strategy
> [!NOTE]
> The current Admin UI simulates image upload. Because a real object storage integration (e.g., AWS S3, Supabase Storage) has not yet been configured, the form persists simulated image URLs directly into PostgreSQL.

## Pricing Management
The base price provided in the form (`pricePerHour`) automatically provisions a `PricingRule` with `dayType: "WEEKDAY"` and `timePeriod: "CUSTOM"`. This establishes the baseline for the upcoming Booking calculations.

## Revalidation Strategy
After any successful mutation, the server calls `revalidatePath()` for:
- `/admin/fleet`
- `/fleet`
- `/fleet/[slug]`
- `/` (Homepage for featured yachts)

This ensures the public website reflects Admin changes immediately without requiring a redeploy.
