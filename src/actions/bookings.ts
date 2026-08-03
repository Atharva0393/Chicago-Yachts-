"use server"

import { revalidatePath } from "next/cache"
import { bookingRepository } from "@/server/repositories/booking.repository"
import { BookingStatus } from "@prisma/client"
import { requireAdmin } from "@/lib/auth-server"

export async function updateBookingStatus(id: string, status: BookingStatus) {
  try {
    await requireAdmin();
    const booking = await bookingRepository.updateBookingStatus(id, status)
    revalidatePath("/admin/bookings")
    revalidatePath("/admin") // For dashboard metrics
    return { success: true, booking }
  } catch (error) {
    return { success: false, error: "Failed to update booking status" }
  }
}
