import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

/**
 * Stripe Webhook Handler — Ticket 11B Stub
 *
 * This is a STUB. The full finalization logic (creating Booking,
 * Customer, PaymentTransaction) will be implemented in Ticket 11B.
 *
 * SECURITY REQUIREMENTS:
 * - Stripe-Signature header MUST be verified against STRIPE_WEBHOOK_SECRET.
 * - STRIPE_WEBHOOK_SECRET missing = REJECT. Do not parse unverified events.
 * - Booking finalization must only occur on verified webhook events.
 * - Never trust the success redirect URL as authority for payment.
 *
 * HOLD EXPIRATION RACE CONDITION:
 * - Stripe Checkout Sessions can be open for up to 30 minutes (configured by us).
 * - Our BookingHold expires after 10 minutes (CLIENT CONFIRMATION REQUIRED for final value).
 * - If a payment succeeds AFTER the hold expired:
 *   → Do NOT blindly create a confirmed Booking (TimeSlot may have been released/re-held).
 *   → Flag for manual review and initiate Stripe refund via Stripe Dashboard or API.
 *   → This edge case is documented and will be handled in Ticket 11B.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  // HARD FAIL if webhook secret not configured — never allow unauthenticated payloads.
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured. Rejecting webhook.");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // TICKET 11B: Implement full checkout.session.completed handler here.
  // At minimum, this handler must:
  // 1. Extract bookingHoldId from event.data.object.metadata
  // 2. Re-fetch BookingHold and verify it is still ACTIVE and not expired
  // 3. If hold expired → initiate Stripe refund, flag for manual review, do NOT create Booking
  // 4. If hold valid → atomically:
  //      a. Upsert Customer from hold's guest draft fields
  //      b. Create Booking (status: CONFIRMED, paymentStatus: PAID)
  //      c. Link TimeSlots from hold to Booking
  //      d. Create PaymentTransaction (FULL_PAYMENT, amount from Stripe session)
  //      e. Update BookingHold status = CONVERTED
  //      f. Send confirmation email
  // 5. Return 200 to Stripe. Non-200 causes retry.

  switch (event.type) {
    case "checkout.session.completed": {
      console.log("[WEBHOOK STUB] checkout.session.completed received — Ticket 11B will finalize.");
      // TODO: Ticket 11B finalization logic
      break;
    }

    case "checkout.session.expired": {
      console.log("[WEBHOOK STUB] checkout.session.expired received.");
      // TODO: Optionally clear stripeSessionId from BookingHold to allow a new session
      break;
    }

    case "payment_intent.payment_failed": {
      console.log("[WEBHOOK STUB] payment_intent.payment_failed received.");
      // TODO: Log failure, potentially notify customer
      break;
    }

    default:
      console.log(`[WEBHOOK STUB] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
