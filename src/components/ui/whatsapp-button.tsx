import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function WhatsAppButton({ className }: { className?: string }) {
  return (
    <Button variant="outline" className={cn("gap-2 border-green-500 text-green-600 hover:bg-green-50", className)}>
      Chat on WhatsApp
    </Button>
  )
}
