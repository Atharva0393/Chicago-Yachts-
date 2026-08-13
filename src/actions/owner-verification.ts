"use server"

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-server";
import { ownerVerificationService } from "@/server/services/owner-verification.service";

export async function createOwnerVerificationAction(bookingId: string) {
  try {
    await requireAdmin();
    const verification = await ownerVerificationService.createVerificationRequest(bookingId);
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
