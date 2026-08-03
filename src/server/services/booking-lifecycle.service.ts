import { db } from "@/lib/db";
import { BookingStatus, ActivityType } from "@prisma/client";

export class BookingLifecycleService {
  /**
   * Updates a booking's status, enforcing the state machine and creating an audit trail.
   */
  async updateBookingStatus(bookingId: string, nextStatus: BookingStatus, adminId: string) {
    return await db.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId }
      });

      if (!booking) throw new Error("Booking not found");

      const currentStatus = booking.bookingStatus;

      // Validate transitions
      if (currentStatus === nextStatus) {
        return booking; // No change
      }

      if (currentStatus === "CANCELLED" && nextStatus !== "CANCELLED") {
        throw new Error("Cannot change status of a cancelled booking");
      }

      if (currentStatus === "COMPLETED" && nextStatus !== "COMPLETED") {
        throw new Error("Cannot change status of a completed booking");
      }

      const updateData: any = {
        bookingStatus: nextStatus,
      };

      if (nextStatus === "COMPLETED") {
        updateData.completedAt = new Date();
      }

      // Update the booking atomically
      const result = await tx.booking.updateMany({
        where: { 
          id: bookingId,
          bookingStatus: currentStatus
        },
        data: updateData,
      });

      if (result.count === 0) {
        throw new Error("Concurrency failure: Booking status changed during operation.");
      }

      const updatedBooking = await tx.booking.findUnique({ where: { id: bookingId } });

      // Record audit activity
      const activityType = nextStatus === "COMPLETED" ? "BOOKING_COMPLETED" : "STATUS_CHANGED";
      const description = `Booking status changed from ${currentStatus} to ${nextStatus}`;
      
      await tx.customerActivity.create({
        data: {
          type: activityType as ActivityType,
          description,
          customerId: booking.customerId,
          metadata: {
            bookingId,
            adminId,
            oldStatus: currentStatus,
            newStatus: nextStatus
          }
        }
      });

      return updatedBooking!;
    });
  }

  /**
   * Safely cancels a booking, records the reason, releases timeslots without deleting availability,
   * and creates an audit trail.
   */
  async cancelBooking(bookingId: string, reason: string, adminId: string) {
    return await db.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { timeSlots: true }
      });

      if (!booking) throw new Error("Booking not found");
      if (booking.bookingStatus === "CANCELLED") return booking;
      if (booking.bookingStatus === "COMPLETED") throw new Error("Cannot cancel a completed booking");

      const updateData = {
        bookingStatus: "CANCELLED" as BookingStatus,
        cancelledAt: new Date(),
        internalNotes: booking.internalNotes 
          ? `${booking.internalNotes}\n\nCancellation Reason: ${reason}` 
          : `Cancellation Reason: ${reason}`
      };

      // Atomic update
      const result = await tx.booking.updateMany({
        where: { 
          id: bookingId,
          bookingStatus: { not: "CANCELLED" }
        },
        data: updateData,
      });

      if (result.count === 0) {
        // Already cancelled by another concurrent request
        return booking;
      }

      const cancelledBooking = await tx.booking.findUnique({ where: { id: bookingId } });

      // Release TimeSlots (set bookingId to null so they are available again)
      if (booking.timeSlots.length > 0) {
        await tx.timeSlot.updateMany({
          where: { bookingId },
          data: { bookingId: null }
        });
      }

      // Record audit activity
      await tx.customerActivity.create({
        data: {
          type: "BOOKING_CANCELLED" as ActivityType,
          description: `Booking cancelled: ${reason}`,
          customerId: booking.customerId,
          metadata: {
            bookingId,
            adminId,
            reason
          }
        }
      });

      return cancelledBooking!;
    });
  }

  /**
   * Adds an internal note to a booking and logs the activity.
   */
  async addBookingNote(bookingId: string, content: string, adminId: string) {
    return await db.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId }
      });

      if (!booking) throw new Error("Booking not found");

      const note = await tx.bookingNote.create({
        data: {
          content,
          authorId: adminId,
          bookingId
        }
      });

      await tx.customerActivity.create({
        data: {
          type: "NOTE_ADDED" as ActivityType,
          description: `Internal note added to booking`,
          customerId: booking.customerId,
          metadata: {
            bookingId,
            adminId,
            noteId: note.id
          }
        }
      });

      return note;
    });
  }

  /**
   * Retrieves the audit trail for a specific booking.
   */
  async getBookingAuditTrail(bookingId: string) {
    const activities = await db.customerActivity.findMany({
      where: {
        metadata: {
          path: ['bookingId'],
          equals: bookingId
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return activities;
  }
}

export const bookingLifecycleService = new BookingLifecycleService();
