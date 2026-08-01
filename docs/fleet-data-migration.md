# Fleet Data Migration — Source Traceability

## Source Files

| Source | Path | Role |
|---|---|---|
| **Primary** | `src/data/yachts.ts` | 14 yacht objects — the single source of truth |
| **Consumer** | `src/services/data.service.ts` | Imports `yachts` and serves them via in-memory `DataService` |
| **Type** | `src/types/index.ts` | `Yacht` interface definition |
| **Seeder** | `prisma/seed.ts` | Idempotent seeder that maps source data into Prisma models |

## Yacht Inventory (14 Yachts)

| # | Name | Slug | Length | Price/Hr | Manufacturer |
|---|---|---|---|---|---|
| 1 | 34'ft Rinker Fiesta Vee Yacht | `34-ft-rinker-fiesta-vee-yacht` | 34 ft | $240 | Rinker |
| 2 | 31'ft Sea Ray Sundancer Yacht | `31-ft-sea-ray-sundancer-yacht` | 31 ft | $250 | Sea Ray |
| 3 | 37′ Rinker 342 Fiesta Vee Yacht | `37-rinker-342-fiesta-vee-yacht` | 40 ft | $280 | Rinker |
| 4 | 37'ft Sea Ray Drift Yacht | `37-ft-sea-ray-drift-yacht` | 37 ft | $300 | Sea Ray |
| 5 | 46'ft Legacy Luxury Yacht | `46-ft-legacy-luxury-yacht` | 46 ft | $320 | Legacy |
| 6 | 42'ft Sea Ray Horizon Yacht | `42-ft-sea-ray-horizon-yacht` | 42 ft | $320 | Sea Ray |
| 7 | 46'ft Sea Ray Monarch | `46-ft-sea-ray-monarch` | 46 ft | $320 | Sea Ray |
| 8 | 45'ft Sea Ray Power Boat Surge | `45-ft-sea-ray-power-boat-surge` | 45 ft | $320 | Sea Ray |
| 9 | 46'ft Sea Ray Prestige Yacht | `46-ft-sea-ray-prestige-yacht` | 46 ft | $320 | Sea Ray |
| 10 | 51'ft Sea Ray Apex Yacht | `51-ft-sea-ray-apex-yacht` | 51 ft | $349 | Sea Ray |
| 11 | 51'ft Sea Ray Summit Yacht | `51-ft-sea-ray-summit-yacht` | 51 ft | $349 | Sea Ray |
| 12 | 44' Sea Ray Express Luxury Motor Yacht | `44-sea-ray-express-luxury-motor-yacht-rental-in-chicago` | 44 ft | $349 | Sea Ray |
| 13 | 46' Sea Ray Yacht - Perfect for Parties | `enjoy-chicago-46-beautiful-sea-ray-yacht-perfect-for-parties` | 46 ft | $400 | Sea Ray |
| 14 | 45' Sea Ray Express Cruiser Yacht | `enjoy-chicago-in-this-45-sea-ray-express-cruiser-yacht` | 45 ft | $400 | Sea Ray |

## Database Record Counts

| Model | Count |
|---|---|
| Yacht | 14 |
| YachtImage | 70 (5 per yacht) |
| Amenity | 5 |
| YachtAmenity | 70 (5 per yacht) |
| PricingRule | 14 (1 per yacht) |

## Field Mapping

### Successfully Mapped Fields
| Source Field | Prisma Model.Field | Notes |
|---|---|---|
| `name` | `Yacht.name` | Direct |
| `slug` | `Yacht.slug` | Direct, unique |
| `manufacturer` | `Yacht.manufacturer` | Direct |
| `model` | `Yacht.model` | Direct |
| `year` | `Yacht.year` | Direct |
| `length` | `Yacht.length` | Direct (Float) |
| `capacity` | `Yacht.capacity` | Direct |
| `cabins` | `Yacht.cabins` | Direct |
| `bathrooms` | `Yacht.bathrooms` | Direct |
| `description` | `Yacht.description` | Direct |
| `location` | `Yacht.location` | Direct |
| `images[0]` | `YachtImage` (isPrimary=true) | First image set as primary |
| `images[1-4]` | `YachtImage` (sortOrder 1-4) | Ordered gallery |
| `amenities[]` | `Amenity` + `YachtAmenity` | Normalized join table |
| `pricePerHour` | `PricingRule.basePrice` / `.hourlyRate` | Stored as Decimal(10,2) |

### Missing Fields (not available in source data)
| Prisma Field | Status | Notes |
|---|---|---|
| `Yacht.shortDescription` | NULL | Source only has full description |
| `Yacht.marina` | Set to "Chicago Harbor" | Same as `location` — needs client confirmation |
| `Yacht.isFeatured` | Default `false` | Client should designate featured yachts |
| `Yacht.instantBook` | Default `false` | Client should configure per-yacht |

## Approximated / Fallback Fields Requiring Client Confirmation

> [!WARNING]
> The following data points were inherited from the legacy website migration and may not be fully verified business facts:

1. **Year (all yachts):** Every yacht has `year: 2020`. This is likely a placeholder — the client should confirm actual model years.
2. **Capacity (all yachts):** Every yacht has `capacity: 12`. While plausible as a USCG-regulated limit, the client should confirm per-vessel.
3. **Cabins (all yachts):** Every yacht has `cabins: 2`. Needs client confirmation per vessel.
4. **Bathrooms (all yachts):** Every yacht has `bathrooms: 1`. Needs client confirmation per vessel.
5. **Yacht #3 Length:** Named "37′ Rinker 342" but has `length: 40`. The name and length are inconsistent — client should clarify.
6. **Descriptions:** All yachts share a nearly identical templated description. The client should provide unique descriptions.
7. **Images 2-5:** All yachts share the same 4 generic Unsplash stock images after the first (primary) image. Only image[0] per yacht is an actual vessel photo from `chicagoyachtsrental.com`.

## Pricing Limitations

> [!IMPORTANT]
> The source data only contains a single `pricePerHour` per yacht.

- This has been stored as a `PricingRule` with `dayType: WEEKDAY`, `timePeriod: CUSTOM`.
- **No Weekend pricing** exists in the source data.
- **No Morning/Afternoon/Evening period pricing** exists in the source data.
- **No seasonal pricing** exists in the source data.
- The client must configure these pricing variants separately in the admin panel.

## Image Source Limitations

- **Image[0]** for each yacht is hosted on `chicagoyachtsrental.com` — the actual vessel photo.
- **Images[1-4]** are generic Unsplash stock yacht photos shared across all yachts.
- No images have been rehosted or downloaded. URLs point to their original external sources.
- The client should eventually replace stock images with real vessel photography.

## What Was NOT Seeded (by design)

- Availability / TimeSlots
- Bookings / BookingHolds
- Customers / CRM data
- Payments / PaymentTransactions
- Conversations / Messages
- Notifications
- AdminUsers
- Reviews
