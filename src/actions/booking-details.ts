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

    // Convert Prisma Decimal objects & Dates to plain JS primitives for RSC Server Action serialization
    const serializedBooking = JSON.parse(JSON.stringify(booking));
    const serializedActivities = JSON.parse(JSON.stringify(activities));

    return { 
      success: true, 
      booking: serializedBooking,
      activities: serializedActivities
    };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
