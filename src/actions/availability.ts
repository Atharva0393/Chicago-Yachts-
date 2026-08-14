"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-server";
import { AvailabilityStatus, DayAvailability } from "@/services/availability.service";
import { SLOT_TIMES } from "@/lib/constants/slot-times";

export type AdminDayAvailability = DayAvailability & {
  id?: string;
  isBlocked: boolean;
  notes?: string | null;
  slotsConfig: {
    Morning: { id?: string, isBlocked: boolean, exists: boolean };
    Afternoon: { id?: string, isBlocked: boolean, exists: boolean };
    Evening: { id?: string, isBlocked: boolean, exists: boolean };
  }
};

function buildDate(year: number | string, month: number | string, day: number | string) {
  const y = typeof year === "string" ? parseInt(year, 10) : Number(year);
  const m = typeof month === "string" ? parseInt(month, 10) : Number(month);
  const d = typeof day === "string" ? parseInt(day, 10) : Number(day);
  return new Date(Date.UTC(y, m, d));
}

function getSlotName(startHour: number): "Morning" | "Afternoon" | "Evening" | null {
  if (startHour === SLOT_TIMES.Morning.startHour) return "Morning";
  if (startHour === SLOT_TIMES.Afternoon.startHour) return "Afternoon";
  if (startHour === SLOT_TIMES.Evening.startHour) return "Evening";
  return null;
}

// Helper to get today's date in Chicago for past-date protection
function getChicagoTodayUTC(): Date {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'numeric', day: 'numeric' });
  const parts = formatter.formatToParts(now);
  let chicagoYear = 0, chicagoMonth = 0, chicagoDay = 0;
  for (const p of parts) {
    if (p.type === 'year') chicagoYear = parseInt(p.value, 10);
    if (p.type === 'month') chicagoMonth = parseInt(p.value, 10);
    if (p.type === 'day') chicagoDay = parseInt(p.value, 10);
  }
  return buildDate(chicagoYear, chicagoMonth - 1, chicagoDay);
}

/**
 * Public method to get availability for a yacht in a specific month
 */
