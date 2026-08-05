"use client"

import React, { useState } from "react";
import { FleetHero } from "@/components/fleet/FleetHero";
import { FleetFilters } from "@/components/fleet/FleetFilters";
import { FleetSort } from "@/components/fleet/FleetSort";
import { YachtCard } from "@/components/fleet/YachtCard";
import { CompareBar } from "@/components/fleet/CompareBar";
import { QuickViewModal } from "@/components/fleet/QuickViewModal";
import { RecentlyViewed } from "@/components/fleet/RecentlyViewed";
import { RecommendedFleet } from "@/components/fleet/RecommendedFleet";
import { FleetPagination } from "@/components/fleet/FleetPagination";
import { FleetCTA } from "@/components/fleet/FleetCTA";
import { EmptyState } from "@/components/shared/EmptyState";
import { Search } from "lucide-react";
import { useCompare } from "@/lib/contexts/CompareContext";
import { useFleetState } from "@/hooks/useFleetState";
import { useYachts } from "@/hooks/useData";

function FleetContent() {
  const { selectedYachts } = useCompare();
  const { yachts: rawYachts, loading } = useYachts();
  const state = useFleetState();
  
  const allYachts = rawYachts.map(yacht => ({
    id: yacht.id,
    slug: yacht.slug,
    name: yacht.name,
    manufacturer: yacht.manufacturer,
    image: yacht.images?.[0] || "",
    price: yacht.pricePerHour * 4,
    capacity: yacht.capacity,
    length: `${yacht.length} ft`,
    location: yacht.location,
    rating: yacht.rating,
    reviews: yacht.reviewCount,
    verified: true,
    isLuxury: yacht.pricePerHour > 500,
    instantBook: yacht.availabilityStatus === "Available Today"
  }));

  // Filtering
  let filteredYachts = allYachts.filter(yacht => {
    if (state.q && !yacht.name.toLowerCase().includes(state.q.toLowerCase())) return false;
    
    if (state.dest.length > 0 && !state.dest.some(d => yacht.location.toLowerCase().includes(d.toLowerCase()))) return false;

    if (state.minPrice && yacht.price < parseInt(state.minPrice)) return false;
    if (state.maxPrice && yacht.price > parseInt(state.maxPrice)) return false;

    if (state.guests.length > 0) {
      const fits = state.guests.some(range => {
        if (range === "21+") return yacht.capacity >= 21;
        const [min, max] = range.split('-').map(Number);
        return yacht.capacity >= min && yacht.capacity <= max;
      });
      if (!fits) return false;
    }

    return true;
  });

  // Sorting
  if (state.sort === "price_asc") filteredYachts.sort((a, b) => a.price - b.price);
  else if (state.sort === "price_desc") filteredYachts.sort((a, b) => b.price - a.price);
  else if (state.sort === "capacity_desc") filteredYachts.sort((a, b) => b.capacity - a.capacity);
  else if (state.sort === "rating") filteredYachts.sort((a, b) => b.rating - a.rating);

  // Pagination
  const ITEMS_PER_PAGE = 9;
  const totalCount = filteredYachts.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const paginatedYachts = filteredYachts.slice((state.page - 1) * ITEMS_PER_PAGE, state.page * ITEMS_PER_PAGE);
  
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const quickViewYacht = quickViewId ? allYachts.find(y => y.id === quickViewId) : null;

  const comparedYachtObjects = selectedYachts
    .map(sy => allYachts.find(y => y.id === sy.id))
    .filter(Boolean);

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <FleetHero />
      
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex gap-10">
          
          <FleetFilters />

          <div className="flex-1 flex flex-col min-w-0">
            <FleetSort totalCount={totalCount} />
            
            {paginatedYachts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                {paginatedYachts.map(yacht => (
                  <YachtCard 
                    key={yacht.id} 
                    {...yacht} 
                    onQuickView={() => setQuickViewId(yacht.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-3xl mt-4">
                <EmptyState 
                  icon={Search}
                  title="No yachts found"
                  description="We couldn't find any yachts matching your exact criteria. Try adjusting your dates, guest count, or budget."
                  action={
                    <button onClick={state.clearAll} className="bg-slate-900 text-white px-8 py-4 rounded-full font-medium transition-luxury shadow-md hover:bg-slate-800">
                      Clear All Filters
                    </button>
                  }
                />
              </div>
            )}
            
            {totalPages > 1 && (
              <FleetPagination 
                currentPage={state.page} 
                totalPages={totalPages} 
                setPage={state.setPage} 
              />
            )}
          </div>

        </div>
      </div>

      <RecommendedFleet yachts={allYachts.slice(0, 4)} />
      <RecentlyViewed yachts={allYachts.slice(4, 8)} />
      <FleetCTA />

      {/* Modals & Overlays */}
      <QuickViewModal 
        isOpen={!!quickViewId} 
        onClose={() => setQuickViewId(null)} 
        yacht={quickViewYacht} 
      />
      <CompareBar selectedYachts={comparedYachtObjects} />
    </div>
  );
}

export default function FleetPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen pt-32 flex justify-center items-start text-slate-500">Loading fleet...</div>}>
      <FleetContent />
    </React.Suspense>
  );
}
