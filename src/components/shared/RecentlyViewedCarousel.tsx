"use client"

import React from "react"
import { useRecentlyViewed } from "@/lib/contexts/RecentlyViewedContext"
import Link from "next/link"
import Image from "next/image"
import { Users, Star, ArrowRight, History } from "lucide-react"
import { EmptyState } from "@/components/shared/EmptyState"

interface Props {
  currentYachtId?: string;
}

export function RecentlyViewedCarousel({ currentYachtId }: Props) {
  const { recentYachts } = useRecentlyViewed()

  // Filter out the current yacht being viewed
  const displayYachts = recentYachts.filter(y => y.id !== currentYachtId)

  if (displayYachts.length === 0) {
    return (
      <div className="bg-background mt-8 rounded-3xl overflow-hidden border border-border/50">
        <EmptyState 
          icon={History}
          title="No Browsing History"
          description="You haven't viewed any yachts yet. Start exploring our luxury fleet to see your history appear here."
          action={
            <Link 
              href="/fleet" 
              className="mt-2 text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              Browse Fleet <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="w-full py-16 border-t border-border/40 mt-12 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-medium tracking-tight mb-2">Recently Viewed</h2>
          <p className="text-muted-foreground">Continue where you left off</p>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 md:px-8 pb-8 gap-6 max-w-full">
        {displayYachts.map((yacht) => (
          <div 
            key={yacht.id} 
            className="snap-start shrink-0 w-[280px] md:w-[320px] group flex flex-col gap-3 active:scale-[0.98] transition-transform duration-300"
          >
            <Link href={`/fleet/${yacht.slug || yacht.id}`} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-sm group-hover:shadow-lg transition-luxury">
              <Image 
                src={yacht.images[0]} 
                alt={yacht.name}
                fill
                className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                sizes="(max-width: 768px) 280px, 320px"
              />
            </Link>

            <div className="flex flex-col px-1">
              <div className="flex justify-between items-start mb-1">
                <Link href={`/fleet/${yacht.slug || yacht.id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-semibold text-lg tracking-tight line-clamp-1">{yacht.name}</h3>
                </Link>
                <div className="flex items-center gap-1 shrink-0 bg-muted/40 px-2 py-0.5 rounded-md text-sm font-semibold">
                  <Star className="h-3 w-3 text-primary fill-primary" /> {yacht.rating}
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {yacht.capacity} Guests</span>
                <span className="text-border/60">•</span>
                <span>{yacht.length} ft</span>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Starting</span>
                  <span className="text-lg font-semibold tracking-tight">${yacht.pricePerHour}<span className="text-xs text-muted-foreground">/hr</span></span>
                </div>
                
                <Link 
                  href={`/fleet/${yacht.slug || yacht.id}/book`}
                  className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 group/btn"
                >
                  Book <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
