import React from "react";
import { SlidersHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FleetFilters() {
  return (
    <div className="flex flex-col gap-8 sticky top-28 h-[calc(100vh-8rem)] overflow-y-auto pr-6 pb-12 custom-scrollbar hidden lg:flex w-72 shrink-0 border-r border-slate-100">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6 bg-white/80 backdrop-blur-md sticky top-0 z-10 pt-4">
        <div className="flex items-center gap-2 text-slate-900">
          <SlidersHorizontal className="w-5 h-5" />
          <h3 className="font-medium text-lg tracking-tight">Filters</h3>
        </div>
        <button className="text-[10px] uppercase font-bold tracking-wider text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1">
          <Trash2 className="w-3 h-3" />
          Clear All
        </button>
      </div>

      {/* Destination */}
      <div className="flex flex-col gap-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Destination</h4>
        <div className="flex flex-col gap-3">
          {["Navy Pier", "Chicago River", "Lake Michigan", "Burnham Harbor"].map((dest) => (
            <label key={dest} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 transition-colors" />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{dest}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Price Range (Per Hr)</h4>
        <div className="flex gap-2 items-center">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input type="number" placeholder="Min" className="w-full h-11 rounded-lg border border-slate-200 pl-7 pr-3 text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors bg-slate-50" />
          </div>
          <span className="text-slate-300">-</span>
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input type="number" placeholder="Max" className="w-full h-11 rounded-lg border border-slate-200 pl-7 pr-3 text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors bg-slate-50" />
          </div>
        </div>
      </div>

      {/* Guest Capacity */}
      <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Guest Capacity</h4>
        <div className="flex flex-wrap gap-2">
          {["1-6", "7-12", "13-20", "21+"].map((size) => (
            <button key={size} className="px-4 py-2 text-sm rounded-full border border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-colors">
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Yacht Type */}
      <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Yacht Type</h4>
        <div className="flex flex-col gap-3">
          {["Motor Yacht", "Catamaran", "Sailboat", "Mega Yacht"].map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 transition-colors" />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Type */}
      <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Experience Type</h4>
        <div className="flex flex-col gap-3">
          {["Sunset Cruise", "Corporate Event", "Party / Celebration", "Romantic"].map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 transition-colors" />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities & Features */}
      <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Features</h4>
        <div className="flex flex-col gap-3">
          {[
            { label: "Captain Included", active: true },
            { label: "Instant Booking", active: false },
            { label: "Pet Friendly", active: false },
            { label: "Wheelchair Accessible", active: false },
            { label: "Jacuzzi", active: false },
            { label: "Water Toys", active: false }
          ].map((feature) => (
            <label key={feature.label} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" defaultChecked={feature.active} className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 transition-colors" />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{feature.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 pt-6 pb-2 bg-gradient-to-t from-white via-white to-transparent mt-6">
        <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-medium transition-luxury hover-lift shadow-md">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
