# Ticket 11B: Stripe Webhook & Booking Finalization

## Architecture Overview
The system implements a secure, database-authoritative webhook handler to convert a 30% deposit payment into a confirmed booking.

### 1. Webhook Authority
The Stripe webhook (`checkout.session.completed`) is the **only** authoritative source for payment confirmation. The success redirect page (`/booking/success`) is non-authoritative and does not mutate any database state.

### 2. Financial Lifecycle (30/70)
- **Deposit**: 30% of the total charter price is paid online.
- **Remaining Balance**: 70% is owed by the customer and collected on the charter date.
- The `BookingHold` contains the exact snapshot of these values (`depositAmount`, `remainingBalance`, `totalAmount`).
- Upon finalization, the `Booking` mirrors these values, sets `paymentStatus = PARTIAL`, and records exactly one `PaymentTransaction` for the 30% deposit.

### 3. Database Atomicity
The finalization occurs in a single Prisma interactive `$transaction` to guarantee consistency:
1. Re-fetches the hold with an exclusive lock.
2. Checks expiration and time-slot availability.
3. Upserts the `Customer`.
4. Creates the `Booking` with financial snapshots.
5. Creates the `PaymentTransaction`.
6. Links `TimeSlot`s to the `Booking` and removes them from the hold.
7. Creates `CustomerActivity` records for CRM.
8. Marks the `BookingHold` as `CONVERTED`.

If any step fails, the entire transaction rolls back.

### 4. Idempotency & Concurrency
Stripe webhooks may be delivered multiple times, and concurrent finalizations (e.g. user refreshing a success page that triggers an API, though we don't do that) are possible.
- Idempotency is enforced by checking if `BookingHold.status === 'CONVERTED'` inside the locked transaction.
- Duplicate `PaymentTransaction`s are prevented by a `@unique` constraint on `stripeSessionId`.

### 5. Hold Expiry Race Condition
If a customer pays in Stripe *after* the 10-minute hold expires, a race condition occurs.
- If the `TimeSlots` are still free, the finalization **succeeds** safely.
- If the `TimeSlots` were claimed by another booking, the system throws a `RefundRequiredError`. 
- **Future Integration**: The Stripe API will catch `RefundRequiredError` and automatically issue a full refund to the customer, preventing a double-booking.

### 6. Stripe Credentials Blocker
Currently, live Stripe credentials are not available in the environment.
- The domain service is decoupled from the HTTP webhook handler.
- The webhook handler contains real signature verification code but includes a QA bypass for testing.
- Once `STRIPE_WEBHOOK_SECRET` and `STRIPE_SECRET_KEY` are provided, the QA bypass can be removed.
