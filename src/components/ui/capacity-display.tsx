import * as React from "react"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function CapacityDisplay({ maxGuests, className }: { maxGuests: number, className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5 text-sm text-muted-foreground", className)}>
      <Users className="w-4 h-4" />
      <span>Up to {maxGuests} Guests</span>
    </div>
  )
}
