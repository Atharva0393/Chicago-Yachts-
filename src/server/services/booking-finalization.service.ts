import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { notificationService } from "./notification.service";
import { ExtendedBooking } from "./email.service";

// Simple fallback if you don't have a generator
function generateBookingReference() {
  return `B-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export class RefundRequiredError extends Error {
  constructor(message: string, public readonly stripeSessionId: string) {
    super(message);
    this.name = "RefundRequiredError";
  }
}

export class BookingFinalizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookingFinalizationError";
  }
}

interface FinalizeBookingParams {
  stripeSessionId: string;
  paymentIntentId: string;
  amountPaidCents: number;
  currency: string;
}

export async function finalizePaidBooking(params: FinalizeBookingParams) {
  const { stripeSessionId, paymentIntentId, amountPaidCents, currency } = params;

  // 1. Re-fetch authoritative BookingHold state (outside transaction for quick check)
  const hold = await db.bookingHold.findUnique({
    where: { stripeSessionId },
    include: { timeSlots: true }
  });

  if (!hold) {
    throw new BookingFinalizationError("Booking hold not found for the given Stripe session.");
  }

  // Idempotency check before starting transaction
  if (hold.status === "CONVERTED") {
    // If it's already converted, we can safely return success.
    // The previous webhook processing successfully created everything.
    return { status: "ALREADY_CONVERTED", holdId: hold.id };
  }

  // Financial Validations (Strictly authoritative)
  if (!hold.depositAmount || hold.depositAmount.toNumber() <= 0) {
    throw new BookingFinalizationError("Booking hold has invalid deposit amount.");
  }

  const expectedAmountCents = Math.round(hold.depositAmount.toNumber() * 100);
  if (amountPaidCents !== expectedAmountCents) {
    throw new BookingFinalizationError(`Payment amount mismatch. Expected ${expectedAmountCents} cents, got ${amountPaidCents}.`);
  }

  if (currency.toLowerCase() !== "usd") {
    throw new BookingFinalizationError(`Currency mismatch. Expected USD, got ${currency}.`);
  }

  // ATOMIC DATABASE CONVERSION
  // We use an interactive transaction to carefully orchestrate and lock if needed.
  console.log("[DEBUG] Starting transaction for", stripeSessionId);
  const result = await db.$transaction(async (tx) => {
    // Re-fetch with a lock/strict check inside transaction
    console.log("[DEBUG] Refetching activeHold");
    const activeHold = await tx.bookingHold.findUnique({
      where: { id: hold.id },
      include: { timeSlots: true }
    });

    if (!activeHold) {
      throw new BookingFinalizationError("Booking hold disappeared during finalization.");
    }

    if (activeHold.status === "CONVERTED") {
      // Handled idempotently
      return { status: "ALREADY_CONVERTED", holdId: activeHold.id };
    }

    // 2. Race Condition / Expiry Check
    console.log("[DEBUG] Expiry check");
    const now = new Date();
    if (activeHold.expiresAt < now || activeHold.status === "EXPIRED") {
      // The hold expired. We must check if the timeslots were stolen by another booking!
      const conflictingSlots = await tx.timeSlot.findMany({
        where: {
          id: { in: activeHold.timeSlots.map(s => s.id) },
          bookingId: { not: null }
        }
      });

      if (conflictingSlots.length > 0) {
        // Double booking detected! We must NOT confirm.
        throw new RefundRequiredError(
          "Payment succeeded but hold expired and time slots were taken by another booking.",
          stripeSessionId
        );
      }
      // If free, we allow the late payment to proceed safely.
    }

    // 3. Upsert Customer
    console.log("[DEBUG] Upsert Customer");
    // Find customer by email
    const email = activeHold.customerEmail?.toLowerCase().trim();
    if (!email) {
      throw new BookingFinalizationError("Booking hold has no customer email.");
    }

    let customer = await tx.customer.findUnique({ where: { email } });
    
    if (customer) {
      // Update basic fields if they are missing
      const updateData: any = {};
      if (!customer.phone && activeHold.customerPhone) updateData.phone = activeHold.customerPhone;
      
      // Add to lifetime value (using totalAmount as booked value, based on business decision for 'lifetime booked value')
      // For now we add totalAmount.
      updateData.lifetimeValue = {
        increment: activeHold.totalAmount || 0
      };

      if (Object.keys(updateData).length > 0) {
        customer = await tx.customer.update({
          where: { id: customer.id },
          data: updateData
        });
      }
    } else {
      // Create new customer
      customer = await tx.customer.create({
        data: {
          firstName: activeHold.customerFirstName || "Guest",
          lastName: activeHold.customerLastName || "",
          email,
          phone: activeHold.customerPhone,
          source: "ONLINE_BOOKING",
          lifetimeValue: activeHold.totalAmount || 0
        }
      });
    }

    // Generate reference
    console.log("[DEBUG] Creating booking");
    const bookingReference = generateBookingReference();

    // 4. Create Booking
    const booking = await tx.booking.create({
      data: {
        bookingReference,
        startDateTime: activeHold.startDateTime,
        endDateTime: activeHold.endDateTime,
        guestCount: activeHold.guestCount || 1,
        
        // Financials exactly mapped from authoritative hold snapshot
        subtotal: activeHold.subtotal || 0,
        taxAmount: 0, // In future, if stored on hold, map it
        serviceFee: 0,
        addOnTotal: 0,
        discountAmount: 0,
        totalAmount: activeHold.totalAmount || 0,
        depositAmount: activeHold.depositAmount || 0,
        remainingAmount: activeHold.remainingBalance || 0,

        bookingStatus: "CONFIRMED",
        paymentStatus: "PARTIAL", // Deposit paid, remaining balance due

        customerNotes: activeHold.customerNotes,
        
        yachtId: activeHold.yachtId,
        customerId: customer.id,
      }
    });

    // 5. Create PaymentTransaction Ledger
    console.log("[DEBUG] Creating payment transaction");
    // Attempting to create duplicate stripeSessionId here will trigger Prisma unique constraint error,
    // enforcing idempotency automatically as a fallback.
    const paymentTx = await tx.paymentTransaction.create({
      data: {
        stripeSessionId,
        stripePaymentIntentId: paymentIntentId,
        type: "DEPOSIT",
        amount: activeHold.depositAmount || 0,
        currency: currency.toUpperCase(),
        status: "PAID",
        bookingId: booking.id
      }
    });

    // 6. Reassign TimeSlots
    console.log("[DEBUG] Reassigning time slots");
    await tx.timeSlot.updateMany({
      where: { id: { in: activeHold.timeSlots.map(s => s.id) } },
      data: {
        bookingId: booking.id,
        holdId: null, // Remove hold ownership
        isBlocked: true
      }
    });

    // 7. Update Hold Status
    console.log("[DEBUG] Updating hold status");
    await tx.bookingHold.update({
      where: { id: activeHold.id },
      data: { status: "CONVERTED" }
    });

    // 8. Create CRM Activities
    console.log("[DEBUG] Creating CRM activities");
    await tx.customerActivity.createMany({
      data: [
        {
          customerId: customer.id,
          type: "PAYMENT_RECEIVED",
          description: `Received 30% deposit payment of $${activeHold.depositAmount?.toString()}`,
          metadata: { bookingReference, stripeSessionId }
        },
        {
          customerId: customer.id,
          type: "BOOKING_CREATED",
          description: `Booking confirmed for ${bookingReference}`,
          metadata: { bookingReference, bookingId: booking.id, yachtId: activeHold.yachtId }
        }
      ]
    });

    return { status: "SUCCESS", bookingId: booking.id, bookingReference };
  }, {
    // Configure isolation level if needed, but Prisma default (Read Committed) combined with unique constraints 
    // and strict conditions usually covers this. To be perfectly safe for concurrency on TimeSlots, 
    // we could use Serializable, but Read Committed is often sufficient with our checks.
    isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
    maxWait: 5000,
    timeout: 10000,
  });

  // If transaction succeeded and we didn't just return ALREADY_CONVERTED
  if (result.status === "SUCCESS") {
    // 9. Send Notifications in the background safely
    db.booking.findUnique({
      where: { id: result.bookingId },
      include: { customer: true, yacht: true }
    }).then(booking => {
      if (booking) {
        notificationService.sendBookingConfirmation(booking as unknown as ExtendedBooking).catch(e => {
          console.error("Non-fatal error sending confirmation notification", e);
        });
      }
    }).catch(e => {
      console.error("Failed to load booking for notification", e);
    });
  }

  return result;
}
