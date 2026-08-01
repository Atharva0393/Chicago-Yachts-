"use server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function createStripeCheckoutAction(holdToken: string) {
  try {
    // 1. Fetch Authoritative Snapshot
    const hold = await db.bookingHold.findUnique({
      where: { id: holdToken },
      include: {
        yacht: true,
        timeSlots: true
      }
    });

    if (!hold) {
      return { status: "INVALID", message: "Hold not found." };
    }

    // 2. Validate state
    if (hold.status === "CONVERTED") {
      return { status: "REJECTED", message: "This reservation is already confirmed." };
    }

    if (hold.status === "EXPIRED" || hold.expiresAt < new Date()) {
      return { status: "EXPIRED", message: "Your reservation hold has expired." };
    }

    // 3. Validate complete guest information
    if (!hold.customerFirstName || !hold.customerLastName || !hold.customerEmail || !hold.guestCount) {
      return { status: "INCOMPLETE", message: "Guest information is incomplete." };
    }

    // 4. Revalidate capacity
    if (hold.guestCount > hold.yacht.capacity) {
      return { status: "REJECTED", message: `Guest count exceeds yacht capacity of ${hold.yacht.capacity}.` };
    }

    // 5. Server-Authoritative Payment Amount (Deposit Only)
    if (!hold.depositAmount || !hold.totalAmount) {
      return { status: "ERROR", message: "Financial snapshot missing on hold." };
    }
    
    // Stripe charges the deposit amount
    const amountFloat = parseFloat(hold.depositAmount.toString());
    if (isNaN(amountFloat) || amountFloat <= 0) {
      return { status: "REJECTED", message: "Invalid payment amount." };
    }

    // Convert decimal to integer cents safely
    const amountInCents = Math.round(amountFloat * 100);

    // 6. Idempotency Check: if active stripe session exists, just return it.
    if (hold.stripeSessionId) {
      try {
        const existingSession = await stripe.checkout.sessions.retrieve(hold.stripeSessionId);
        if (existingSession.status === "open") {
          return { status: "SUCCESS", url: existingSession.url };
        }
      } catch (err) {
        // If session is not found or expired in Stripe, we will just create a new one.
        console.warn("Existing Stripe session could not be reused", err);
      }
    }

    // 7. Create Stripe Checkout Session
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    // We only use standard payment mode (full payment). Deposit logic pending business review.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: hold.customerEmail,
      metadata: {
        bookingHoldId: hold.id, // The minimal ID required for webhook resolution
        paymentType: "DEPOSIT",
      },
      line_items: [
        {
          price_data: {
            currency: "usd", // Server controlled currency
            product_data: {
              name: `30% Deposit — Yacht Charter: ${hold.yacht.name}`,
              description: `${new Date(hold.startDateTime).toLocaleDateString()} - ${hold.guestCount} Guests`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking/cancel`,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // Stripe sessions require at least 30 min expiry. (Race condition handled in Webhook)
    });

    if (!session.url) {
      throw new Error("Failed to generate Stripe Checkout URL");
    }

    // 8. Save session to Hold for Idempotency
    await db.bookingHold.update({
      where: { id: hold.id },
      data: { stripeSessionId: session.id }
    });

    return { status: "SUCCESS", url: session.url };

  } catch (error) {
    console.error("Error creating stripe checkout:", error);
    return { status: "ERROR", message: "Failed to initialize secure payment." };
  }
}
