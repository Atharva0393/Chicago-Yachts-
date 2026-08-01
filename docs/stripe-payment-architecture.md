# Stripe Payment Architecture (Ticket 11A)

## Overview
This document describes the Stripe TEST-mode payment session infrastructure. This covers Ticket 11A (session creation) and prepares for Ticket 11B (webhook finalization).

## System Flow

```
Customer: "Continue to Secure Payment"
         ↓
createStripeCheckoutAction(holdToken)   ← Server Action
         ↓
1. Fetch BookingHold from DB via holdToken only
2. Verify status = ACTIVE, expiresAt > now()
3. Verify all guest fields populated
4. Revalidate guestCount <= yacht.capacity
5. Extract totalAmount from DB snapshot
6. Convert: $1,280.00 → 128000 cents (server-side, integer math)
7. Assert amount > 0 (zero/negative rejected)
8. Idempotency check: if stripeSessionId exists, reuse if still open
9. Create Stripe Checkout Session (mode=payment, currency=usd)
10. Save session.id → BookingHold.stripeSessionId
11. Return session.url to client
         ↓
Client: window.location.href = session.url
         ↓
Stripe-hosted Checkout Page (test mode)
         ↓
On success → /booking/success?session_id=...
On cancel  → /booking/cancel
```

## Server-Authoritative Payment Amount

The browser transmits exactly ONE piece of data: `holdToken` (a UUID).

It does NOT transmit:
- Price
- Subtotal
- Duration
- Yacht ID
- Guest count
- Any payment amount

The payment amount is derived exclusively from the `BookingHold.totalAmount` Prisma field, which was snapshotted at the moment the hold was created using the PostgreSQL-backed pricing engine (Ticket 8).

```
// Decimal → Cents conversion (safe, server-side)
const amountFloat = parseFloat(hold.totalAmount.toString());
const amountInCents = Math.round(amountFloat * 100);
```

## Payment Strategy

**Current**: Full payment (`mode: "payment"`) in TEST mode.

This is a **DEVELOPMENT TECHNICAL DECISION**, not a verified Chicago Yachts business rule.

The payment strategy is centralized in `src/actions/payment.ts`. Deposit support can be introduced without rewiring the checkout flow once the business configuration is confirmed.

> [!IMPORTANT]
> **DEPOSIT POLICY — CLIENT CONFIRMATION REQUIRED**  
> Chicago Yachts has not confirmed whether they require:
> - Full payment upfront
> - A deposit + balance-due structure
> - A specific deposit percentage  
>
> Do NOT display any deposit percentage or balance-due calculation until confirmed.

## Stripe Checkout Session Configuration

```typescript
stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  mode: "payment",
  customer_email: hold.customerEmail,   // pre-fill from DB
  metadata: {
    bookingHoldId: hold.id,             // used for webhook resolution
  },
  line_items: [{
    price_data: {
      currency: "usd",                  // server-controlled
      product_data: {
        name: `Yacht Charter: ${hold.yacht.name}`,
      },
      unit_amount: amountInCents,       // from DB snapshot
    },
    quantity: 1,
  }],
  success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url:  `${origin}/booking/cancel`,
  expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
})
```

## Session Idempotency (Duplicate Click Protection)

The server stores `stripeSessionId` on the `BookingHold` record after creating a session.

If the customer double-clicks "Continue to Secure Payment":
1. Server fetches `BookingHold.stripeSessionId`
2. Server calls `stripe.checkout.sessions.retrieve(id)`
3. If `status === "open"` → reuse URL
4. If expired/completed → create a new session

This prevents unlimited parallel Stripe sessions per hold.

## Success Redirect — Non-Authoritative

Landing on `/booking/success` does **NOT** confirm the booking.

Stripe redirects to `success_url` immediately when the customer submits payment. However, the actual charge may still be processing.

The only authoritative signal is the `checkout.session.completed` Stripe webhook event.

The `/booking/success` page informs the customer their payment is pending verification.

## Cancel Behavior

Landing on `/booking/cancel` means the customer closed Stripe Checkout.

No charge was made. No BookingHold mutation occurs here.

The original hold's `expiresAt` is NOT extended. If the hold is still within its window, the customer may return and attempt checkout again.

## Hold Expiration vs Stripe Session Race Condition

This is a critical edge case:

| Event | Our BookingHold | Stripe Session |
|-------|-----------------|----------------|
| Hold created | ACTIVE, expires T+10min | — |
| Stripe session created | ACTIVE | Open, expires T+30min |
| T+10min passes | effectively expired | Still open |
| Customer completes payment at T+25min | EXPIRED | Payment succeeded |

**Result**: Payment captured in Stripe but hold expired on our end. The TimeSlot may have been released and re-allocated.

**Ticket 11B must handle this explicitly:**
1. Webhook receives `checkout.session.completed`
2. Extract `bookingHoldId` from metadata
3. Re-fetch `BookingHold` and check `expiresAt`
4. **If hold expired → initiate Stripe refund + flag for manual review. Do NOT create Booking.**
5. If hold valid → atomically create Booking, Customer, PaymentTransaction

## Webhook Security

The webhook handler (`/api/webhooks/stripe`) enforces strict signature verification:

```typescript
// HARD FAIL if secret not configured
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
}

event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
```

If `STRIPE_WEBHOOK_SECRET` is missing or the signature is invalid, the request is rejected. There is **no fallback to unverified JSON parsing**.

## Stripe Metadata

Only the minimum required identifier is placed in Stripe metadata:

```
metadata: { bookingHoldId: hold.id }
```

No PII, no pricing, no yacht details. The webhook will retrieve authoritative data from the DB using `bookingHoldId`.

## Environment Variables Required

```bash
# Server-only — NEVER expose to browser
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Browser-safe (if needed for future Stripe.js)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Required for Stripe redirect URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> [!CAUTION]
> Never commit `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` to Git or documentation.

## Ticket 11B Handoff: Webhook Finalization

The webhook stub at `/api/webhooks/stripe` is ready. Ticket 11B must implement:

1. **`checkout.session.completed`** handler:
   - Extract `bookingHoldId` from `event.data.object.metadata`
   - Re-fetch `BookingHold`, verify `expiresAt > now()`
   - **If expired**: initiate Stripe refund, log exception
   - **If valid**: atomically in a DB transaction:
     - Upsert `Customer` from hold's draft guest fields
     - Create `Booking` (`bookingStatus: CONFIRMED`, `paymentStatus: PAID`)
     - Assign `TimeSlot` records from hold to Booking
     - Create `PaymentTransaction` (`type: FULL_PAYMENT`, `stripeSessionId: session.id`)
     - Update `BookingHold.status = CONVERTED`
     - Send confirmation email via Resend/SendGrid

2. **`checkout.session.expired`**: Optionally clear `stripeSessionId` from `BookingHold`

3. **`payment_intent.payment_failed`**: Log failure, notify customer

## Client Confirmation Required

| Item | Status |
|------|--------|
| Deposit policy (% of total) | ⚠️ NOT CONFIRMED |
| Tax rules and percentages | ⚠️ NOT CONFIRMED |
| Service fee calculation | ⚠️ NOT CONFIRMED |
| Balance-due payment policy | ⚠️ NOT CONFIRMED |
| Hold duration (currently 10 min) | ⚠️ NOT CONFIRMED |
| Operating time blocks | ⚠️ NOT CONFIRMED |
