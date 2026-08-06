import { NextRequest, NextResponse } from "next/server";
import { getPublicAvailability } from "@/actions/public-availability";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const yachtId = searchParams.get('yachtId');
    const monthStr = searchParams.get('month'); // Expecting format like "2026-08"

    if (!yachtId) {
      return NextResponse.json({
        success: false,
        stage: "validation",
        error: "yachtId is required"
      }, { status: 400 });
    }

    if (!monthStr) {
      return NextResponse.json({
        success: false,
        stage: "validation",
        error: "month parameter is required (e.g. 2026-08)"
      }, { status: 400 });
    }

    const [yearPart, monthPart] = monthStr.split('-');
    const year = parseInt(yearPart, 10);
    const month = parseInt(monthPart, 10) - 1; // getPublicAvailability expects 0-indexed month

    if (isNaN(year) || isNaN(month)) {
      return NextResponse.json({
        success: false,
        stage: "validation",
        error: "Invalid month format. Use YYYY-MM"
      }, { status: 400 });
    }

    // Reuse the existing public availability logic
    const result = await getPublicAvailability(yachtId, month, year);

    if (result && result.success) {
       return NextResponse.json({
         success: true,
         dates: Object.keys(result.data || {}).length,
         slots: result.debug?.filteredTimeSlotCount || 0,
         data: result.data,
         debug: result.debug
       });
    } else {
       return NextResponse.json({
         success: false,
         stage: "database_query",
         error: result?.error || "Unknown error in getPublicAvailability",
         debug: result?.debug
       }, { status: 500 });
    }
  } catch (error: any) {
    console.error("API Route /api/public/availability Error:", error);
    return NextResponse.json({
      success: false,
      stage: "api_route_catch",
      error: error?.message || String(error)
    }, { status: 500 });
  }
}
