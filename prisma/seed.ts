/**
 * prisma/seed.ts
 * 
 * Idempotent database seeder for Chicago Yachts.
 * 
 * DATA SOURCE: src/data/yachts.ts
 *   This is the single source of truth for the current fleet, as consumed 
 *   by data.service.ts → useData hook → Fleet page + Yacht detail pages.
 *
 * STRATEGY: Uses upsert keyed on deterministic identifiers (slug for Yacht,
 *   name for Amenity) to ensure running this script multiple times never 
 *   creates duplicates.
 *
 * DOES NOT SEED: Availability, TimeSlots, Bookings, Customers, Payments,
 *   CRM data, Conversations, Notifications, or AdminUsers.
 */

import { PrismaClient, DayType, TimePeriod, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

// ---------------------------------------------------------------------------
// SOURCE DATA — copied from src/data/yachts.ts to avoid import path issues
// with tsx runner. This is a direct 1:1 copy of the current production data.
// ---------------------------------------------------------------------------

interface SourceYacht {
  id: string
  name: string
  slug: string
  manufacturer: string
  model: string
  year: number
  length: number
  capacity: number
  cabins: number
  bathrooms: number
  description: string
  pricePerHour: number
  rating: number
  reviewCount: number
  location: string
  images: string[]
  amenities: string[]
}

const SOURCE_YACHTS: SourceYacht[] = [
  {
    id: "34-ft-rinker-fiesta-vee-yacht",
    name: "34'ft Rinker Fiesta Vee Yacht",
    slug: "34-ft-rinker-fiesta-vee-yacht",
    manufacturer: "Rinker",
    model: "Rinker Cruiser",
    year: 2020,
    length: 34,
    capacity: 12,
    cabins: 2,
    bathrooms: 1,
    description: "Experience unparalleled luxury aboard this beautiful 34ft yacht in Chicago. Perfectly suited for cruising the Chicago skyline, this vessel offers spacious decks, a premium sound system, and a dedicated crew to cater to your every need.",
    pricePerHour: 240,
    rating: 4.8,
    reviewCount: 80,
    location: "Chicago Harbor",
    images: ["https://chicagoyachtsrental.com/wp-content/uploads/2026/06/Rinker34.NDzyC-yM.jpg", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop", "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"],
    amenities: ["Captain Included", "Bluetooth Audio", "Cooler with Ice", "Floating Mat", "Restroom"]
  },
  {
    id: "31-ft-sea-ray-sundancer-yacht",
    name: "31'ft Sea Ray Sundancer Yacht",
    slug: "31-ft-sea-ray-sundancer-yacht",
    manufacturer: "Sea Ray",
    model: "Sea Ray Cruiser",
    year: 2020,
    length: 31,
    capacity: 12,
    cabins: 2,
    bathrooms: 1,
    description: "Experience unparalleled luxury aboard this beautiful 31ft yacht in Chicago. Perfectly suited for cruising the Chicago skyline, this vessel offers spacious decks, a premium sound system, and a dedicated crew to cater to your every need.",
    pricePerHour: 250,
    rating: 4.7,
    reviewCount: 102,
    location: "Chicago Harbor",
    images: ["https://chicagoyachtsrental.com/wp-content/uploads/2026/06/SeaRay31.fbZ8UzUX.jpg", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop", "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"],
    amenities: ["Captain Included", "Bluetooth Audio", "Cooler with Ice", "Floating Mat", "Restroom"]
  },
  {
    id: "37-rinker-342-fiesta-vee-yacht",
    name: "37\u2032 Rinker 342 Fiesta Vee Yacht",
    slug: "37-rinker-342-fiesta-vee-yacht",
    manufacturer: "Rinker",
    model: "Rinker Cruiser",
    year: 2020,
    length: 40,
    capacity: 12,
    cabins: 2,
    bathrooms: 1,
    description: "Experience unparalleled luxury aboard this beautiful 40ft yacht in Chicago. Perfectly suited for cruising the Chicago skyline, this vessel offers spacious decks, a premium sound system, and a dedicated crew to cater to your every need.",
    pricePerHour: 280,
    rating: 4.6,
    reviewCount: 47,
    location: "Chicago Harbor",
    images: ["https://chicagoyachtsrental.com/wp-content/uploads/2026/06/37ftrinker.Cio-6YlD-scaled-e1780856492627.jpg", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop", "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"],
    amenities: ["Captain Included", "Bluetooth Audio", "Cooler with Ice", "Floating Mat", "Restroom"]
  },
  {
    id: "37-ft-sea-ray-drift-yacht",
    name: "37'ft Sea Ray Drift Yacht",
    slug: "37-ft-sea-ray-drift-yacht",
    manufacturer: "Sea Ray",
    model: "Sea Ray Cruiser",
    year: 2020,
    length: 37,
    capacity: 12,
    cabins: 2,
    bathrooms: 1,
    description: "Experience unparalleled luxury aboard this beautiful 37ft yacht in Chicago. Perfectly suited for cruising the Chicago skyline, this vessel offers spacious decks, a premium sound system, and a dedicated crew to cater to your every need.",
    pricePerHour: 300,
    rating: 4.7,
    reviewCount: 47,
    location: "Chicago Harbor",
    images: ["https://chicagoyachtsrental.com/wp-content/uploads/2026/06/SeaRay37.B2Akw3p3.jpg", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop", "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"],
    amenities: ["Captain Included", "Bluetooth Audio", "Cooler with Ice", "Floating Mat", "Restroom"]
  },
  {
    id: "46-ft-legacy-luxury-yacht",
    name: "46'ft Legacy Luxury Yacht",
    slug: "46-ft-legacy-luxury-yacht",
    manufacturer: "Legacy",
    model: "Legacy Cruiser",
    year: 2020,
    length: 46,
    capacity: 12,
    cabins: 2,
    bathrooms: 1,
    description: "Experience unparalleled luxury aboard this beautiful 46ft yacht in Chicago. Perfectly suited for cruising the Chicago skyline, this vessel offers spacious decks, a premium sound system, and a dedicated crew to cater to your every need.",
    pricePerHour: 320,
    rating: 4.6,
    reviewCount: 50,
    location: "Chicago Harbor",
    images: ["https://chicagoyachtsrental.com/wp-content/uploads/2026/06/31b5a6ee-e009-47e4-b453-f6ff8618280a_t-1-e1780856730122.webp", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop", "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"],
    amenities: ["Captain Included", "Bluetooth Audio", "Cooler with Ice", "Floating Mat", "Restroom"]
  },
  {
    id: "42-ft-sea-ray-horizon-yacht",
    name: "42'ft Sea Ray Horizon Yacht",
    slug: "42-ft-sea-ray-horizon-yacht",
    manufacturer: "Sea Ray",
    model: "Sea Ray Cruiser",
    year: 2020,
    length: 42,
    capacity: 12,
    cabins: 2,
    bathrooms: 1,
    description: "Experience unparalleled luxury aboard this beautiful 42ft yacht in Chicago. Perfectly suited for cruising the Chicago skyline, this vessel offers spacious decks, a premium sound system, and a dedicated crew to cater to your every need.",
    pricePerHour: 320,
    rating: 4.5,
    reviewCount: 56,
    location: "Chicago Harbor",
    images: ["https://chicagoyachtsrental.com/wp-content/uploads/2026/06/a55035b9-0abe-412a-bb5f-d9a1ed17383a_t-2.png", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop", "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"],
    amenities: ["Captain Included", "Bluetooth Audio", "Cooler with Ice", "Floating Mat", "Restroom"]
  },
  {
    id: "46-ft-sea-ray-monarch",
    name: "46'ft Sea Ray Monarch",
    slug: "46-ft-sea-ray-monarch",
    manufacturer: "Sea Ray",
    model: "Sea Ray Cruiser",
    year: 2020,
    length: 46,
    capacity: 12,
    cabins: 2,
    bathrooms: 1,
    description: "Experience unparalleled luxury aboard this beautiful 46ft yacht in Chicago. Perfectly suited for cruising the Chicago skyline, this vessel offers spacious decks, a premium sound system, and a dedicated crew to cater to your every need.",
    pricePerHour: 320,
    rating: 4.7,
    reviewCount: 27,
    location: "Chicago Harbor",
    images: ["https://chicagoyachtsrental.com/wp-content/uploads/2026/06/SeaRay46.DiPpgfN6-1.jpg", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop", "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"],
    amenities: ["Captain Included", "Bluetooth Audio", "Cooler with Ice", "Floating Mat", "Restroom"]
  },
  {
    id: "45-ft-sea-ray-power-boat-surge",
    name: "45'ft Sea Ray Power Boat Surge",
    slug: "45-ft-sea-ray-power-boat-surge",
    manufacturer: "Sea Ray",
    model: "Sea Ray Cruiser",
    year: 2020,
    length: 45,
    capacity: 12,
    cabins: 2,
    bathrooms: 1,
    description: "Experience unparalleled luxury aboard this beautiful 45ft yacht in Chicago. Perfectly suited for cruising the Chicago skyline, this vessel offers spacious decks, a premium sound system, and a dedicated crew to cater to your every need.",
    pricePerHour: 320,
    rating: 4.8,
    reviewCount: 91,
    location: "Chicago Harbor",
    images: ["https://chicagoyachtsrental.com/wp-content/uploads/2026/06/SeaRay45.CkMpdB6v.jpg", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop", "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"],
    amenities: ["Captain Included", "Bluetooth Audio", "Cooler with Ice", "Floating Mat", "Restroom"]
  },
  {
    id: "46-ft-sea-ray-prestige-yacht",
    name: "46'ft Sea Ray Prestige Yacht",
    slug: "46-ft-sea-ray-prestige-yacht",
    manufacturer: "Sea Ray",
    model: "Sea Ray Cruiser",
    year: 2020,
    length: 46,
    capacity: 12,
    cabins: 2,
    bathrooms: 1,
    description: "Experience unparalleled luxury aboard this beautiful 46ft yacht in Chicago. Perfectly suited for cruising the Chicago skyline, this vessel offers spacious decks, a premium sound system, and a dedicated crew to cater to your every need.",
    pricePerHour: 320,
    rating: 4.6,
    reviewCount: 39,
    location: "Chicago Harbor",
    images: ["https://chicagoyachtsrental.com/wp-content/uploads/2026/06/639b9162-9e22-46e5-a363-83cc328726b4_t-1.webp", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop", "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"],
    amenities: ["Captain Included", "Bluetooth Audio", "Cooler with Ice", "Floating Mat", "Restroom"]
  },
  {
    id: "51-ft-sea-ray-apex-yacht",
    name: "51'ft Sea Ray Apex Yacht",
    slug: "51-ft-sea-ray-apex-yacht",
    manufacturer: "Sea Ray",
    model: "Sea Ray Cruiser",
    year: 2020,
    length: 51,
    capacity: 12,
    cabins: 2,
    bathrooms: 1,
    description: "Experience unparalleled luxury aboard this beautiful 51ft yacht in Chicago. Perfectly suited for cruising the Chicago skyline, this vessel offers spacious decks, a premium sound system, and a dedicated crew to cater to your every need.",
    pricePerHour: 349,
    rating: 4.7,
    reviewCount: 20,
    location: "Chicago Harbor",
    images: ["https://chicagoyachtsrental.com/wp-content/uploads/2026/06/425dfc01-3daf-4ae9-8075-6857caade195_t-1-3.png", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop", "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"],
    amenities: ["Captain Included", "Bluetooth Audio", "Cooler with Ice", "Floating Mat", "Restroom"]
  },
  {
    id: "51-ft-sea-ray-summit-yacht",
    name: "51'ft Sea Ray Summit Yacht",
    slug: "51-ft-sea-ray-summit-yacht",
    manufacturer: "Sea Ray",
    model: "Sea Ray Cruiser",
    year: 2020,
    length: 51,
    capacity: 12,
    cabins: 2,
    bathrooms: 1,
    description: "Experience unparalleled luxury aboard this beautiful 51ft yacht in Chicago. Perfectly suited for cruising the Chicago skyline, this vessel offers spacious decks, a premium sound system, and a dedicated crew to cater to your every need.",
    pricePerHour: 349,
    rating: 4.5,
    reviewCount: 78,
    location: "Chicago Harbor",
    images: ["https://chicagoyachtsrental.com/wp-content/uploads/2026/06/23f690c1-5297-4895-a788-3c8660ac6e77_t-1-1.png", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop", "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"],
    amenities: ["Captain Included", "Bluetooth Audio", "Cooler with Ice", "Floating Mat", "Restroom"]
  },
  {
    id: "44-sea-ray-express-luxury-motor-yacht-rental-in-chicago",
    name: "44' Sea Ray Express Luxury Motor Yacht Rental in Chicago",
    slug: "44-sea-ray-express-luxury-motor-yacht-rental-in-chicago",
    manufacturer: "Sea Ray",
    model: "Sea Ray Cruiser",
    year: 2020,
    length: 44,
    capacity: 12,
    cabins: 2,
    bathrooms: 1,
    description: "Experience unparalleled luxury aboard this beautiful 44ft yacht in Chicago. Perfectly suited for cruising the Chicago skyline, this vessel offers spacious decks, a premium sound system, and a dedicated crew to cater to your every need.",
    pricePerHour: 349,
    rating: 4.6,
    reviewCount: 48,
    location: "Chicago Harbor",
    images: ["https://chicagoyachtsrental.com/wp-content/uploads/2026/06/processed-20-e1780858309876.webp", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop", "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"],
    amenities: ["Captain Included", "Bluetooth Audio", "Cooler with Ice", "Floating Mat", "Restroom"]
  },
  {
    id: "enjoy-chicago-46-beautiful-sea-ray-yacht-perfect-for-parties",
    name: "Enjoy Chicago! 46' Beautiful Sea Ray Yacht - Perfect for Parties",
    slug: "enjoy-chicago-46-beautiful-sea-ray-yacht-perfect-for-parties",
    manufacturer: "Sea Ray",
    model: "Sea Ray Cruiser",
    year: 2020,
    length: 46,
    capacity: 12,
    cabins: 2,
    bathrooms: 1,
    description: "Experience unparalleled luxury aboard this beautiful 46ft yacht in Chicago. Perfectly suited for cruising the Chicago skyline, this vessel offers spacious decks, a premium sound system, and a dedicated crew to cater to your every need.",
    pricePerHour: 400,
    rating: 4.5,
    reviewCount: 94,
    location: "Chicago Harbor",
    images: ["https://chicagoyachtsrental.com/wp-content/uploads/2026/04/processed-14-e1775366139201-636x426-1.jpg", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop", "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"],
    amenities: ["Captain Included", "Bluetooth Audio", "Cooler with Ice", "Floating Mat", "Restroom"]
  },
  {
    id: "enjoy-chicago-in-this-45-sea-ray-express-cruiser-yacht",
    name: "Enjoy Chicago in this 45' Sea Ray Express Cruiser Yacht",
    slug: "enjoy-chicago-in-this-45-sea-ray-express-cruiser-yacht",
    manufacturer: "Sea Ray",
    model: "Sea Ray Cruiser",
    year: 2020,
    length: 45,
    capacity: 12,
    cabins: 2,
    bathrooms: 1,
    description: "Experience unparalleled luxury aboard this beautiful 45ft yacht in Chicago. Perfectly suited for cruising the Chicago skyline, this vessel offers spacious decks, a premium sound system, and a dedicated crew to cater to your every need.",
    pricePerHour: 400,
    rating: 4.8,
    reviewCount: 64,
    location: "Chicago Harbor",
    images: ["https://chicagoyachtsrental.com/wp-content/uploads/2026/04/processed-42-636x426-1-1.jpg", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop", "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2000&auto=format&fit=crop", "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"],
    amenities: ["Captain Included", "Bluetooth Audio", "Cooler with Ice", "Floating Mat", "Restroom"]
  }
]

// ---------------------------------------------------------------------------
// VALIDATION
// ---------------------------------------------------------------------------

function validateSourceData(): void {
  const slugs = new Set<string>()
  for (const y of SOURCE_YACHTS) {
    if (!y.name || y.name.trim() === '') throw new Error(`Yacht has empty name: ${y.id}`)
    if (!y.slug || y.slug.trim() === '') throw new Error(`Yacht has empty slug: ${y.id}`)
    if (slugs.has(y.slug)) throw new Error(`Duplicate slug detected: ${y.slug}`)
    slugs.add(y.slug)
    if (y.capacity <= 0) throw new Error(`Invalid capacity for ${y.slug}: ${y.capacity}`)
    if (y.length <= 0) throw new Error(`Invalid length for ${y.slug}: ${y.length}`)
    if (y.pricePerHour <= 0) throw new Error(`Invalid price for ${y.slug}: ${y.pricePerHour}`)
    if (y.images.length === 0) throw new Error(`No images for ${y.slug}`)
    for (const url of y.images) {
      if (!url.startsWith('http')) throw new Error(`Invalid image URL for ${y.slug}: ${url}`)
    }
  }
  console.log(`✅ Validation passed: ${SOURCE_YACHTS.length} yachts, all slugs unique, all fields valid`)
}

// ---------------------------------------------------------------------------
// SEEDING
// ---------------------------------------------------------------------------

async function seedAmenities(): Promise<Map<string, string>> {
  // Collect all unique amenity names across all yachts
  const uniqueAmenities = new Set<string>()
  for (const y of SOURCE_YACHTS) {
    for (const a of y.amenities) {
      uniqueAmenities.add(a.trim())
    }
  }

  const amenityMap = new Map<string, string>() // name → id

  for (const name of uniqueAmenities) {
    const amenity = await prisma.amenity.upsert({
      where: { name },
      update: {},  // No update needed — amenity names are stable
      create: { name },
    })
    amenityMap.set(name, amenity.id)
  }

  console.log(`✅ Amenities seeded: ${amenityMap.size} unique amenities`)
  return amenityMap
}

async function seedYachts(amenityMap: Map<string, string>): Promise<void> {
  for (const src of SOURCE_YACHTS) {
    // Upsert yacht keyed on unique slug
    const yacht = await prisma.yacht.upsert({
      where: { slug: src.slug },
      update: {
        name: src.name,
        description: src.description,
        manufacturer: src.manufacturer,
        make: src.manufacturer, // make = manufacturer (same source)
        model: src.model,
        year: src.year,
        length: src.length,
        capacity: src.capacity,
        cabins: src.cabins,
        bathrooms: src.bathrooms,
        location: src.location,
        marina: 'Chicago Harbor', // All source yachts share this location
        isActive: true,
        isFeatured: false,
        instantBook: false,
      },
      create: {
        slug: src.slug,
        name: src.name,
        description: src.description,
        manufacturer: src.manufacturer,
        make: src.manufacturer,
        model: src.model,
        year: src.year,
        length: src.length,
        capacity: src.capacity,
        cabins: src.cabins,
        bathrooms: src.bathrooms,
        location: src.location,
        marina: 'Chicago Harbor',
        isActive: true,
        isFeatured: false,
        instantBook: false,
      },
    })

    // --- IMAGES ---
    // Delete existing images for this yacht and re-insert to maintain ordering
    // This is safe for seed data and ensures idempotency of image ordering
    await prisma.yachtImage.deleteMany({ where: { yachtId: yacht.id } })

    for (let i = 0; i < src.images.length; i++) {
      await prisma.yachtImage.create({
        data: {
          url: src.images[i],
          altText: `${src.name} - Image ${i + 1}`,
          sortOrder: i,
          isPrimary: i === 0,  // First image from source is the primary
          yachtId: yacht.id,
        },
      })
    }

    // --- AMENITIES (join table) ---
    // Clear existing relationships and re-insert
    await prisma.yachtAmenity.deleteMany({ where: { yachtId: yacht.id } })

    for (const amenityName of src.amenities) {
      const amenityId = amenityMap.get(amenityName.trim())
      if (amenityId) {
        await prisma.yachtAmenity.create({
          data: {
            yachtId: yacht.id,
            amenityId,
          },
        })
      }
    }

    // --- PRICING RULE ---
    // Source data only has a single pricePerHour value per yacht.
    // We store this as a CUSTOM/WEEKDAY base pricing rule.
    // Weekend/Morning/Afternoon/Evening variants are NOT available in source data.
    // 
    // LIMITATION: This is a single flat hourly rate. The business may need to
    // configure Weekday vs Weekend and time-period pricing separately.
    const existingRule = await prisma.pricingRule.findFirst({
      where: { yachtId: yacht.id, title: 'Base Hourly Rate' },
    })

    if (existingRule) {
      await prisma.pricingRule.update({
        where: { id: existingRule.id },
        data: {
          basePrice: new Prisma.Decimal(src.pricePerHour),
          hourlyRate: new Prisma.Decimal(src.pricePerHour),
          isActive: true,
        },
      })
    } else {
      await prisma.pricingRule.create({
        data: {
          title: 'Base Hourly Rate',
          dayType: DayType.WEEKDAY,
          timePeriod: TimePeriod.CUSTOM,
          basePrice: new Prisma.Decimal(src.pricePerHour),
          hourlyRate: new Prisma.Decimal(src.pricePerHour),
          minDuration: 2,
          maxDuration: 24,
          isActive: true,
          yachtId: yacht.id,
        },
      })
    }

    console.log(`  ✓ ${src.name} (${src.images.length} images, ${src.amenities.length} amenities, $${src.pricePerHour}/hr)`)
  }
}

// ---------------------------------------------------------------------------
// VERIFICATION
// ---------------------------------------------------------------------------

async function verify(): Promise<void> {
  const yachtCount = await prisma.yacht.count()
  const imageCount = await prisma.yachtImage.count()
  const amenityCount = await prisma.amenity.count()
  const yachtAmenityCount = await prisma.yachtAmenity.count()
  const pricingRuleCount = await prisma.pricingRule.count()

  console.log(`\n📊 DATABASE VERIFICATION:`)
  console.log(`  Yacht:        ${yachtCount}`)
  console.log(`  YachtImage:   ${imageCount}`)
  console.log(`  Amenity:      ${amenityCount}`)
  console.log(`  YachtAmenity: ${yachtAmenityCount}`)
  console.log(`  PricingRule:  ${pricingRuleCount}`)

  // Verify each yacht has images and amenities
  const yachts = await prisma.yacht.findMany({
    include: {
      images: true,
      amenities: { include: { amenity: true } },
      pricingRules: true,
    },
  })

  for (const y of yachts) {
    const hasPrimary = y.images.some(img => img.isPrimary)
    if (!hasPrimary) console.warn(`  ⚠️  Yacht "${y.name}" has no primary image`)
    if (y.images.length === 0) console.warn(`  ⚠️  Yacht "${y.name}" has no images`)
    if (y.amenities.length === 0) console.warn(`  ⚠️  Yacht "${y.name}" has no amenities`)
    if (y.pricingRules.length === 0) console.warn(`  ⚠️  Yacht "${y.name}" has no pricing rules`)
  }

  if (yachtCount !== SOURCE_YACHTS.length) {
    console.error(`\n❌ MISMATCH: Source has ${SOURCE_YACHTS.length} yachts but DB has ${yachtCount}`)
  } else {
    console.log(`\n✅ Yacht count matches source: ${yachtCount}`)
  }
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

async function main() {
  console.log('🚀 Chicago Yachts Database Seeder\n')
  console.log('--- Step 1: Validating source data ---')
  validateSourceData()

  console.log('\n--- Step 2: Seeding amenities ---')
  const amenityMap = await seedAmenities()

  console.log('\n--- Step 3: Seeding yachts + images + pricing ---')
  await seedYachts(amenityMap)

  console.log('\n--- Step 4: Verifying database ---')
  await verify()

  console.log('\n🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
