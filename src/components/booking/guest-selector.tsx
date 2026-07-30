import * as React from "react"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function GuestSelector({ className }: { className?: string }) {
  return (
    <Button variant="outline" className={cn("w-full justify-start text-left font-normal text-muted-foreground", className)}>
      <Users className="mr-2 h-4 w-4" />
      <span>2 Guests</span>
    </Button>
  )
}
