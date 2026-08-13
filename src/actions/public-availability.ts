"use server";

import { db } from "@/lib/db";
import { AvailabilityStatus, DayAvailability } from "@/services/availability.service";
import { SLOT_TIMES } from "@/lib/constants/slot-times";

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

export async function getPublicAvailability(yachtId: string, month: number, year: number): Promise<any> {
  try {
    const numMonth = typeof month === "string" ? parseInt(month, 10) : Number(month);
    const numYear = typeof year === "string" ? parseInt(year, 10) : Number(year);

    if (!yachtId) return { success: false, data: {}, error: "Yacht ID is empty" };

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
    const data: Record<string, DayAvailability> = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${numYear}-${String(numMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dateObj = buildDate(numYear, numMonth, day);
      
      const dbRecord = availabilities.find(a => new Date(a.date).getTime() === dateObj.getTime());
      
      let morning = "booked" as AvailabilityStatus;
      let afternoon = "booked" as AvailabilityStatus;
      let evening = "booked" as AvailabilityStatus;

      // PAST DATE PROTECTION
      if (dateObj.getTime() < chicagoTodayUTC.getTime()) {
        // Past dates are strictly booked/unavailable
      } else if (dbRecord && !dbRecord.isBlocked) {
        for (const slot of dbRecord.timeSlots) {
          const slotTime = new Date(slot.startTime);
          const startHour = slotTime.getUTCHours();
          const slotName = getSlotName(startHour);
          if (slotName && !slot.isBlocked) {
            let status: AvailabilityStatus = "available";
            
            if (slot.bookingId) {
              status = "booked";
            } else if (slot.bookingHold) {
              const hold = slot.bookingHold;
              const now = new Date();
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

      const fullDayAvailable = morning === 'available' && afternoon === 'available' && evening === 'available';
      const fullDayPending = !fullDayAvailable && (morning === 'pending' || afternoon === 'pending' || evening === 'pending');
      const fullDayStatus: AvailabilityStatus = fullDayAvailable ? "available" : (fullDayPending ? "pending" : "booked");

      data[dateStr] = {
        date: dateStr,
        slots: {
          Morning: morning,
          Afternoon: afternoon,
          Evening: evening,
          "Full Day": fullDayStatus
        }
      };
    }

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

    return {
      success: true,
      data,
      debug: debugInfo
    };
  } catch (error: any) {
    console.error("Failed to get public availability:", error);
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
    return {
      success: false,
      data: {},
      debug: errDebug,
      error: error?.message || String(error)
    };
  }
}
