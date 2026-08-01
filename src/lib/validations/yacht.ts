import * as z from "zod"

export const yachtSchema = z.object({
  name: z.string().min(1, "Name is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().int().min(1900, "Invalid year").max(new Date().getFullYear() + 1),
  length: z.coerce.number().positive("Length must be positive"),
  capacity: z.coerce.number().int().positive("Capacity must be positive"),
  cabins: z.coerce.number().int().nonnegative(),
  bathrooms: z.coerce.number().int().nonnegative(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  pricePerHour: z.coerce.number().positive("Price must be positive"),
  rating: z.coerce.number().min(0).max(5).default(0),
  reviewCount: z.coerce.number().int().nonnegative().default(0),
  location: z.string().min(1, "Location is required"),
  images: z.array(z.string().url("Must be a valid URL")).min(1, "At least one image is required"),
  amenities: z.array(z.string()),
  availabilityStatus: z.enum(["Available Today", "Few Dates Left", "Fully Booked"]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  instantBook: z.boolean().default(false),
})

export type YachtFormValues = z.infer<typeof yachtSchema>
