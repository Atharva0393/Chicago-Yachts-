/**
 * Chicago Yachts Payment Policy
 * 
 * CONFIRMED BUSINESS RULES (as of 2026-08-02):
 * 
 * DEPOSIT:
 *   30% of total charter price, collected online at time of booking via Stripe.
 *
 * REMAINING BALANCE:
 *   70% of total charter price, due on the day of the charter.
 *
 * BALANCE COLLECTION METHOD:
 *   ⚠️ UNCONFIRMED — The specific method for collecting the 70% on charter day
 *   (e.g., cash, card terminal, bank transfer, or Stripe online payment) has
 *   NOT been confirmed by Chicago Yachts. Do NOT assume any method.
 *
 * ROUNDING STRATEGY:
 *   Deposit is calculated using Decimal arithmetic (ROUND_HALF_UP) then converted
 *   to two decimal places. The remaining balance is derived as:
 *     remainingBalance = totalAmount - depositAmount
 *   This ensures: depositAmount + remainingBalance = totalAmount EXACTLY.
 *   No floating-point drift. No one-cent discrepancy.
 *
 * CURRENCY:
 *   USD. Server-controlled. Not accepted from browser.
 *
 * TICKET 11B — INTENDED FINANCIAL STATUS FLOW:
 *   PaymentTransaction type  → DEPOSIT (not FULL_PAYMENT)
 *   Booking.paymentStatus    → PARTIAL (not PAID — 70% remains outstanding)
 */

import { Decimal } from "@prisma/client/runtime/library";

export const PAYMENT_POLICY = {
  /** Confirmed: 30% of charter total collected online at booking. */
  DEPOSIT_PERCENTAGE: new Decimal(30),

  /** Confirmed: 70% remaining balance. */
  BALANCE_PERCENTAGE: new Decimal(70),

  /** Confirmed: remaining balance due on charter date. */
  BALANCE_DUE_POLICY: "CHARTER_DATE" as const,

  /** Currency — server controlled, never from browser. */
  CURRENCY: "usd" as const,

  /** ⚠️ UNCONFIRMED: How the 70% is collected on charter day. */
  BALANCE_COLLECTION_METHOD: "UNCONFIRMED" as const,
} as const;

export type PaymentBreakdown = {
  totalAmount: Decimal;
  depositAmount: Decimal;
  remainingBalance: Decimal;
  depositPercentage: Decimal;
  balanceDuePolicy: "CHARTER_DATE";
  currency: "usd";
};

/**
 * Calculate authoritative deposit and balance breakdown.
 * Uses Decimal arithmetic throughout. No floating-point operations.
 * 
 * Guarantees: depositAmount + remainingBalance === totalAmount (exact, to the cent)
 */
export function calculatePaymentBreakdown(totalAmount: Decimal): PaymentBreakdown {
  // depositAmount = totalAmount × 30 / 100, rounded HALF_UP to 2dp
  const depositAmount = totalAmount
    .mul(PAYMENT_POLICY.DEPOSIT_PERCENTAGE)
    .div(100)
    .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  // remainingBalance derived from subtraction — guarantees no cent drift
  const remainingBalance = totalAmount.minus(depositAmount);

  return {
    totalAmount,
    depositAmount,
    remainingBalance,
    depositPercentage: PAYMENT_POLICY.DEPOSIT_PERCENTAGE,
    balanceDuePolicy: PAYMENT_POLICY.BALANCE_DUE_POLICY,
    currency: PAYMENT_POLICY.CURRENCY,
  };
}

/**
 * Convert a Decimal dollar amount to integer cents safely.
 * Uses Decimal.ROUND_HALF_UP, never floating-point multiplication.
 */
export function toCents(amount: Decimal): number {
  return amount.mul(100).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
}
