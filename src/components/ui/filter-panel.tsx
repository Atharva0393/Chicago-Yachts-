import * as React from "react"
import { cn } from "@/lib/utils"

export function FilterPanel({ className }: { className?: string }) {
  return (
    <div className={cn("p-4 border rounded-xl bg-card", className)}>
      <h4 className="font-medium mb-4">Filters</h4>
      {/* Filters implementation placeholder */}
      <div className="text-sm text-muted-foreground">Price, Capacity, Type</div>
    </div>
  )
}
