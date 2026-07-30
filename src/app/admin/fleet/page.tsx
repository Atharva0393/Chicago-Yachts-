"use client"

import { EmptyState } from "@/components/shared/EmptyState"
import { Anchor } from "lucide-react"

export default function FleetPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col justify-center">
      <EmptyState 
        icon={Anchor}
        title="Fleet Management"
        description="Add, edit, or remove yachts from your charter fleet. This module is pending Phase 2 functionality."
      />
    </div>
  )
}
