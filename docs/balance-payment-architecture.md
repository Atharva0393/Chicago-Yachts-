# Ticket 12: Remaining Balance Payment & Receivables Architecture

## Overview
Chicago Yachts requires a 30% deposit to secure a charter booking. The remaining 70% is collected from the customer at a later time (often on the day of the charter).

Ticket 12 builds the infrastructure for tracking, calculating, displaying, and securely recording these remaining 70% balance payments.

## Architecture

1. **PaymentTransaction Source of Truth**
   - The `PaymentTransaction` table is the definitive ledger for all collections and refunds.
   - We introduced `PaymentMethod` enum (`STRIPE`, `CASH`, `BANK_TRANSFER`, `ZELLE`, `OTHER`) to track how manual payments are recorded.

2. **Server-Side Financial Derivation**
   - We do NOT trust the client for mathematical values regarding remaining balances.
   - `payment-summary.service.ts` dynamically sums `PAID` transactions (adding `DEPOSIT` and `BALANCE` types, subtracting `REFUND`s) against the `Booking.totalAmount`.
   - The resulting `remainingBalance` is strictly enforced server-side.

3. **Concurrency & Atomicity**
   - The server action `recordManualBalancePayment` utilizes a Prisma `$transaction`.
   - Inside the transaction, the current collected amount is re-calculated and verified against the requested amount to strictly prevent over-collection or double spending if two admins process a payment simultaneously.

4. **Timezone Aware Overdue Calculations**
   - Outstanding balances are considered overdue ONLY if the `America/Chicago` (local timezone) current date/time is strictly past the `startDateTime` of the charter.

5. **Customer Lifetime Value & Analytics**
   - When a manual balance is recorded, a `CustomerActivity` is logged, and the customer's `lifetimeValue` is atomically incremented.
   - The Admin Dashboard now correctly tracks `Outstanding Receivables` by checking `paymentStatus !== 'PAID'` and summing `remainingAmount`.

## Future Implementation
When Stripe credentials become available, `payment-summary.service.ts` will expose `createBalanceCheckoutSession(bookingId)`, which will dynamically create a Stripe checkout link scoped to exactly the derived `remainingBalance` of the booking.
