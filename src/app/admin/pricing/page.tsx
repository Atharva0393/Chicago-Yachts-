"use client"

import { EmptyState } from "@/components/shared/EmptyState"
import { Tags } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col justify-center">
      <EmptyState 
        icon={Tags}
        title="Dynamic Pricing"
        description="Configure pricing rules, seasonal rates, and special promotions. This module is pending Phase 2 functionality."
      />
    </div>
  )
}
