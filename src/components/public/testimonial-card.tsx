import * as React from "react"
import { cn } from "@/lib/utils"
import { Rating } from "@/components/ui/rating"

export function TestimonialCard({ name, text, className }: { name: string, text: string, className?: string }) {
  return (
    <div className={cn("p-6 rounded-2xl bg-card border shadow-sm", className)}>
      <Rating rating={5} className="mb-4" />
      <p className="text-muted-foreground mb-6">"{text}"</p>
      <div className="font-medium">{name}</div>
    </div>
  )
}
