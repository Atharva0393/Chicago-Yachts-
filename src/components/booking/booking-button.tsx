import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function BookingButton({ className }: { className?: string }) {
  return (
    <Button className={cn("w-full bg-primary text-primary-foreground text-lg py-6 rounded-xl", className)}>
      Request to Book
    </Button>
  )
}
