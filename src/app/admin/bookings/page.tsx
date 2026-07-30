"use client"

import { EmptyState } from "@/components/shared/EmptyState"
import { CalendarDays } from "lucide-react"

export default function BookingsPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col justify-center">
      <EmptyState 
        icon={CalendarDays}
        title="Booking Management"
        description="Review and manage customer charter bookings. This module is pending Phase 2 functionality."
      />
    </div>
  )
}
