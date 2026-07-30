import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Rating } from "@/components/ui/rating"
import { PriceDisplay } from "@/components/ui/price-display"
import { CapacityDisplay } from "@/components/ui/capacity-display"

export function YachtCard({ className }: { className?: string }) {
  return (
    <div className={cn("group rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md overflow-hidden", className)}>
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {/* Placeholder for image */}
        <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-xl">The Majesty</h3>
            <p className="text-sm text-muted-foreground">75ft Luxury Motor Yacht</p>
          </div>
          <Rating rating={4.9} count={128} />
        </div>
        <div className="flex items-center justify-between mt-6">
          <CapacityDisplay maxGuests={12} />
          <PriceDisplay amount={450} />
        </div>
        <Button className="w-full mt-6">View Details</Button>
      </div>
    </div>
  )
}
