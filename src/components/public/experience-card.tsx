import * as React from "react"
import { cn } from "@/lib/utils"

export function ExperienceCard({ title, description, className }: { title: string, description: string, className?: string }) {
  return (
    <div className={cn("group relative rounded-2xl overflow-hidden aspect-square bg-muted", className)}>
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/80 text-sm">{description}</p>
      </div>
    </div>
  )
}
