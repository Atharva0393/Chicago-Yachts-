import * as React from "react"
import { cn } from "@/lib/utils"

export function FeaturedYachtCard({ className }: { className?: string }) {
  return (
    <div className={cn("relative rounded-3xl overflow-hidden aspect-[16/9] bg-muted", className)}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
        <h3 className="text-3xl font-bold text-white mb-2">The Sovereign</h3>
        <p className="text-white/80 mb-4">Experience the pinnacle of luxury on Lake Michigan.</p>
        <button className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-white/90 transition-colors">Explore Now</button>
      </div>
    </div>
  )
}
