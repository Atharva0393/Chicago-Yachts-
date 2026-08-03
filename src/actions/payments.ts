"use server"

import { db } from "@/lib/db";
import { PaymentMethod, Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth-server";
import { getBookingPaymentSummary } from "@/server/services/payment-summary.service";

export async function recordManualBalancePayment(data: {
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
}) {
  try {
    // 1. Authorization
    const session = await requireAdmin(); // throws if not admin
    const adminId = (session.user as any)?.id || "admin";

    // 2. Initial Validation
    if (data.amount <= 0) {
      return { success: false, error: "Payment amount must be greater than zero." };
    }

    // 3. Database Transaction
    // Use an interactive transaction for atomicity.
    const result = await db.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: data.bookingId },
        include: { payments: true }
      });

      if (!booking) {
        throw new Error("Booking not found");
      }

      // Calculate remaining balance dynamically inside transaction
      const successfulPayments = booking.payments.filter(p => p.status === "PAID");
      let totalCollected = 0;
      for (const p of successfulPayments) {
        if (p.type === "REFUND") {
          totalCollected -= Number(p.amount);
        } else {
          totalCollected += Number(p.amount);
        }
      }

      const totalAmount = Number(booking.totalAmount);
      const remainingBalance = Math.max(0, totalAmount - totalCollected);

      if (data.amount > remainingBalance) {
        throw new Error(`Overpayment Protection: Cannot collect $${data.amount}. Remaining balance is only $${remainingBalance}.`);
      }

      // Create PaymentTransaction
      const paymentTx = await tx.paymentTransaction.create({
        data: {
          bookingId: booking.id,
          type: "BALANCE",
          method: data.method,
          amount: new Prisma.Decimal(data.amount),
          status: "PAID",
          reference: data.reference,
          notes: data.notes,
          recordedById: adminId,
        }
      });

      // Recalculate states
      const newRemainingBalance = remainingBalance - data.amount;
      const newPaymentStatus = newRemainingBalance <= 0 ? "PAID" : "PARTIAL";

      // Update Booking
      await tx.booking.update({
        where: { id: booking.id },
        data: {
          remainingAmount: new Prisma.Decimal(newRemainingBalance),
          paymentStatus: newPaymentStatus,
        }
      });

      // Create Customer Activity
      await tx.customerActivity.create({
        data: {
          customerId: booking.customerId,
          type: "PAYMENT_RECEIVED",
          description: `Received $${data.amount} via ${data.method} for booking ${booking.bookingReference}.`,
          metadata: {
            bookingId: booking.id,
            bookingReference: booking.bookingReference,
            amount: data.amount,
            method: data.method,
            transactionId: paymentTx.id
          }
        }
      });

      // Update Customer Lifetime Value
      await tx.customer.update({
        where: { id: booking.customerId },
        data: {
          lifetimeValue: {
            increment: new Prisma.Decimal(data.amount)
          }
        }
      });

      return {
        success: true,
        transactionId: paymentTx.id,
        newRemainingBalance,
        newPaymentStatus
      };
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      maxWait: 5000,
      timeout: 10000,
    });

    return result;

  } catch (error: any) {
    console.error("[Manual Payment Error]", error);
    return { success: false, error: error.message || "Failed to record manual payment." };
  }
}
