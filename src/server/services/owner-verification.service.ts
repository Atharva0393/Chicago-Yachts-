import { db } from "@/lib/db";
import { VerificationStatus, ActivityType } from "@prisma/client";

export class OwnerVerificationService {
  /**
   * Creates an owner availability verification request for a booking.
   * Prevents duplicate active verification requests (idempotent).
   */
  async createVerificationRequest(bookingId: string) {
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { yacht: true, customer: true, timeSlots: true }
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.bookingStatus === "CANCELLED" || booking.bookingStatus === "EXPIRED") {
      throw new Error("Cannot create verification request for cancelled or expired booking");
    }

    // Check for existing pending request (Idempotency)
    const existingRequest = await db.ownerVerification.findFirst({
      where: {
        bookingId,
        status: "PENDING"
      }
    });

    if (existingRequest) {
      return existingRequest;
    }

    const timeSlotStr = booking.timeSlots.length > 0 
      ? `${booking.timeSlots[0].startTime} - ${booking.timeSlots[booking.timeSlots.length - 1].endTime}`
      : "CUSTOM";

    const verification = await db.ownerVerification.create({
      data: {
        bookingId: booking.id,
        yachtId: booking.yachtId,
        requestedDate: booking.startDateTime,
        requestedTimeSlot: timeSlotStr,
        status: "PENDING"
      }
    });

    // Log audit activity
    await db.customerActivity.create({
      data: {
        type: "OWNER_AVAILABILITY_REQUESTED" as ActivityType,
        description: `Owner availability verification requested for ${booking.yacht.name} on ${booking.startDateTime.toLocaleDateString()}`,
        customerId: booking.customerId,
        metadata: {
          bookingId: booking.id,
          verificationId: verification.id,
          yachtId: booking.yachtId
        }
      }
    });

    return verification;
  }

  /**
   * Owner / Admin marks yacht as AVAILABLE.
   * Performs server-side concurrency check, transitions verification to AVAILABLE and booking to CONFIRMED.
   */
  async respondAvailable(verificationId: string, adminId: string, notes?: string) {
    const verification = await db.ownerVerification.findUnique({
      where: { id: verificationId },
      include: { booking: { include: { timeSlots: true, customer: true, yacht: true } } }
    });

    if (!verification) {
      throw new Error("Verification request not found");
    }

    if (verification.status !== "PENDING") {
      throw new Error(`Verification request is already ${verification.status}`);
    }

    const booking = verification.booking;

    if (booking.bookingStatus === "CANCELLED" || booking.bookingStatus === "EXPIRED") {
      throw new Error("Cannot confirm availability for a cancelled or expired booking");
    }

    // Concurrency check: Ensure no other CONFIRMED booking exists for the exact same time slots
    if (booking.timeSlots.length > 0) {
      const slotIds = booking.timeSlots.map(s => s.id);
      const conflictingSlot = await db.timeSlot.findFirst({
        where: {
          id: { in: slotIds },
          bookingId: { not: null, notIn: [booking.id] },
          booking: { bookingStatus: "CONFIRMED" }
        }
      });

      if (conflictingSlot) {
        throw new Error("Double-booking protection: A conflicting confirmed booking already exists for this time slot.");
      }
    }

    // Update verification status
    const updatedVerification = await db.ownerVerification.update({
      where: { id: verificationId },
      data: {
        status: "AVAILABLE",
        respondedAt: new Date(),
        notes: notes || "Owner confirmed yacht is available"
      }
    });

    // Update booking status to CONFIRMED
    await db.booking.update({
      where: { id: booking.id },
      data: {
        bookingStatus: "CONFIRMED"
      }
    });

    // Audit logs
    await db.customerActivity.create({
      data: {
        type: "OWNER_AVAILABILITY_CONFIRMED" as ActivityType,
        description: `Owner confirmed availability for ${booking.yacht.name}`,
        customerId: booking.customerId,
        metadata: {
          bookingId: booking.id,
          verificationId,
          adminId,
          notes
        }
      }
    });

    await db.customerActivity.create({
      data: {
        type: "BOOKING_CONFIRMED" as ActivityType,
        description: `Booking ${booking.bookingReference || booking.id} is now CONFIRMED following owner verification`,
        customerId: booking.customerId,
        metadata: {
          bookingId: booking.id,
          adminId
        }
      }
    });

    return updatedVerification;
  }

  /**
   * Owner / Admin marks yacht as UNAVAILABLE.
   * Verification status set to UNAVAILABLE; booking remains PENDING.
   */
  async respondUnavailable(verificationId: string, adminId: string, reason?: string) {
    const verification = await db.ownerVerification.findUnique({
      where: { id: verificationId },
      include: { booking: { include: { customer: true, yacht: true } } }
    });

    if (!verification) {
      throw new Error("Verification request not found");
    }

    if (verification.status !== "PENDING") {
      throw new Error(`Verification request is already ${verification.status}`);
    }

    const booking = verification.booking;

    const updatedVerification = await db.ownerVerification.update({
      where: { id: verificationId },
      data: {
        status: "UNAVAILABLE",
        respondedAt: new Date(),
        notes: reason || "Owner declared yacht unavailable"
      }
    });

    // Log audit entry
    await db.customerActivity.create({
      data: {
        type: "OWNER_AVAILABILITY_DECLINED" as ActivityType,
        description: `Owner declared ${booking.yacht.name} unavailable for booking ${booking.bookingReference || booking.id}: ${reason || 'No reason provided'}`,
        customerId: booking.customerId,
        metadata: {
          bookingId: booking.id,
          verificationId,
          adminId,
          reason
        }
      }
    });

    return updatedVerification;
  }

  /**
   * Finds alternative available yachts for a date, time slot, and guest count.
   */
  async findAlternativeYachts(excludeYachtId: string, date: Date, guestsCount: number) {
    const alternativeYachts = await db.yacht.findMany({
      where: {
        id: { not: excludeYachtId },
        isActive: true,
        capacity: { gte: guestsCount },
        bookings: {
          none: {
            bookingStatus: "CONFIRMED",
            startDateTime: {
              gte: new Date(date.setHours(0, 0, 0, 0)),
              lt: new Date(date.setHours(23, 59, 59, 999))
            }
          }
        }
      },
      include: { images: { take: 1 } },
      take: 4
    });

    return alternativeYachts;
  }

  /**
   * Gets pending owner verification requests.
   */
  async getPendingVerifications() {
    return await db.ownerVerification.findMany({
      where: { status: "PENDING" },
      include: {
        booking: {
          include: {
            customer: true,
            yacht: true
          }
        },
        yacht: true
      },
      orderBy: { createdAt: "desc" }
    });
  }
}

export const ownerVerificationService = new OwnerVerificationService();
