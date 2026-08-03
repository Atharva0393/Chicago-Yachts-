import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { finalizePaidBooking, RefundRequiredError, BookingFinalizationError } from "@/server/services/booking-finalization.service";

/**
 * Stripe Webhook Handler — Ticket 11B Implementation
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  // HARD FAIL if webhook secret not configured for production verification.
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event;
  
  // FOR TICKET 11B QA (BLOCKED ON STRIPE CREDENTIALS):
  // We will simulate the parsed event securely for QA testing purposes.
  // If signature == "qa_bypass_signature", we trust the body for local direct domain tests.
  if (sig === "qa_bypass_signature" && process.env.NODE_ENV !== "production") {
    try {
      event = JSON.parse(body);
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON body for QA bypass" }, { status: 400 });
    }
  } else {
    if (!STRIPE_WEBHOOK_SECRET) {
      console.error("STRIPE_WEBHOOK_SECRET is not configured. Rejecting webhook.");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    try {
      event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      if (session.payment_status === "paid") {
        const stripeSessionId = session.id;
        const paymentIntentId = session.payment_intent as string;
        const amountPaidCents = session.amount_total;
        const currency = session.currency;

        try {
          const result = await finalizePaidBooking({
            stripeSessionId,
            paymentIntentId,
            amountPaidCents,
            currency,
          });
          
          return NextResponse.json({ received: true, result });
        } catch (error) {
          if (error instanceof RefundRequiredError) {
            // Log critical alert! The payment succeeded but the hold was expired/taken.
            // TODO: Implement automatic Stripe refund using Stripe API here.
            console.error(`[CRITICAL] Refund required for Stripe Session ${error.stripeSessionId}. Message: ${error.message}`);
            // Returning 200 to Stripe so they don't retry, but we have logged the critical need for refund.
            // We do NOT want Stripe retrying a booking that we definitely rejected due to a double-booking race condition.
            return NextResponse.json({ received: true, status: "refund_required" });
          }
          if (error instanceof BookingFinalizationError) {
            console.error(`[Finalization Error] ${error.message}`);
            return NextResponse.json({ error: error.message }, { status: 400 });
          }
          
          // Re-throw generic errors to be caught by outer catch block
          console.error("[Stripe Webhook Error]", error);
          return NextResponse.json({ error: "Internal webhook handler error" }, { status: 500 });
        }
      }
      break;
    }

    case "checkout.session.expired": {
      console.log("[WEBHOOK] checkout.session.expired received.");
      break;
    }

    case "payment_intent.payment_failed": {
      console.log("[WEBHOOK] payment_intent.payment_failed received.");
      break;
    }

    default:
      console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
