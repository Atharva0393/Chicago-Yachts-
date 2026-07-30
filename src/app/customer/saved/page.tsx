"use client"

import { useWishlist } from "@/lib/contexts/WishlistContext"
import { yachts } from "@/lib/constants/demo-data"
import { YachtCard } from "@/components/fleet/YachtCard"
import { EmptyState } from "@/components/shared/EmptyState"
import Link from "next/link"
import { Heart, ArrowRight } from "lucide-react"

export default function WishlistPage() {
  const { savedYachts } = useWishlist()
  
  // Filter the full yacht list to only show saved yachts
  const displayYachts = savedYachts;

  if (displayYachts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-7xl animate-in fade-in duration-500">
        <EmptyState 
          icon={Heart}
          title="Your Wishlist is Empty"
          description="You haven't saved any yachts yet. Explore our luxury fleet and click the heart icon to save your favorites for later."
          action={
            <Link 
              href="/fleet" 
              className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-all flex items-center gap-2 group shadow-[var(--shadow-premium)]"
            >
              Browse Fleet <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Saved Yachts</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Review your shortlisted luxury vessels. Availability changes fast, so we recommend booking your favorite soon.
          </p>
        </div>
        <div className="text-sm font-semibold text-muted-foreground bg-muted/40 px-4 py-2 rounded-full border border-border/50">
          {displayYachts.length} {displayYachts.length === 1 ? 'Yacht' : 'Yachts'} Saved
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayYachts.map((yacht) => (
          <YachtCard 
            key={yacht.id}
            id={yacht.id}
            name={yacht.name}
            image={yacht.images[0]}
            price={yacht.pricePerHour}
            capacity={yacht.capacity}
            length={`${yacht.length} ft`}
            location="Burnham Harbor, Chicago"
            rating={yacht.rating}
            reviews={yacht.reviewCount}
            instantBook={yacht.amenities.includes("Instant Book")}
          />
        ))}
      </div>
    </div>
  )
}
