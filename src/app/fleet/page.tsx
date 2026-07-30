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

// Generate 20 Mock Luxury Yachts
const generateYachts = () => {
  const bases = [
    { name: "Azimut 60", brand: "Azimut", price: 1200, length: "60 ft", cap: 12, rating: 4.9, img: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop" },
    { name: "Sunseeker Manhattan", brand: "Sunseeker", price: 1800, length: "68 ft", cap: 15, rating: 4.8, img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop" },
    { name: "Riva Corsaro", brand: "Riva", price: 4500, length: "100 ft", cap: 20, rating: 5.0, img: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=2074&auto=format&fit=crop" },
    { name: "Princess 72", brand: "Princess", price: 2100, length: "72 ft", cap: 14, rating: 4.7, img: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop" },
    { name: "Sea Ray L650", brand: "Sea Ray", price: 1500, length: "65 ft", cap: 12, rating: 4.9, img: "https://images.unsplash.com/photo-1577977464038-09099c2ea557?q=80&w=2000&auto=format&fit=crop" },
    { name: "Galeon 500 Fly", brand: "Galeon", price: 950, length: "50 ft", cap: 10, rating: 4.6, img: "https://images.unsplash.com/photo-1621277227092-28c0b25e79ba?q=80&w=2070&auto=format&fit=crop" },
    { name: "Ferretti 850", brand: "Ferretti", price: 3200, length: "85 ft", cap: 18, rating: 5.0, img: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2070&auto=format&fit=crop" },
    { name: "Prestige 590", brand: "Prestige", price: 1100, length: "59 ft", cap: 12, rating: 4.8, img: "https://images.unsplash.com/photo-1512411966023-f2203eb364d4?q=80&w=2070&auto=format&fit=crop" }
  ];
  const locations = ["Navy Pier", "Chicago River", "Lake Michigan", "Burnham Harbor"];
  
  return Array.from({ length: 20 }).map((_, i) => {
    const base = bases[i % bases.length];
    return {
      id: `${base.name.toLowerCase().replace(/ /g, "-")}-${i}`,
      name: `${base.name} ${i > 7 ? 'V' + (Math.floor(i/8) + 1) : ''}`,
      manufacturer: base.brand,
      capacity: base.cap,
      length: base.length,
      location: locations[i % locations.length],
      price: base.price + (i * 50),
      rating: base.rating,
      reviews: Math.floor(Math.random() * 200) + 10,
      image: base.img,
      verified: i % 3 === 0,
      isLuxury: base.price > 2000,
      instantBook: i % 2 === 0
    };
  });
};

const allYachts = generateYachts();

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
