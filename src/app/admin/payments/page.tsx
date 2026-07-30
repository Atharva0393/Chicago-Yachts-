"use client"

import { EmptyState } from "@/components/shared/EmptyState"
import { CreditCard } from "lucide-react"

export default function PaymentsPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col justify-center">
      <EmptyState 
        icon={CreditCard}
        title="Payments & Invoices"
        description="Manage transactions, refunds, and accounting records. This module is pending Phase 2 functionality."
      />
    </div>
  )
}