export async function getPublicAvailability(yachtId: string, month: number, year: number): Promise<Record<string, DayAvailability>> {
  try {
    const numMonth = typeof month === "string" ? parseInt(month, 10) : Number(month);
    const numYear = typeof year === "string" ? parseInt(year, 10) : Number(year);

    if (!yachtId) return {};

    let dbHost = "unknown";
    try {
      const dbUrl = process.env.DATABASE_URL || "";
      const match = dbUrl.match(/@([^:\/]+)/);
      if (match && match[1]) {
        dbHost = match[1];
      } else if (dbUrl) {
        dbHost = dbUrl.substring(0, 20) + "...";
      }
    } catch (e) {}

    // Raw PostgreSQL queries inside Vercel server action runtime
    const yachtCount = await db.yacht.count({ where: { id: yachtId } });
    const rawAvailabilityCount = await db.availability.count({ where: { yachtId } });
    const rawTimeSlotCount = await db.timeSlot.count({
      where: { availability: { yachtId } }
    });

    const startDate = buildDate(numYear, numMonth, 1);
    const endDate = buildDate(numYear, numMonth + 1, 0); // Last day of month
    const chicagoTodayUTC = getChicagoTodayUTC();

    const availabilities = await db.availability.findMany({
      where: {
        yachtId,
        date: {
          gte: startDate,
          lte: endDate,
        }
      },
      include: {
        timeSlots: {
          include: {
            bookingHold: true
          }
        }
      }
    });

    let filteredTimeSlotCount = 0;
    for (const a of availabilities) {
      filteredTimeSlotCount += a.timeSlots.length;
    }

    const daysInMonth = endDate.getUTCDate();
    const result: Record<string, DayAvailability> = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${numYear}-${String(numMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dateObj = buildDate(numYear, numMonth, day);
      
      // Find DB record
      const dbRecord = availabilities.find(a => new Date(a.date).getTime() === dateObj.getTime());
      
      let morning = "booked" as AvailabilityStatus;
      let afternoon = "booked" as AvailabilityStatus;
      let evening = "booked" as AvailabilityStatus;

      // PAST DATE PROTECTION
      if (dateObj.getTime() < chicagoTodayUTC.getTime()) {
        // Past dates are strictly booked/unavailable
      } else if (dbRecord && !dbRecord.isBlocked) {
        // Check each timeslot
        for (const slot of dbRecord.timeSlots) {
          const slotTime = new Date(slot.startTime);
          const startHour = slotTime.getUTCHours();
          const slotName = getSlotName(startHour);
          if (slotName && !slot.isBlocked) {
            let status: AvailabilityStatus = "available";
            
            if (slot.bookingId) {
              status = "booked"; // Booking-aware
            } else if (slot.bookingHold) {
              const hold = slot.bookingHold;
              const now = new Date();
              // Active BookingHold-aware: expired hold does not permanently block
              if (hold.status === 'ACTIVE' && new Date(hold.expiresAt) > now) {
                status = "pending";
              }
            }
            
            if (slotName === "Morning") morning = status;
            if (slotName === "Afternoon") afternoon = status;
            if (slotName === "Evening") evening = status;
          }
        }
      }

      // Full Day requires all 3 to be available
      const fullDayAvailable = morning === 'available' && afternoon === 'available' && evening === 'available';
      const fullDayPending = !fullDayAvailable && (morning === 'pending' || afternoon === 'pending' || evening === 'pending');
      const fullDayStatus: AvailabilityStatus = fullDayAvailable ? "available" : (fullDayPending ? "pending" : "booked");

      result[dateStr] = {
        date: dateStr,
        slots: {
          Morning: morning,
          Afternoon: afternoon,
          Evening: evening,
          "Full Day": fullDayStatus
        }
      };
    }

    // Attach temporary safe diagnostics
    const debugInfo = {
      yachtId,
      yachtExists: yachtCount > 0,
      rawYachtCount: yachtCount,
      availabilityRowCount: rawAvailabilityCount,
      timeSlotRowCount: rawTimeSlotCount,
      filteredAvailabilityCount: availabilities.length,
      filteredTimeSlotCount,
      requestedStart: startDate.toISOString(),
      requestedEnd: endDate.toISOString(),
      databaseHostFingerprint: dbHost,
      serverTime: new Date().toISOString(),
      error: null
    };
    (result as any)._debug = debugInfo;
    (result as any).debug = debugInfo;

    return result;
  } catch (error: any) {
    console.error("Failed to get public availability:", error);
    const result: any = {};
    const errDebug = {
      yachtId,
      yachtExists: false,
      rawYachtCount: 0,
      availabilityRowCount: 0,
      timeSlotRowCount: 0,
      filteredAvailabilityCount: 0,
      filteredTimeSlotCount: 0,
      requestedStart: "",
      requestedEnd: "",
      databaseHostFingerprint: "error",
      serverTime: new Date().toISOString(),
      error: error?.message || String(error)
    };
    result._debug = errDebug;
    result.debug = errDebug;
    return result;
  }
}

/**
 * Admin method to get configuration
 */
export async function getAdminAvailability(yachtId: string, month: number, year: number): Promise<Record<string, AdminDayAvailability>> {
  await requireAdmin();
  
  const startDate = buildDate(year, month, 1);
  const endDate = buildDate(year, month + 1, 0); // Last day of month

  const availabilities = await db.availability.findMany({
    where: {
      yachtId,
      date: {
        gte: startDate,
        lte: endDate,
      }
    },
    include: {
      timeSlots: {
        include: { bookingHold: true }
      }
    }
  });

  const daysInMonth = endDate.getUTCDate();
  const result: Record<string, AdminDayAvailability> = {};

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateObj = buildDate(year, month, day);
    
    const dbRecord = availabilities.find(a => a.date.getTime() === dateObj.getTime());
    
    // Default public slot views
    let morning = "booked" as AvailabilityStatus;
    let afternoon = "booked" as AvailabilityStatus;
    let evening = "booked" as AvailabilityStatus;
    
    // Admin config views
    const slotsConfig = {
      Morning: { isBlocked: false, exists: false, id: undefined as string | undefined },
      Afternoon: { isBlocked: false, exists: false, id: undefined as string | undefined },
      Evening: { isBlocked: false, exists: false, id: undefined as string | undefined },
    };

    if (dbRecord) {
      for (const slot of dbRecord.timeSlots) {
        const startHour = slot.startTime.getUTCHours();
        const slotName = getSlotName(startHour);
        if (slotName) {
          slotsConfig[slotName].exists = true;
          slotsConfig[slotName].isBlocked = slot.isBlocked;
          slotsConfig[slotName].id = slot.id;

          if (!dbRecord.isBlocked && !slot.isBlocked) {
            let status: AvailabilityStatus = "available";
            if (slot.bookingId) {
              status = "booked";
            } else if (slot.bookingHold) {
              const hold = slot.bookingHold;
              const now = new Date();
              if (hold.status === 'ACTIVE' && hold.expiresAt > now) {
                status = "pending";
              }
            }
            
            if (slotName === "Morning") morning = status;
            if (slotName === "Afternoon") afternoon = status;
            if (slotName === "Evening") evening = status;
          }
        }
      }
    }

    const fullDayAvailable = morning === 'available' && afternoon === 'available' && evening === 'available';
    const fullDayPending = !fullDayAvailable && (morning === 'pending' || afternoon === 'pending' || evening === 'pending');

    result[dateStr] = {
      id: dbRecord?.id,
      date: dateStr,
      isBlocked: dbRecord?.isBlocked || false,
      notes: dbRecord?.notes,
      slotsConfig,
      slots: {
        Morning: morning,
        Afternoon: afternoon,
        Evening: evening,
        "Full Day": fullDayAvailable ? "available" : (fullDayPending ? "pending" : "booked")
      }
    };
  }

  return result;
}

