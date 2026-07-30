"use client"

import { EmptyState } from "@/components/shared/EmptyState"
import { MessageSquare } from "lucide-react"

export default function CRMPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col justify-center">
      <EmptyState 
        icon={MessageSquare}
        title="CRM & Leads"
        description="Track inquiries, follow-ups, and customer communications. This module is pending Phase 2 functionality."
      />
    </div>
  )
}
