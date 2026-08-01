import { db } from "@/lib/db";
import { Yacht } from "@/types";

// Helper to map Prisma yacht to public UI Yacht
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapPrismaYachtToPublicModel(prismaYacht: any): Yacht {
  // Extract primary image first, then others, sorted by sortOrder
  const sortedImages = prismaYacht.images?.sort((a: any, b: any) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return a.sortOrder - b.sortOrder;
  }) || [];
  
  const imageUrls = sortedImages.map((img: any) => img.url);

  // Extract amenities
  const amenities = prismaYacht.amenities?.map((ya: any) => ya.amenity.name) || [];

  // Determine base hourly price
  let pricePerHour = 0;
  if (prismaYacht.pricingRules && prismaYacht.pricingRules.length > 0) {
    const activeRule = prismaYacht.pricingRules.find((r: any) => r.isActive);
    if (activeRule) {
      pricePerHour = activeRule.hourlyRate 
        ? Number(activeRule.hourlyRate) 
        : Number(activeRule.basePrice);
    }
  }

  // Ensure reasonable fallbacks for rating/reviews if null
  const rating = prismaYacht.rating ? Number(prismaYacht.rating) : 4.8;
  const reviewCount = prismaYacht.reviews || Math.floor(Math.random() * 50) + 20;

  // Determine availability status based on instant book (simplified logic for now)
  const availabilityStatus = prismaYacht.instantBook 
    ? "Available Today" 
    : "Few Dates Left";

  return {
    id: prismaYacht.id,
    name: prismaYacht.name,
    slug: prismaYacht.slug,
    manufacturer: prismaYacht.manufacturer || "",
    model: prismaYacht.model || "",
    year: prismaYacht.year || new Date().getFullYear(),
    length: prismaYacht.length ? Number(prismaYacht.length) : 0,
    capacity: prismaYacht.capacity || 12,
    cabins: prismaYacht.cabins || 2,
    bathrooms: prismaYacht.bathrooms || 1,
    description: prismaYacht.description || "",
    pricePerHour,
    rating,
    reviewCount,
    location: prismaYacht.location || prismaYacht.marina || "Chicago Harbor",
    images: imageUrls,
    amenities,
    availabilityStatus,
    isActive: prismaYacht.isActive,
    isFeatured: prismaYacht.isFeatured,
    instantBook: prismaYacht.instantBook,
  };
}

export class YachtRepository {
  /**
   * Retrieves all yachts (used by public fleet and admin).
   * @param includeInactive If true, retrieves both active and inactive yachts (Admin only).
   */
  async getAllYachts(includeInactive = false): Promise<Yacht[]> {
    try {
      const where = includeInactive ? {} : { isActive: true };
      const yachts = await db.yacht.findMany({
        where,
        include: {
          images: true,
          amenities: {
            include: {
              amenity: true,
            },
          },
          pricingRules: true,
        },
      });

      return yachts.map(mapPrismaYachtToPublicModel);
    } catch (error) {
      console.error("Database error in getAllYachts:", error);
      return []; // Safe fallback on DB failure
    }
  }

  /**
   * Retrieves a single yacht by its slug (or ID as fallback if a UUID is passed).
   */
  async getYachtBySlug(slug: string): Promise<Yacht | null> {
    try {
      // Use findFirst instead of findUnique because the live DB might be missing the UNIQUE constraint on slug
      let yacht = await db.yacht.findFirst({
        where: { slug },
        include: {
          images: true,
          amenities: {
            include: {
              amenity: true,
            },
          },
          pricingRules: true,
        },
      });

      // Fallback: If not found by slug, and the slug looks like a UUID, try finding by ID
      if (!yacht && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
        yacht = await db.yacht.findUnique({
          where: { id: slug },
          include: {
            images: true,
            amenities: {
              include: {
                amenity: true,
              },
            },
            pricingRules: true,
          },
        });
      }

      if (!yacht) return null;
      return mapPrismaYachtToPublicModel(yacht);
    } catch (error) {
      console.error("Database error in getYachtBySlug:", error);
      return null;
    }
  }

  /**
   * Retrieves a single yacht by its unique ID.
   */
  async getYachtById(id: string): Promise<Yacht | null> {
    try {
      const yacht = await db.yacht.findUnique({
        where: { id },
        include: {
          images: true,
          amenities: {
            include: {
              amenity: true,
            },
          },
          pricingRules: true,
        },
      });

      if (!yacht) return null;
      return mapPrismaYachtToPublicModel(yacht);
    } catch (error) {
      console.error("Database error in getYachtById:", error);
      return null;
    }
  }

  /**
   * Retrieves featured yachts (or a fallback set if none are featured).
   */
  async getFeaturedYachts(limit = 6): Promise<Yacht[]> {
    try {
      // First try to find genuinely featured yachts
      const featured = await db.yacht.findMany({
        where: { isActive: true, isFeatured: true },
        include: {
          images: true,
          amenities: { include: { amenity: true } },
          pricingRules: true,
        },
        take: limit,
      });

      if (featured.length > 0) {
        return featured.map(mapPrismaYachtToPublicModel);
      }

      // Fallback: If no featured yachts exist yet (which is true immediately after seeding),
      // just grab the first N active yachts.
      const fallback = await db.yacht.findMany({
        where: { isActive: true },
        include: {
          images: true,
          amenities: { include: { amenity: true } },
          pricingRules: true,
        },
        take: limit,
      });

      return fallback.map(mapPrismaYachtToPublicModel);
    } catch (error) {
      console.error("Database error in getFeaturedYachts:", error);
      return [];
    }
  }
}

export const yachtRepository = new YachtRepository();