export type SetDayAvailabilityData = {
  isConfigured: boolean; // if false, delete the Availability record completely
  isBlocked: boolean; // if true, whole day is blocked
  notes?: string;
  slots: {
    Morning: boolean;
    Afternoon: boolean;
    Evening: boolean;
  }
};

/**
 * Function to securely create a TimeSlot with overlap prevention.
 */
async function createTimeSlotWithOverlapCheck(availabilityId: string, startTime: Date, endTime: Date) {
  // Check for overlap within this availability ID
  const overlapping = await db.timeSlot.findFirst({
    where: {
      availabilityId,
      OR: [
        {
          startTime: { lt: endTime },
          endTime: { gt: startTime }
        }
      ]
    }
  });

  if (overlapping) {
    throw new Error("TIME_SLOT_OVERLAP");
  }

  return await db.timeSlot.create({
    data: {
      availabilityId,
      startTime,
      endTime,
      isBlocked: false,
    }
  });
}

/**
 * Admin method to set availability for a single day
 */
export async function setDayAvailability(yachtId: string, dateStr: string, data: SetDayAvailabilityData) {
  await requireAdmin();
  
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = buildDate(year, month - 1, day);

  // If not configured, delete if exists
  if (!data.isConfigured) {
    await db.availability.deleteMany({
      where: { yachtId, date: dateObj }
    });
    return { success: true };
  }

  // Create or Update
  const availability = await db.availability.upsert({
    where: {
      yachtId_date: { yachtId, date: dateObj }
    },
    update: {
      isBlocked: data.isBlocked,
      notes: data.notes || null,
    },
    create: {
      yachtId,
      date: dateObj,
      isBlocked: data.isBlocked,
      notes: data.notes || null,
    }
  });

  // Handle TimeSlots
  // Fetch existing
  const existingSlots = await db.timeSlot.findMany({
    where: { availabilityId: availability.id }
  });

  const desiredSlots = [];
  if (!data.isBlocked) {
    if (data.slots.Morning) desiredSlots.push("Morning");
    if (data.slots.Afternoon) desiredSlots.push("Afternoon");
    if (data.slots.Evening) desiredSlots.push("Evening");
  }

  // Find slots to create or delete
  for (const slotName of ["Morning", "Afternoon", "Evening"] as const) {
    const config = SLOT_TIMES[slotName];
    const exists = existingSlots.find(s => s.startTime.getUTCHours() === config.startHour);
    const shouldExist = desiredSlots.includes(slotName);

    if (shouldExist && !exists) {
      // Create it with overlap prevention mechanism
      const startTime = buildDate(1970, 0, 1);
      startTime.setUTCHours(config.startHour, 0, 0, 0);
      
      const endTime = buildDate(1970, 0, 1);
      endTime.setUTCHours(config.endHour, 0, 0, 0);

      await createTimeSlotWithOverlapCheck(availability.id, startTime, endTime);
    } else if (!shouldExist && exists) {
      // Delete it if safe, else mark blocked
      if (exists.bookingId || exists.holdId) {
        await db.timeSlot.update({
          where: { id: exists.id },
          data: { isBlocked: true }
        });
      } else {
        await db.timeSlot.delete({
          where: { id: exists.id }
        });
      }
    } else if (shouldExist && exists && exists.isBlocked) {
      // Unblock it
      await db.timeSlot.update({
        where: { id: exists.id },
        data: { isBlocked: false }
      });
    }
  }

  return { success: true };
}
