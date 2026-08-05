"use client"

import React from "react"
import { useCompare } from "@/lib/contexts/CompareContext"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Check, Minus, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ComparePage() {
  const { selectedYachts, removeYacht } = useCompare()

  if (selectedYachts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-medium tracking-tight mb-4">No Yachts Selected</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          You haven't added any yachts to compare yet. Browse our fleet and select up to 3 yachts to compare their features side-by-side.
        </p>
        <Link 
          href="/fleet"
          className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          Explore Fleet
        </Link>
      </div>
    )
  }

  // Helper to render values
  const renderRow = (label: string, field: keyof typeof selectedYachts[0] | ((y: typeof selectedYachts[0]) => React.ReactNode), isDiff = false) => {
    return (
      <div className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr_1fr_1fr] border-b border-border/40 hover:bg-muted/20 transition-colors">
        <div className="py-6 pr-4 font-medium text-muted-foreground text-sm flex items-center bg-background/50 sticky left-0 z-10 backdrop-blur-sm">
          {label}
        </div>
        {Array.from({ length: 3 }).map((_, i) => {
          const yacht = selectedYachts[i]
          if (!yacht) return <div key={i} className="hidden md:block py-6 px-4" />
          
          return (
            <div key={yacht.id} className="py-6 px-4 flex items-center justify-start text-sm md:text-base">
              {typeof field === 'function' ? field(yacht) : String(yacht[field])}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-20 mb-20 max-w-[1400px]">
      <div className="mb-12">
        <Link href="/fleet" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group mb-6">
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Fleet
        </Link>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight">Compare Models</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
          Find the perfect yacht for your luxury experience by comparing specifications, amenities, and capacities side-by-side.
        </p>
      </div>

      <div className="w-full overflow-x-auto pb-8 scrollbar-hide">
        <div className="min-w-[600px] w-full">
          
          {/* Sticky Header Section */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr_1fr_1fr] sticky top-20 z-30 bg-background/95 backdrop-blur-xl pb-8 border-b border-border/50">
            <div className="pt-4 bg-background/50 sticky left-0 z-40 backdrop-blur-sm" />
            {Array.from({ length: 3 }).map((_, i) => {
              const yacht = selectedYachts[i]
              if (!yacht) return <div key={i} className="hidden md:block" />

              return (
                <div key={yacht.id} className="px-4 flex flex-col items-center text-center relative group">
                  <button 
                    onClick={() => removeYacht(yacht.id)}
                    className="absolute top-2 right-4 z-10 bg-background/80 border border-border rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground shadow-sm"
                    aria-label={`Remove ${yacht.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="relative w-full aspect-[4/3] mb-6 rounded-2xl overflow-hidden shadow-sm">
                    <Image src={yacht.images?.[0]} alt={yacht.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-2">{yacht.name}</h3>
                  <p className="text-lg text-muted-foreground mb-6 font-medium">${yacht.pricePerHour}<span className="text-sm">/hr</span></p>
                  <Link 
                    href={`/fleet/${yacht.slug || yacht.id}/book`}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-[var(--shadow-premium)]"
                  >
                    Book Now
                  </Link>
                </div>
              )
            })}
          </div>

          {/* Specifications */}
          <div className="mt-8">
            <h4 className="text-xl font-medium tracking-tight mb-4 sticky left-0">Overview</h4>
            {renderRow("Availability", y => (
              <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", y.availabilityStatus.includes("Available") ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                {y.availabilityStatus}
              </span>
            ))}
            {renderRow("Guest Capacity", y => <span className="font-semibold">{y.capacity} Guests</span>)}
            {renderRow("Length", y => `${y.length} ft`)}
            {renderRow("Year Refitted", "year")}
            {renderRow("Manufacturer", "manufacturer")}
            {renderRow("Model", "model")}
          </div>

          {/* Accommodations */}
          <div className="mt-16">
            <h4 className="text-xl font-medium tracking-tight mb-4 sticky left-0">Accommodations</h4>
            {renderRow("Crew Included", y => y.amenities.includes("Captain Included") ? <Check className="h-5 w-5 text-foreground" /> : <Minus className="h-5 w-5 text-muted-foreground" />)}
            {renderRow("Cabins", "cabins")}
            {renderRow("Bathrooms", "bathrooms")}
          </div>

          {/* Amenities (Intersection) */}
          <div className="mt-16">
            <h4 className="text-xl font-medium tracking-tight mb-4 sticky left-0">Key Amenities</h4>
            {renderRow("Features", y => (
              <ul className="flex flex-col gap-2">
                {y.amenities.map(amenity => (
                  <li key={amenity} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" /> {amenity}
                  </li>
                ))}
              </ul>
            ))}
          </div>

          {/* Reviews */}
          <div className="mt-16 border-t border-border/40 pt-16">
            {renderRow("Rating", y => (
              <div className="flex flex-col">
                <span className="text-2xl font-bold flex items-center gap-1">
                  {y.rating} <StarIcon className="h-5 w-5 fill-accent text-accent" />
                </span>
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{y.reviewCount} Reviews</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
