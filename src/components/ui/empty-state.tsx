import * as React from "react"
import { FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"

export function EmptyState({ title, description, className }: { title: string, description: string, className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed", className)}>
      <div className="p-4 bg-muted rounded-full mb-4">
        <FolderOpen className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
