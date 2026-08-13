"use client"

import React from "react"
import { useCompare } from "@/lib/contexts/CompareContext"
import { X, Scale } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { usePathname } from "next/navigation"

export function CompareDrawer() {
  const pathname = usePathname()
  const { selectedYachts, removeYacht, clearCompare } = useCompare()

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/crm") || pathname === "/login") return null
  if (selectedYachts.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-10 pointer-events-none flex justify-center">
      <div className="bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-4 w-full max-w-4xl pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-4 transition-luxury">
        
        <div className="flex items-center gap-2 md:gap-4 flex-1 w-full overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {selectedYachts.map((yacht) => (
            <div key={yacht.id} className="relative flex items-center gap-3 bg-muted/40 rounded-xl p-2 pr-4 shrink-0 border border-border/30">
              <div className="relative h-12 w-16 md:h-16 md:w-20 rounded-lg overflow-hidden shrink-0">
                <Image src={yacht.images[0]} alt={yacht.name} fill className="object-cover" />
              </div>
              <div className="flex flex-col max-w-[120px]">
                <span className="text-xs font-semibold truncate text-foreground">{yacht.name}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">${yacht.pricePerHour}/hr</span>
              </div>
              <button 
                onClick={() => removeYacht(yacht.id)}
                className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm"
                aria-label={`Remove ${yacht.name} from comparison`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Placeholders for remaining slots */}
          {Array.from({ length: 3 - selectedYachts.length }).map((_, i) => (
            <div key={`empty-${i}`} className="hidden md:flex items-center justify-center h-20 w-48 border-2 border-dashed border-border/50 rounded-xl text-xs text-muted-foreground font-medium shrink-0 bg-muted/10">
              Add Yacht
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
          <button 
            onClick={clearCompare}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 hidden sm:block"
          >
            Clear All
          </button>
          <Link 
            href="/compare"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 h-12 rounded-xl font-semibold tracking-wide hover:bg-primary/90 transition-colors shadow-lg active:scale-95"
          >
            <Scale className="h-4 w-4" />
            Compare ({selectedYachts.length})
          </Link>
        </div>
        
      </div>
    </div>
  )
}
