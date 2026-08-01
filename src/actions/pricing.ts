"use server";

import { serverPricingService, QuoteRequest, QuoteResponse } from "@/server/services/pricing.service";
import { getPublicAvailability } from "@/actions/availability";

export async function getBookingQuoteAction(req: QuoteRequest): Promise<QuoteResponse> {
  try {
    const [year, month, day] = req.dateStr.split('-').map(Number);

    // 1. Availability Cross-Validation
    // The browser might send a request for a slot that was just booked.
    // Fetch real-time availability from DB via the same engine used in Ticket 7.
    const monthAvailability = await getPublicAvailability(req.yachtId, month - 1, year);
    
    const dayData = monthAvailability[req.dateStr];
    if (!dayData) {
      return { status: "UNAVAILABLE" };
    }

    const slotStatus = dayData.slots[req.timeSlot];
    if (slotStatus !== "available") {
      return { status: "UNAVAILABLE" };
    }

    // 2. Fetch Authoritative Quote
    const quoteResult = await serverPricingService.calculateQuote(req);
    
    return quoteResult;
  } catch (error) {
    console.error("Failed to generate booking quote:", error);
    return { status: "PRICING_NOT_CONFIGURED" }; // Fail closed
  }
}
