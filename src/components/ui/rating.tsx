import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function Rating({ rating, count, className }: { rating: number, count?: number, className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-sm text-muted-foreground">({count})</span>}
    </div>
  )
}
