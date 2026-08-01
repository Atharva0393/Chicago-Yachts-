"use client"

import React, { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFleetState } from "@/hooks/useFleetState";

export function FleetHero() {
  const state = useFleetState();
  const [localSearch, setLocalSearch] = useState(state.q);

  const handleSearch = () => {
    state.setQ(localSearch);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="bg-slate-50 pt-32 pb-16 border-b border-slate-100">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-normal text-slate-900 tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
            Explore Our Luxury Fleet
          </h1>
          <p className="text-lg text-slate-500 font-light leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 fill-mode-both">
            Browse Chicago's finest collection of luxury yachts for unforgettable experiences.
          </p>
        </div>

        {/* Floating Search Bar */}
        <div className="max-w-4xl mx-auto bg-white rounded-[2rem] md:rounded-full p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row items-center gap-2 relative z-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
          
          <div className="flex-1 flex items-center w-full px-4 py-2 hover:bg-slate-50 rounded-full transition-colors cursor-text group">
            <MapPin className="w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors shrink-0" />
            <div className="flex flex-col ml-3 w-full">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 mb-0.5">Destination / Yacht Name</span>
              <input 
                type="text" 
                placeholder="Where to?" 
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none p-0 text-sm focus:ring-0 text-slate-900 placeholder-slate-400 w-full outline-none"
              />
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-slate-100 shrink-0" />

          <div className="flex-1 flex items-center w-full px-4 py-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer group">
            <Calendar className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
            <div className="flex flex-col ml-3 w-full">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 mb-0.5">Date</span>
              <span className="text-sm text-slate-400">Add dates</span>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-slate-100 shrink-0" />

          <div className="flex-1 flex items-center w-full px-4 py-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer group">
            <Users className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
            <div className="flex flex-col ml-3 w-full">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 mb-0.5">Guests</span>
              <span className="text-sm text-slate-400">Add guests</span>
            </div>
          </div>

          <Button 
            onClick={handleSearch}
            className="w-full md:w-auto h-14 rounded-full px-8 bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 transition-luxury hover-lift mt-2 md:mt-0 shrink-0 shadow-md"
          >
            <Search className="w-4 h-4" />
            <span className="font-medium text-sm">Search Fleet</span>
          </Button>

        </div>
      </div>
    </section>
  );
}
