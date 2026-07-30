"use client"

import { EmptyState } from "@/components/shared/EmptyState"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col justify-center">
      <EmptyState 
        icon={Settings}
        title="Platform Settings"
        description="Configure your enterprise application settings and integrations. This module is pending Phase 2 functionality."
      />
    </div>
  )
}
