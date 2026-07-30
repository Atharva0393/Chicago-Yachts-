"use client"

import { EmptyState } from "@/components/shared/EmptyState"
import { CalendarClock } from "lucide-react"

export default function CalendarPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col justify-center">
      <EmptyState 
        icon={CalendarClock}
        title="Master Calendar"
        description="View fleet availability, maintenance schedules, and booked charters. This module is pending Phase 2 functionality."
      />
    </div>
  )
}
