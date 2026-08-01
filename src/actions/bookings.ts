"use server"

import { revalidatePath } from "next/cache"
import { dataService } from "@/services/data.service"
import { Booking } from "@/types"

export async function updateBookingStatus(id: string, status: Booking["status"]) {
  try {
    const booking = await dataService.updateBookingStatus(id, status)
    revalidatePath("/admin/bookings")
    revalidatePath("/admin") // For dashboard metrics
    return { success: true, booking }
  } catch (error) {
    return { success: false, error: "Failed to update booking status" }
  }
}
