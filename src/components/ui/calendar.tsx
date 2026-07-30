"use client"
import * as React from "react"
export type CalendarProps = {
  mode?: "single" | "multiple" | "range"
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  className?: string
  classNames?: Record<string, string>
}
export function Calendar({ selected, onSelect, className }: CalendarProps) {
  return (
    <div className={className}>
      <input 
        type="date" 
        onChange={(e) => {
          if (onSelect) onSelect(new Date(e.target.value));
        }}
        className="p-4 rounded-xl border border-border"
      />
      <div className="mt-2 text-sm text-muted-foreground text-center">
        {selected ? selected.toDateString() : "No date selected"}
      </div>
    </div>
  )
}
