# Guest Booking Flow Architecture (Pre-Payment)

## 1. Checkout Draft Architecture
We have integrated temporary checkout progression (Guest Name, Email, Phone, Note) directly into the `BookingHold` database record via Prisma schema extensions.
- **Why?**: This prevents the creation of orphaned `CheckoutSession`, `Booking`, or `Customer` records in the database. 
- **Lifecycle**: If the customer abandons the checkout, the `BookingHold` expires naturally at its `expiresAt` time limit, bringing the guest information out of scope with it. 

## 2. BookingHold Authority & Checkout Progression
The `BookingHold` remains the strict, authoritative source of truth for the entire reservation flow.
1. Customer uses `BookingWizard` to determine preferences (Date, Time, Guests).
2. Customer acquires the hold via `createBookingHoldAction`.
3. The server generates a random UUID `holdToken`.
4. **Authority**: All subsequent Steps (Guest details input, Final Review) use the `holdToken` to query the database. The client is explicitly denied from transmitting `yachtId`, `price`, or `date` in subsequent actions.

## 3. Server-Side Validation Boundaries
We exposed `src/actions/checkout.ts` to manage the UI boundaries securely:
- **`saveCheckoutGuestAction`**: Evaluates Zod schema (validating name lengths, email structures, phone patterns) and validates `guestCount <= yacht.capacity`. Modifying a converted or expired hold is strictly rejected.
- **`getCheckoutHoldAction`**: Resolves the exact checkout details (snapshotted `subtotal`, `totalAmount`) to present the final review.

## 4. UI Adjustments & Expiration Resiliency
- **Refresh/Resume**: If the UI is refreshed but the `holdToken` persists (currently held in React context, but architecturally designed to support SessionStorage), the hold and guest draft are seamlessly resumed.
- **Expiration Behavior**: A countdown timer visually represents `expiresAt`. If it elapses, the frontend disables the payment boundary and displays a clear "Expired" CTA. If the user circumvents the UI, the server strictly checks `expiresAt < now()` on every step and kicks them out.

## 5. Security Summary
- **Double Submission**: Idempotent operations protect against multiple DB requests creating multiple holds.
- **Hold Swapping**: `getCheckoutHoldAction` and `saveCheckoutGuestAction` require the exact `holdToken` UUID; guessing is impossible.
- **Price Tampering**: Prevented because monetary values are snapshotted in DB and pulled from the server directly during the review and payment boundary.
- **Capacity Tampering**: Prevented by server querying `Yacht.capacity` during the save action.

## 6. Client Confirmation Required
The following business rules still need confirmation from Chicago Yachts:
- **Taxes and Service Fees**: Currently not configured or calculated in the quote.
- **Deposit Structure**: Hardcoded placeholder at 30% for the payment boundary CTA.
- **Actual operating hours**: Hardcoded defaults are still used for Morning/Afternoon/Evening availability.

## 7. Ticket 11 Handoff
The flow successfully reaches Step 7: Review Reservation. The final "Continue to Secure Payment" boundary is prepared but inactive. 
Ticket 11 will:
1. Integrate Stripe Checkout via this boundary.
2. Formally convert the `BookingHold` to `status = "CONVERTED"`.
3. Create the persistent `Customer` record.
4. Create the formal `Booking` and `PaymentTransaction` records.
