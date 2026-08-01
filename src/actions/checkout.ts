"use server";

import { db } from "@/lib/db";
import { z } from "zod";

// Zod Schema for Guest Information Validation
export const guestCheckoutSchema = z.object({
  firstName: z.string().trim().min(2, "First name is too short").max(50, "First name is too long"),
  lastName: z.string().trim().min(2, "Last name is too short").max(50, "Last name is too long"),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().min(7, "Phone number is too short").max(20, "Phone number is too long"),
  guestCount: z.number().int("Guest count must be a whole number").min(1, "At least 1 guest required"),
  notes: z.string().trim().max(1000, "Notes are too long").optional(),
});

export type GuestCheckoutFormData = z.infer<typeof guestCheckoutSchema>;

export async function getCheckoutHoldAction(holdToken: string) {
  try {
    const hold = await db.bookingHold.findUnique({
      where: { id: holdToken },
      include: {
        yacht: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1
            }
          }
        }
      }
    });

    if (!hold) {
      return { status: "INVALID", message: "Hold not found" };
    }

    if (hold.status === "CONVERTED") {
      return { status: "CONVERTED", message: "This reservation has already been confirmed." };
    }

    if (hold.status === "EXPIRED" || hold.expiresAt < new Date()) {
      return { status: "EXPIRED", message: "Your reservation hold has expired." };
    }

    // Return Safe View Model
    return {
      status: "ACTIVE",
      hold: {
        id: hold.id,
        expiresAt: hold.expiresAt.toISOString(),
        startDateTime: hold.startDateTime.toISOString(),
        endDateTime: hold.endDateTime.toISOString(),
        subtotal: hold.subtotal?.toString() || "0",
        totalAmount: hold.totalAmount?.toString() || "0",
        depositAmount: hold.depositAmount?.toString() || "0",
        remainingBalance: hold.remainingBalance?.toString() || "0",
        yachtName: hold.yacht.name,
        yachtCapacity: hold.yacht.capacity,
        yachtImage: hold.yacht.images[0]?.url || null,
        yachtLocation: hold.yacht.location || hold.yacht.marina || "Chicago, IL",
        // Draft data if it exists
        customerFirstName: hold.customerFirstName,
        customerLastName: hold.customerLastName,
        customerEmail: hold.customerEmail,
        customerPhone: hold.customerPhone,
        guestCount: hold.guestCount,
        customerNotes: hold.customerNotes
      }
    };
  } catch (error) {
    console.error("Error fetching checkout hold:", error);
    return { status: "ERROR", message: "Failed to retrieve reservation hold" };
  }
}

export async function saveCheckoutGuestAction(holdToken: string, data: GuestCheckoutFormData) {
  try {
    // 1. Validation
    const parsed = guestCheckoutSchema.safeParse(data);
    if (!parsed.success) {
      return { status: "VALIDATION_ERROR", errors: parsed.error.flatten().fieldErrors };
    }

    // 2. Fetch Active Hold
    const hold = await db.bookingHold.findUnique({
      where: { id: holdToken },
      include: { yacht: true }
    });

    if (!hold) {
      return { status: "INVALID", message: "Hold not found" };
    }

    if (hold.status === "CONVERTED") {
      return { status: "REJECTED", message: "Cannot modify a converted hold" };
    }

    if (hold.status === "EXPIRED" || hold.expiresAt < new Date()) {
      return { status: "EXPIRED", message: "Your reservation hold has expired." };
    }

    // 3. Capacity Verification
    if (parsed.data.guestCount > hold.yacht.capacity) {
      return { status: "REJECTED", message: `Guest count exceeds maximum capacity of ${hold.yacht.capacity}` };
    }

    // 4. Save Draft
    await db.bookingHold.update({
      where: { id: holdToken },
      data: {
        customerFirstName: parsed.data.firstName,
        customerLastName: parsed.data.lastName,
        customerEmail: parsed.data.email,
        customerPhone: parsed.data.phone,
        guestCount: parsed.data.guestCount,
        customerNotes: parsed.data.notes || null,
      }
    });

    return { status: "SUCCESS" };
  } catch (error) {
    console.error("Error saving checkout guest details:", error);
    return { status: "ERROR", message: "Failed to save guest details" };
  }
}
