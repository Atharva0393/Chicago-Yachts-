import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function PricingCard({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 rounded-2xl border bg-card shadow-sm", className)}>
      <h3 className="text-lg font-semibold mb-2">Standard Hourly Rate</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-3xl font-bold tracking-tight"></span>
        <span className="text-muted-foreground">/hour</span>
      </div>
      <ul className="space-y-3 mb-6 text-sm text-muted-foreground">
        <li>✓ Professional Captain Included</li>
        <li>✓ Fuel for Standard Route</li>
        <li>✓ Basic Beverages</li>
      </ul>
      <Button className="w-full" variant="outline">Select Package</Button>
    </div>
  )
}
