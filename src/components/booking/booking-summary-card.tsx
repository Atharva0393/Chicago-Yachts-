import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function BookingSummaryCard({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 rounded-2xl border bg-card shadow-sm sticky top-24", className)}>
      <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
      <div className="space-y-4 mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Yacht Rate (4 hrs)</span>
          <span className="font-medium">,800</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Captain Fee</span>
          <span className="font-medium"></span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Taxes & Fees</span>
          <span className="font-medium"></span>
        </div>
        <div className="border-t pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>,180</span>
        </div>
      </div>
      <Button className="w-full">Confirm Booking</Button>
    </div>
  )
}
