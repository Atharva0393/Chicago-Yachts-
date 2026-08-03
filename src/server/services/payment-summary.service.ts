import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { toZonedTime } from "date-fns-tz";
import { isBefore, startOfDay } from "date-fns";

export interface BookingPaymentSummary {
  totalAmount: number;
  depositRequired: number;
  depositPaid: number;
  totalCollected: number;
  remainingBalance: number;
  balanceDueDate: Date;
  isFullyPaid: boolean;
  isBalanceOutstanding: boolean;
  isOverdue: boolean;
}

/**
 * Derives the exact financial state of a booking directly from the database.
 * The PaymentTransaction ledger is authoritative.
 */
export async function getBookingPaymentSummary(bookingId: string): Promise<BookingPaymentSummary> {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { payments: true }
  });

  if (!booking) {
    throw new Error(`Booking ${bookingId} not found`);
  }

  // Use Prisma's Decimal type to Number for safe math internally where floating point is acceptable for display/summary, 
  // but strictly we should use Decimal.js if mutating. Here we return number for convenience, but the source is Decimal.
  const totalAmount = Number(booking.totalAmount);
  const depositRequired = Number(booking.depositAmount);

  // Authoritative sum of all successful payments
  // We only count payments with status PAID.
  const successfulPayments = booking.payments.filter(p => p.status === "PAID");

  // Sum all collected (DEPOSIT, BALANCE, FULL_PAYMENT) and subtract any REFUNDs
  let totalCollected = 0;
  let depositPaid = 0;

  for (const p of successfulPayments) {
    const amount = Number(p.amount);
    if (p.type === "REFUND") {
      totalCollected -= amount;
      if (depositPaid > 0) {
         // Naive refund subtraction, just reduces net collected
      }
    } else {
      totalCollected += amount;
      if (p.type === "DEPOSIT") {
        depositPaid += amount;
      }
    }
  }

  // Prevent negative balance if overpaid somehow
  const remainingBalance = Math.max(0, totalAmount - totalCollected);

  // Due Date is Charter Date
  const balanceDueDate = booking.startDateTime;

  // Timezone aware overdue logic
  const timeZone = "America/Chicago";
  const nowInChicago = toZonedTime(new Date(), timeZone);
  // Charter date at start of day in Chicago
  const dueDateInChicago = toZonedTime(balanceDueDate, timeZone);
  
  // A balance is overdue if current time in Chicago is strictly strictly past the due date and remaining balance > 0.
  // We check if now > due date
  const isBalanceOutstanding = remainingBalance > 0;
  const isOverdue = isBalanceOutstanding && isBefore(dueDateInChicago, nowInChicago);
  const isFullyPaid = remainingBalance <= 0;

  return {
    totalAmount,
    depositRequired,
    depositPaid,
    totalCollected,
    remainingBalance,
    balanceDueDate,
    isFullyPaid,
    isBalanceOutstanding,
    isOverdue
  };
}

/**
 * Stubs future Stripe balance checkout logic.
 */
export async function createBalanceCheckoutSession(bookingId: string): Promise<string> {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_NOT_CONFIGURED");
  }
  
  const summary = await getBookingPaymentSummary(bookingId);
  if (summary.remainingBalance <= 0) {
    throw new Error("Booking is already fully paid.");
  }

  // Future Stripe API logic will go here
  throw new Error("STRIPE_NOT_CONFIGURED");
}
