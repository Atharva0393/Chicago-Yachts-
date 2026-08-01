"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function MobileNav({ isOpen, onClose, className }: MobileNavProps) {
  const pathname = usePathname();
  if (!isOpen) return null;

  return (
    <div 
      id="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className={cn("md:hidden fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl animate-in fade-in duration-300", className)}
    >
      <div className="flex flex-col h-full p-6">
        <div className="flex justify-between items-center mb-12">
          <Link href="/" className="font-semibold text-lg tracking-[0.15em] uppercase" onClick={onClose} aria-label="Chicago Yachts Home">
            Chicago Yachts
          </Link>
          <button onClick={onClose} className="p-2 -mr-2 hover:bg-muted rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Close mobile menu">
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <nav className="flex flex-col gap-6 text-2xl font-medium tracking-tight mt-8" aria-label="Mobile Main Navigation">
          {["Destinations", "Experiences", "Fleet", "About", "Contact"].map((item) => {
            const href = `/${item.toLowerCase()}`
            const isActive = pathname?.startsWith(href)
            return (
              <Link 
                key={item} 
                href={href} 
                onClick={onClose} 
                className={cn(
                  "transition-colors flex items-center min-h-[44px]",
                  isActive ? "text-primary font-semibold" : "text-foreground hover:text-primary"
                )}
              >
                {item}
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-auto flex flex-col gap-4 pb-8">
          <Link href="/login" onClick={onClose}>
            <button className="w-full h-14 rounded-full border border-border/60 font-medium tracking-wide">Sign In</button>
          </Link>
          <Link href="/fleet" onClick={onClose}>
            <button className="w-full h-14 rounded-full bg-slate-900 text-white hover:bg-slate-800 font-medium tracking-wide">Book Now</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
