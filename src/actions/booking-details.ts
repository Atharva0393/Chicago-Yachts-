"use server"

import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth-server"
import { bookingLifecycleService } from "@/server/services/booking-lifecycle.service"

export async function getBookingDetailed(id: string) {
  try {
    await requireAdmin();
    
    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        yacht: true,
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        timeSlots: true
      }
    });

    if (!booking) return { success: false, error: "Not found" };

    const activities = await bookingLifecycleService.getBookingAuditTrail(id);

    return { 
      success: true, 
      booking,
      activities
    };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
