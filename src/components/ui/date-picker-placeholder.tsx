import * as React from "react"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function DatePickerPlaceholder({ className }: { className?: string }) {
  return (
    <Button variant="outline" className={cn("w-full justify-start text-left font-normal text-muted-foreground", className)}>
      <Calendar className="mr-2 h-4 w-4" />
      <span>Select date</span>
    </Button>
  )
}
