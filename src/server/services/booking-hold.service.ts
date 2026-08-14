import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { serverPricingService } from "./pricing.service";
import { calculatePaymentBreakdown } from "@/server/config/payment-policy";
import { randomUUID } from "crypto";

// TODO: CLIENT CONFIRMATION REQUIRED
// 10 minutes is a temporary development default for hold expiration.
// Verify the desired hold duration with Chicago Yachts (e.g. 10, 15, or 20 minutes).
export const BOOKING_HOLD_DURATION_MINUTES = 10;

export type CreateHoldRequest = {
  yachtId: string;
  dateStr: string; // YYYY-MM-DD
  timeSlot: "Morning" | "Afternoon" | "Evening" | "Full Day";
  duration: number; // in hours
  guests: number;
  idempotencyKey: string;
};

export type CreateHoldResponse = {
  status: "SUCCESS" | "SLOT_UNAVAILABLE" | "PRICING_UNAVAILABLE" | "ERROR";
  holdToken?: string;
  expiresAt?: Date;
  quote?: any;
};

export const bookingHoldService = {
  async createBookingHold(req: CreateHoldRequest): Promise<CreateHoldResponse> {
    try {
      // 1. Idempotency Check
      // If a hold with this idempotency key already exists and is active, just return it.
      const existingHold = await db.bookingHold.findUnique({
        where: { idempotencyKey: req.idempotencyKey },
        include: { timeSlots: true }
      });

      if (existingHold) {
        if (existingHold.status === 'ACTIVE' && existingHold.expiresAt > new Date()) {
          // It's still valid!
          return {
            status: "SUCCESS",
            holdToken: existingHold.id,
            expiresAt: existingHold.expiresAt,
            quote: {
              totalAmount: existingHold.totalAmount?.toString() || "0",
              subtotal: existingHold.subtotal?.toString() || "0",
            }
          };
        }
      }

      const [year, month, day] = req.dateStr.split('-').map(Number);
      const targetDate = new Date(Date.UTC(year, month - 1, day));

      // 2. Fetch the actual TimeSlot records for this date
      // We must map "Morning", "Afternoon", "Evening" to actual time slots.
      // Or "Full Day" to all 3.
      const availability = await db.availability.findUnique({
        where: { yachtId_date: { yachtId: req.yachtId, date: targetDate } },
        include: { timeSlots: { include: { bookingHold: true } } }
      });

      if (!availability || availability.isBlocked) {
        return { status: "SLOT_UNAVAILABLE" };
      }

      // Map string time slot to actual DB TimeSlots
      const targetSlotIds: string[] = [];
      const requiredSlots = req.timeSlot === "Full Day" ? ["Morning", "Afternoon", "Evening"] : [req.timeSlot];
      
      // Temporary mapping based on SLOT_TIMES in availability.ts
      const slotHourMap: Record<string, number> = {
        "Morning": 9,
        "Afternoon": 14,
        "Evening": 19
      };

      for (const reqSlot of requiredSlots) {
        const hour = slotHourMap[reqSlot];
        const dbSlot = availability.timeSlots.find(s => s.startTime.getUTCHours() === hour);
        
        if (!dbSlot || dbSlot.isBlocked || dbSlot.bookingId) {
          return { status: "SLOT_UNAVAILABLE" }; // Already fully booked or missing
        }

        // Lazy Expiration Evaluation for existing holds
        if (dbSlot.holdId && dbSlot.bookingHold) {
          const hold = dbSlot.bookingHold;
          if (hold.status === 'ACTIVE' && hold.expiresAt > new Date()) {
            return { status: "SLOT_UNAVAILABLE" }; // Actively held
          }
        }

        targetSlotIds.push(dbSlot.id);
      }

      // 3. Authoritative Price Snapshot
      const quoteRes = await serverPricingService.calculateQuote({
        yachtId: req.yachtId,
        dateStr: req.dateStr,
        timeSlot: req.timeSlot,
        duration: req.duration,
        guests: req.guests
      });

      if (quoteRes.status !== "SUCCESS" || !quoteRes.quote) {
        return { status: "PRICING_UNAVAILABLE" };
      }

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + BOOKING_HOLD_DURATION_MINUTES);

      const holdId = randomUUID(); // This UUID serves as the secure hold token

      // 4. ATOMIC ACQUISITION (Concurrency Protection)
      // We use a transaction.
      // We create the BookingHold, then we update the TimeSlots ONLY IF they are not held by an active hold.
      // Prisma's updateMany doesn't easily let us say "update if not held by active hold" across relations directly in a single statement without complex nested where, so we just do a raw or safe approach.
      // A safe approach in Prisma is to use `updateMany` on `TimeSlot` where `holdId` is either `null` or matches a list of known EXPIRED holds.
      // Or simply, we just lock the rows or use serializable transaction.

      const totalDecimal = new Prisma.Decimal(quoteRes.quote!.totalAmount);
      const paymentBreakdown = calculatePaymentBreakdown(totalDecimal);

      const result = await db.$transaction(async (tx) => {
        // Double check slots inside transaction with FOR UPDATE lock if using raw,
        // but Prisma doesn't support SELECT FOR UPDATE well.
        // Instead, we use optimistic concurrency via conditional update:

        const firstSlot = availability.timeSlots.find(s => s.id === targetSlotIds[0])!;
        const lastSlot = availability.timeSlots.find(s => s.id === targetSlotIds[targetSlotIds.length - 1])!;

        const holdStartDateTime = new Date(targetDate);
        holdStartDateTime.setUTCHours(firstSlot.startTime.getUTCHours(), firstSlot.startTime.getUTCMinutes(), 0, 0);

        const holdEndDateTime = new Date(targetDate);
        holdEndDateTime.setUTCHours(lastSlot.endTime.getUTCHours(), lastSlot.endTime.getUTCMinutes(), 0, 0);

        // Create hold record
        const newHold = await tx.bookingHold.create({
          data: {
            id: holdId,
            idempotencyKey: req.idempotencyKey,
            customerRef: "guest", // Could be session ID in future
            startDateTime: holdStartDateTime,
            endDateTime: holdEndDateTime,
            expiresAt,
            status: "ACTIVE",
            subtotal: new Prisma.Decimal(quoteRes.quote!.subtotal),
            totalAmount: totalDecimal,
            depositAmount: paymentBreakdown.depositAmount,
            remainingBalance: paymentBreakdown.remainingBalance,
            depositPercentage: paymentBreakdown.depositPercentage,
            pricingRuleId: quoteRes.quote!.pricingRuleId,
            yachtId: req.yachtId,
          }
        });

        // We only want to update the slots if they are still "free" or "expired".
        // To be absolutely safe in a concurrent environment, we find the exact condition:
        // holdId is null OR hold.status = EXPIRED OR hold.expiresAt < now.
        const now = new Date();

        const updateRes = await tx.timeSlot.updateMany({
          where: {
            id: { in: targetSlotIds },
            OR: [
              { holdId: null },
              { bookingHold: { status: 'EXPIRED' } },
              { bookingHold: { expiresAt: { lt: now } } }
            ]
          },
          data: {
            holdId: newHold.id
          }
        });

        if (updateRes.count !== targetSlotIds.length) {
          throw new Error("CONCURRENCY_VIOLATION");
        }

        return newHold;
      }, {
        maxWait: 10000,
        timeout: 15000
      });

      return {
        status: "SUCCESS",
        holdToken: result.id,
        expiresAt: result.expiresAt,
        quote: quoteRes.quote
      };

    } catch (error: any) {
      if (error.message === "CONCURRENCY_VIOLATION") {
        return { status: "SLOT_UNAVAILABLE" };
      }
      // If Prisma throws UniqueConstraint violation on idempotencyKey, we can just treat it as concurrent error
      if (error.code === 'P2002' && error.meta?.target?.includes('idempotencyKey')) {
        return { status: "SLOT_UNAVAILABLE" };
      }
      console.error("Failed to create booking hold:", error);
      return { status: "ERROR" };
    }
  },

  async getHoldStatus(holdToken: string) {
    const hold = await db.bookingHold.findUnique({
      where: { id: holdToken }
    });

    if (!hold) return { status: "INVALID" };

    if (hold.status === 'ACTIVE' && hold.expiresAt < new Date()) {
      return { status: "EXPIRED", hold };
    }

    return { status: hold.status, hold };
  },

  async releaseBookingHold(holdToken: string) {
    // Explicit release
    await db.$transaction(async (tx) => {
      const hold = await tx.bookingHold.update({
        where: { id: holdToken },
        data: { status: "EXPIRED" }
      });
      // We don't strictly need to nullify `TimeSlot.holdId` because the engine lazy-evaluates `EXPIRED` status,
      // but nullifying it makes it cleaner.
      await tx.timeSlot.updateMany({
        where: { holdId: holdToken },
        data: { holdId: null }
      });
    });
  }
};
