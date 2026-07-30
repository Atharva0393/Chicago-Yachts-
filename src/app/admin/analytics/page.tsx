"use client"

import { EmptyState } from "@/components/shared/EmptyState"
import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col justify-center">
      <EmptyState 
        icon={BarChart3}
        title="Analytics & Reports"
        description="Deep insights into revenue, fleet utilization, and customer metrics. This module is pending Phase 2 functionality."
      />
    </div>
  )
}
