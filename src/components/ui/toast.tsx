import * as React from "react"
import { cn } from "@/lib/utils"

// Minimal non-Radix toast implementation placeholder
export function Toast({ className, message, type = "success" }: { className?: string, message: string, type?: "success" | "error" }) {
  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 flex items-center p-4 rounded-md shadow-lg transition-all",
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white",
      className
    )}>
      <span>{message}</span>
    </div>
  )
}
