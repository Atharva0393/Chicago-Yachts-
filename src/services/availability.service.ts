export type AvailabilityStatus = 'available' | 'booked' | 'blocked' | 'pending';
export type TimeSlot = 'Morning' | 'Afternoon' | 'Evening' | 'Full Day';

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  slots: {
    Morning: AvailabilityStatus;
    Afternoon: AvailabilityStatus;
    Evening: AvailabilityStatus;
    "Full Day": AvailabilityStatus;
  };
}

import { getPublicAvailability } from "@/actions/availability";

class AvailabilityService {
  /**
   * Get real availability for a specific month from the database.
   */
  async getAvailability(yachtId: string, month: number, year: number): Promise<Record<string, DayAvailability>> {
    try {
      return await getPublicAvailability(yachtId, month, year);
    } catch (e) {
      console.error("Failed to fetch availability from server", e);
      return {};
    }
  }
}

export const availabilityService = new AvailabilityService();
