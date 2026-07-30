import * as React from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function ErrorState({ message, onRetry, className }: { message: string, onRetry?: () => void, className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center rounded-2xl border bg-destructive/5", className)}>
      <AlertCircle className="w-10 h-10 text-destructive mb-4" />
      <h3 className="font-semibold text-lg mb-2 text-destructive">Something went wrong</h3>
      <p className="text-sm text-muted-foreground mb-6">{message}</p>
      {onRetry && <Button variant="outline" onClick={onRetry}>Try Again</Button>}
    </div>
  )
}
