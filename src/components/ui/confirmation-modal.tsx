import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function ConfirmationModal({ title, message, onConfirm, onCancel, className }: { title: string, message: string, onConfirm: () => void, onCancel: () => void, className?: string }) {
  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4", className)}>
      <div className="bg-card p-6 rounded-2xl w-full max-w-md shadow-lg border">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  )
}
