import * as React from "react"
import { cn } from "@/lib/utils"

export function PriceDisplay({ amount, period = "hour", className }: { amount: number, period?: string, className?: string }) {
  return (
    <div className={cn("flex items-baseline gap-1", className)}>
      <span className="text-2xl font-bold tracking-tight"></span>
      <span className="text-sm text-muted-foreground">/{period}</span>
    </div>
  )
}
