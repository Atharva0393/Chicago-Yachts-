# Production Booking Hold & Concurrency Engine

## 1. Hold Lifecycle
1. **ACTIVE**: A customer selects a slot, passes real-time availability and pricing checks, and acquires a hold. The slot is now logically blocked for others.
2. **EXPIRED**: 
   - **Lazy Expiration**: If `expiresAt < now`, the system treats the slot as available again, even if the database record still says "ACTIVE".
   - **Explicit Expiration**: If the customer abandons the checkout or explicit release is called, the status is updated to `EXPIRED`.
3. **CONVERTED**: Upon successful payment, the hold transitions to `CONVERTED` and a formal `Booking` is created.

## 2. Concurrency Strategy
We use **Optimistic Concurrency Control** via Prisma's `updateMany` inside a serialized transaction block:
1. `BookingHold` is created securely.
2. `TimeSlot` records are updated to point to the new `BookingHold`'s ID, **ONLY IF** they are currently not held (or held by an expired hold).
3. If `updateMany` returns a count of `0` (or less than requested slots), it indicates another concurrent request acquired the slot first. The transaction is aborted and rolled back.
This entirely prevents the double-booking race condition.

## 3. Atomicity
The entire hold creation runs inside `db.$transaction`. If pricing fails, availability is exhausted, or a concurrency violation occurs, the transaction rolls back cleanly, leaving no partial records.

## 4. Idempotency
Each request from the frontend generates an `idempotencyKey` UUID. If a user double-clicks or experiences a network retry, the server detects the active hold via the key and simply returns the existing hold token rather than allocating a second block of inventory.

## 5. Expiration & Lazy Evaluation
- **Temporary Configuration**: `BOOKING_HOLD_DURATION_MINUTES` is set to 10 minutes (development default).
- The availability engine (used by both public and admin interfaces) lazily evaluates holds. A cron job is not required to restore inventory; inventory restores itself exactly at `expiresAt`.

## 6. Price Snapshot
To prevent quotes from changing while a customer is typing their credit card, the `BookingHold` captures the exact `subtotal` and `totalAmount` evaluated by the `serverPricingService` at hold creation.

## 7. Guest Ownership/Token
Holds are secured via a randomly generated UUID (`holdToken`). Sequential ID guessing is impossible. 

## 8. Abuse Risk & Rate-Limit Status
We have implemented an in-memory Map-based rate limiter (10 holds per 5 minutes per IP) at the `createBookingHoldAction` boundary. 
**Limitation**: In a serverless environment (like Vercel), this is scoped per lambda instance and resets on deployment. For robust production abuse protection, an external store like Redis (Vercel KV) must be implemented.
