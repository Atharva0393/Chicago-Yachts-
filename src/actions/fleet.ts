"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { YachtFormValues } from "@/lib/validations/yacht"
import { mapPrismaYachtToPublicModel } from "@/server/repositories/yacht.repository"
import { Yacht } from "@/types"
import { requireAdmin } from "@/lib/auth-server"

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function ensureUniqueSlug(baseSlug: string, currentId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await db.yacht.findUnique({ where: { slug } });
    if (!existing || (currentId && existing.id === currentId)) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function createYacht(data: YachtFormValues): Promise<{ success: boolean; yacht?: Yacht; error?: string }> {
  try {
    await requireAdmin();
    const baseSlug = generateSlug(data.name);
    const slug = await ensureUniqueSlug(baseSlug);

    const created = await db.$transaction(async (tx) => {
      // 1. Ensure all amenities exist
      for (const amenityName of data.amenities) {
        await tx.amenity.upsert({
          where: { name: amenityName },
          update: {},
          create: { name: amenityName, icon: "Check" }
        });
      }

      // 2. Create the yacht with nested relationships
      return await tx.yacht.create({
        data: {
          name: data.name,
          slug,
          manufacturer: data.manufacturer,
          model: data.model,
          year: data.year,
          length: data.length,
          capacity: data.capacity,
          cabins: data.cabins,
          bathrooms: data.bathrooms,
          description: data.description,
          location: data.location,
          isActive: data.isActive,
          isFeatured: data.isFeatured,
          instantBook: data.instantBook,
          
          images: {
            create: data.images.map((url, index) => ({
              url,
              sortOrder: index,
              isPrimary: index === 0
            }))
          },
          
          amenities: {
            create: data.amenities.map(name => ({
              amenity: { connect: { name } }
            }))
          },

          pricingRules: {
            create: [{
              title: "Base Rate",
              dayType: "WEEKDAY",
              timePeriod: "CUSTOM",
              basePrice: data.pricePerHour,
              hourlyRate: data.pricePerHour,
              isActive: true,
            }]
          }
        },
        include: {
          images: true,
          amenities: { include: { amenity: true } },
          pricingRules: true
        }
      });
    });

    revalidatePath("/admin/fleet");
    revalidatePath("/fleet");
    revalidatePath("/");
    
    return { success: true, yacht: mapPrismaYachtToPublicModel(created) };
  } catch (error) {
    console.error("Error creating yacht:", error);
    return { success: false, error: "Failed to create yacht" };
  }
}

export async function updateYacht(id: string, data: YachtFormValues): Promise<{ success: boolean; yacht?: Yacht; error?: string }> {
  try {
    await requireAdmin();
    const baseSlug = generateSlug(data.name);
    const slug = await ensureUniqueSlug(baseSlug, id);

    const updated = await db.$transaction(async (tx) => {
      // 1. Ensure all amenities exist
      for (const amenityName of data.amenities) {
        await tx.amenity.upsert({
          where: { name: amenityName },
          update: {},
          create: { name: amenityName, icon: "Check" }
        });
      }

      // 2. Clear old relationships
      await tx.yachtImage.deleteMany({ where: { yachtId: id } });
      await tx.yachtAmenity.deleteMany({ where: { yachtId: id } });

      // 3. Update yacht and recreate relationships
      const y = await tx.yacht.update({
        where: { id },
        data: {
          name: data.name,
          slug,
          manufacturer: data.manufacturer,
          model: data.model,
          year: data.year,
          length: data.length,
          capacity: data.capacity,
          cabins: data.cabins,
          bathrooms: data.bathrooms,
          description: data.description,
          location: data.location,
          isActive: data.isActive,
          isFeatured: data.isFeatured,
          instantBook: data.instantBook,
          
          images: {
            create: data.images.map((url, index) => ({
              url,
              sortOrder: index,
              isPrimary: index === 0
            }))
          },
          
          amenities: {
            create: data.amenities.map(name => ({
              amenity: { connect: { name } }
            }))
          }
        }
      });

      // 4. Update pricing
      const existingRules = await tx.pricingRule.findMany({ where: { yachtId: id } });
      if (existingRules.length > 0) {
        await tx.pricingRule.update({
          where: { id: existingRules[0].id },
          data: {
            basePrice: data.pricePerHour,
            hourlyRate: data.pricePerHour,
          }
        });
      } else {
        await tx.pricingRule.create({
          data: {
            yachtId: id,
            title: "Base Rate",
            dayType: "WEEKDAY",
            timePeriod: "CUSTOM",
            basePrice: data.pricePerHour,
            hourlyRate: data.pricePerHour,
            isActive: true,
          }
        });
      }

      // Return fully populated
      return await tx.yacht.findUniqueOrThrow({
        where: { id },
        include: {
          images: true,
          amenities: { include: { amenity: true } },
          pricingRules: true
        }
      });
    });

    revalidatePath("/admin/fleet");
    revalidatePath("/fleet");
    revalidatePath(`/fleet/${slug}`);
    revalidatePath("/");
    
    return { success: true, yacht: mapPrismaYachtToPublicModel(updated) };
  } catch (error) {
    console.error("Error updating yacht:", error);
    return { success: false, error: "Failed to update yacht" };
  }
}

export async function deleteYacht(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    // Soft delete instead of hard delete to preserve bookings and history
    await db.yacht.update({
      where: { id },
      data: { isActive: false }
    });
    
    revalidatePath("/admin/fleet");
    revalidatePath("/fleet");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting yacht:", error);
    return { success: false, error: "Failed to delete yacht" };
  }
}
