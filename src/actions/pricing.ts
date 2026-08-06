"use server";

import { serverPricingService, QuoteRequest, QuoteResponse } from "@/server/services/pricing.service";
import { getPublicAvailability } from "@/actions/public-availability";

export async function getBookingQuoteAction(req: QuoteRequest): Promise<QuoteResponse> {
  try {
    const [year, month, day] = req.dateStr.split('-').map(Number);

    const monthAvailabilityResult = await getPublicAvailability(req.yachtId, month - 1, year);
    if (!monthAvailabilityResult || !monthAvailabilityResult.success || !monthAvailabilityResult.data) {
      return { status: "UNAVAILABLE" };
    }
    
    const dayData = monthAvailabilityResult.data[req.dateStr];
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
