"use server";

import { bookingHoldService, CreateHoldRequest, CreateHoldResponse } from "@/server/services/booking-hold.service";

// Simple in-memory rate limiting map.
// LIMITATION: This will reset on server restarts/deployments, and in a Serverless environment (like Vercel)
// this is scoped to the individual lambda instance. Production rate limiting for abuse prevention
// should use Redis or Vercel KV.
const rateLimitMap = new Map<string, { count: number, resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetAt) {
    // 10 holds per 5 minutes per IP
    rateLimitMap.set(ip, { count: 1, resetAt: now + 5 * 60 * 1000 });
    return true;
  }

  if (record.count >= 10) {
    return false; // Rate limited
  }

  record.count += 1;
  return true;
}

export async function createBookingHoldAction(req: CreateHoldRequest): Promise<CreateHoldResponse> {
  // Ideally, use headers().get('x-forwarded-for') to get IP, but for now we'll just use a fallback 
  // since this is MVP and we are demonstrating the rate limit architecture boundary.
  const mockIp = "127.0.0.1"; 
  
  if (!checkRateLimit(mockIp)) {
    console.warn(`[RATE LIMIT] Hold creation rate limited for IP: ${mockIp}`);
    return { status: "ERROR" }; // Fail closed on abuse
  }

  try {
    const res = await bookingHoldService.createBookingHold(req);
    if (res.status !== "SUCCESS") {
      console.warn("[ACTION WARN] createBookingHoldAction status:", {
        status: res.status,
        req: { yachtId: req.yachtId, dateStr: req.dateStr, timeSlot: req.timeSlot, guests: req.guests }
      });
    }
    return res;
  } catch (error: any) {
    console.error("[ACTION ERROR] createBookingHoldAction failed:", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      req: { yachtId: req.yachtId, dateStr: req.dateStr, timeSlot: req.timeSlot }
    });
    return { status: "ERROR" };
  }
}

export async function getHoldStatusAction(holdToken: string) {
  try {
    const res = await bookingHoldService.getHoldStatus(holdToken);
    
    // Do not return internal sensitive database IDs unnecessarily, just public status
    if (res.status === "INVALID") return { status: "INVALID" };
    
    return {
      status: res.status,
      expiresAt: res.hold?.expiresAt,
      subtotal: res.hold?.subtotal?.toString(),
      totalAmount: res.hold?.totalAmount?.toString()
    };
  } catch (error) {
    console.error("Action error in getHoldStatusAction:", error);
    return { status: "ERROR" };
  }
}

export async function releaseHoldAction(holdToken: string) {
  try {
    await bookingHoldService.releaseBookingHold(holdToken);
    return { success: true };
  } catch (error) {
    console.error("Action error in releaseHoldAction:", error);
    return { success: false };
  }
}
