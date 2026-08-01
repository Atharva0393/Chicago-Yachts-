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
import { yachts as rawYachts } from "@/lib/constants/demo-data";

const allYachts = rawYachts.map(yacht => ({
  id: yacht.id,
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

export default function FleetPage() {
  const { selectedYachts } = useCompare();
  
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const quickViewYacht = quickViewId ? allYachts.find(y => y.id === quickViewId) : null;

  // We need full objects for the CompareBar
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
            <FleetSort totalCount={allYachts.length} />
            
            {allYachts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                {allYachts.map(yacht => (
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
                    <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-medium transition-luxury shadow-md hover:bg-slate-800">
                      Clear All Filters
                    </button>
                  }
                />
              </div>
            )}
            
            <FleetPagination />
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
