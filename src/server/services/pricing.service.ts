import { db } from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";
import { DayType, TimePeriod, PricingRule } from "@prisma/client";

export type QuoteRequest = {
  yachtId: string;
  dateStr: string; // YYYY-MM-DD
  timeSlot: "Morning" | "Afternoon" | "Evening" | "Full Day";
  duration: number; // in hours
  guests: number;
  addonsTotal?: number;
};

export type QuoteResponse = {
  status: "SUCCESS" | "PRICING_NOT_CONFIGURED" | "UNAVAILABLE" | "INVALID_DURATION";
  quote?: {
    yachtId: string;
    date: string;
    dayType: DayType;
    timePeriod: TimePeriod;
    duration: number;
    baseAmount: string;
    taxAmount: string;
    serviceFee: string;
    totalAmount: string;
    currency: string;
    pricingRuleId: string;
    
    // Breakdown for UI presentation ONLY
    baseCharter: string;
    addons: string;
    subtotal: string;
  };
};

class ServerPricingService {
  /**
   * Determine the DayType (WEEKDAY/WEEKEND) safely using America/Chicago timezone
   */
  private getChicagoDayType(dateStr: string): DayType {
    const [year, month, day] = dateStr.split('-').map(Number);
    // Construct UTC date at noon to avoid boundary edge cases
    const dateObj = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', weekday: 'short' });
    const weekdayStr = formatter.format(dateObj); // "Mon", "Sat", etc.

    if (weekdayStr === 'Sat' || weekdayStr === 'Sun') {
      return DayType.WEEKEND; // TODO: Client Confirmation Required for accurate weekend definition
    }
    return DayType.WEEKDAY;
  }

  private mapTimePeriod(slot: "Morning" | "Afternoon" | "Evening" | "Full Day"): TimePeriod {
    switch (slot) {
      case "Morning": return TimePeriod.MORNING;
      case "Afternoon": return TimePeriod.AFTERNOON;
      case "Evening": return TimePeriod.EVENING;
      case "Full Day": return TimePeriod.FULL_DAY;
      default: return TimePeriod.CUSTOM;
    }
  }

  /**
   * Calculate exact pricing quote securely on the server
   */
  async calculateQuote(req: QuoteRequest): Promise<QuoteResponse> {
    try {
      const dayType = this.getChicagoDayType(req.dateStr);
      const timePeriod = this.mapTimePeriod(req.timeSlot);

      // Check for effective rules
      const [year, month, day] = req.dateStr.split('-').map(Number);
      const queryDate = new Date(Date.UTC(year, month - 1, day));

      // 1. Fetch matching active pricing rules
      const rules = await db.pricingRule.findMany({
        where: {
          yachtId: req.yachtId,
          isActive: true,
          OR: [
            { dayType: dayType },
            { dayType: "WEEKDAY" } // If weekend not explicitly defined, we will sort and check priority. Actually, Prisma exact match first.
            // Wait, Chicago Yachts may only have a WEEKDAY base rule. We should just fetch all active rules for this yacht and filter in JS to be safe and handle fallbacks correctly.
          ]
        }
      });

      // Refetch all active rules for this yacht to perform complex fallback logic in memory safely
      const allRules = await db.pricingRule.findMany({
        where: {
          yachtId: req.yachtId,
          isActive: true
        }
      });

      if (allRules.length === 0) {
        return { status: "PRICING_NOT_CONFIGURED" };
      }

      // 2. Filter valid rules
      const validRules = allRules.filter(rule => {
        // Duration filter
        if (req.duration < rule.minDuration || req.duration > rule.maxDuration) return false;
        
        // Effective date filter
        if (rule.effectiveFrom && rule.effectiveFrom > queryDate) return false;
        if (rule.effectiveTo && rule.effectiveTo < queryDate) return false;

        // DayType filter: Must match exactly, or fallback to the generic base if priority allows
        if (rule.dayType !== dayType && rule.dayType !== DayType.WEEKDAY) return false; // Usually WEEKDAY acts as base if no WEEKEND exists

        // TimePeriod filter: Must match exactly, or fallback to CUSTOM
        if (rule.timePeriod !== timePeriod && rule.timePeriod !== TimePeriod.CUSTOM) return false;

        return true;
      });

      if (validRules.length === 0) {
        return { status: "PRICING_NOT_CONFIGURED" };
      }

      // 3. Priority Sort: 
      // Highest priority wins. If tie, exact DayType match wins. If tie, exact TimePeriod match wins.
      validRules.sort((a, b) => {
        if (a.priority !== b.priority) return b.priority - a.priority;
        
        const aDayMatch = a.dayType === dayType ? 1 : 0;
        const bDayMatch = b.dayType === dayType ? 1 : 0;
        if (aDayMatch !== bDayMatch) return bDayMatch - aDayMatch;

        const aTimeMatch = a.timePeriod === timePeriod ? 1 : 0;
        const bTimeMatch = b.timePeriod === timePeriod ? 1 : 0;
        return bTimeMatch - aTimeMatch;
      });

      const selectedRule = validRules[0];

      // 4. Decimal Math Calculation
      let baseCharterAmount = new Decimal(0);

      if (selectedRule.hourlyRate && selectedRule.hourlyRate.gt(0)) {
        baseCharterAmount = selectedRule.hourlyRate.mul(req.duration);
      } else {
        baseCharterAmount = selectedRule.basePrice;
      }

      const addons = new Decimal(req.addonsTotal || 0);
      const subtotal = baseCharterAmount.add(addons);
      
      // TODO: CLIENT CONFIRMATION REQUIRED for taxes and service fees.
      // Setting to 0 strictly as unconfigured, rather than asserting Chicago Yachts doesn't charge them.
      const taxAmount = new Decimal(0);
      const serviceFee = new Decimal(0);
      
      const totalAmount = subtotal.add(taxAmount).add(serviceFee);

      return {
        status: "SUCCESS",
        quote: {
          yachtId: req.yachtId,
          date: req.dateStr,
          dayType,
          timePeriod,
          duration: req.duration,
          baseAmount: baseCharterAmount.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          serviceFee: serviceFee.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          currency: "USD",
          pricingRuleId: selectedRule.id,
          
          baseCharter: baseCharterAmount.toFixed(2),
          addons: addons.toFixed(2),
          subtotal: subtotal.toFixed(2)
        }
      };
    } catch (error) {
      console.error("Pricing engine error:", error);
      return { status: "PRICING_NOT_CONFIGURED" }; // Fail closed
    }
  }
}

export const serverPricingService = new ServerPricingService();
