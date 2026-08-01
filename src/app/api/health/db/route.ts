import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Attempt a lightweight query to verify connectivity
    await db.$queryRaw`SELECT 1`
    
    return NextResponse.json({ database: "connected" }, { status: 200 })
  } catch (error) {
    // Intentionally obscuring the error stack trace from public view for security
    console.error("Database health check failed:", error)
    return NextResponse.json({ database: "unavailable" }, { status: 503 })
  }
}
