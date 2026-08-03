"use server"

import { revalidatePath } from "next/cache"
import { BookingStatus } from "@prisma/client"
import { requireAdmin } from "@/lib/auth-server"
import { bookingLifecycleService } from "@/server/services/booking-lifecycle.service"

export async function updateBookingStatus(id: string, status: BookingStatus) {
  try {
    const session = await requireAdmin();
    const adminId = (session.user as any)?.id || "admin";
    const booking = await bookingLifecycleService.updateBookingStatus(id, status, adminId)
    revalidatePath("/admin/bookings")
    revalidatePath("/admin") // For dashboard metrics
    revalidatePath("/admin/calendar")
    return { success: true, booking }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update booking status" }
  }
}

export async function cancelBooking(id: string, reason: string) {
  try {
    const session = await requireAdmin();
    const adminId = (session.user as any)?.id || "admin";
    const booking = await bookingLifecycleService.cancelBooking(id, reason, adminId)
    revalidatePath("/admin/bookings")
    revalidatePath("/admin")
    revalidatePath("/admin/calendar")
    return { success: true, booking }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to cancel booking" }
  }
}

export async function addBookingNote(id: string, content: string) {
  try {
    const session = await requireAdmin();
    const adminId = (session.user as any)?.id || "admin";
    const note = await bookingLifecycleService.addBookingNote(id, content, adminId)
    revalidatePath("/admin/bookings")
    return { success: true, note }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to add booking note" }
  }
}
