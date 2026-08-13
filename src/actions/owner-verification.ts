"use server"

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-server";
import { ownerVerificationService } from "@/server/services/owner-verification.service";
import { inboundMessageRouter } from "@/server/services/messaging/inbound-router";
import { mockWhatsAppProvider } from "@/server/services/messaging/mock-provider";
import { db } from "@/lib/db";

export async function createOwnerVerificationAction(bookingId: string) {
  try {
    await requireAdmin();
    const verification = await ownerVerificationService.createVerificationRequest(bookingId);
    
    // Auto-send mock outbound WhatsApp message
    const fullVerif = await db.ownerVerification.findUnique({
      where: { id: verification.id },
      include: { booking: { include: { customer: true } }, yacht: { include: { ownerContacts: true } } }
    });

    if (fullVerif) {
      const ownerName = fullVerif.yacht.ownerContacts[0]?.name || "Yacht Owner";
      const ownerPhone = fullVerif.yacht.ownerContacts[0]?.phone || "+13125550199";

      await mockWhatsAppProvider.sendVerificationRequest({
        verificationId: fullVerif.id,
        ownerName,
        ownerPhone,
        yachtName: fullVerif.yacht.name,
        requestedDate: fullVerif.requestedDate,
        requestedTimeSlot: fullVerif.requestedTimeSlot,
        guestCount: fullVerif.booking.guestCount,
        bookingRef: fullVerif.booking.bookingReference || fullVerif.booking.id
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/bookings");
    return { success: true, verification };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create owner verification request" };
  }
}

export async function respondVerificationAvailableAction(verificationId: string, notes?: string) {
  try {
    const session = await requireAdmin();
    const adminId = (session.user as any)?.id || "admin";
    const verification = await ownerVerificationService.respondAvailable(verificationId, adminId, notes);
    revalidatePath("/admin");
    revalidatePath("/admin/bookings");
    return { success: true, verification };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to confirm owner availability" };
  }
}

export async function respondVerificationUnavailableAction(verificationId: string, reason?: string) {
  try {
    const session = await requireAdmin();
    const adminId = (session.user as any)?.id || "admin";
    const verification = await ownerVerificationService.respondUnavailable(verificationId, adminId, reason);
    revalidatePath("/admin");
    revalidatePath("/admin/bookings");
    return { success: true, verification };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to set owner availability to unavailable" };
  }
}

export async function getPendingVerificationsAction() {
  try {
    await requireAdmin();
    const verifications = await ownerVerificationService.getPendingVerifications();
    return { success: true, verifications };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch pending verifications" };
  }
}

export async function findAlternativeYachtsAction(excludeYachtId: string, dateIsoStr: string, guestsCount: number) {
  try {
    const date = new Date(dateIsoStr);
    const alternatives = await ownerVerificationService.findAlternativeYachts(excludeYachtId, date, guestsCount);
    return { success: true, alternatives };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to find alternative yachts" };
  }
}

/**
 * Simulates an incoming WhatsApp owner message through the full inbound router pipeline.
 */
export async function simulateOwnerResponseAction(
  verificationId: string,
  simulatedMessage: string,
  senderPhone?: string,
  providerMessageId?: string
) {
  try {
    await requireAdmin();
    const result = await inboundMessageRouter.processInboundMessage({
      verificationId,
      messageBody: simulatedMessage,
      senderPhone,
      providerMessageId
    });

    revalidatePath("/admin");
    revalidatePath("/admin/bookings");
    return { success: true, result };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to process simulated owner response" };
  }
}

/**
 * Fetches the message timeline for a verification request.
 */
export async function getMessageTimelineAction(verificationId: string) {
  try {
    await requireAdmin();
    const messages = await inboundMessageRouter.getMessageTimeline(verificationId);
    return { success: true, messages };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch message timeline" };
  }
}
