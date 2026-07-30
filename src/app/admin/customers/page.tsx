"use client"

import { EmptyState } from "@/components/shared/EmptyState"
import { Users } from "lucide-react"

export default function CustomersPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col justify-center">
      <EmptyState 
        icon={Users}
        title="Customer Directory"
        description="Manage your client database, view history, and handle accounts. This module is pending Phase 2 functionality."
      />
    </div>
  )
}
