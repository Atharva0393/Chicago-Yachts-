import React from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

interface FleetSortProps {
  totalCount: number;
}

export function FleetSort({ totalCount }: FleetSortProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="flex flex-col">
        <h2 className="text-xl font-medium text-slate-900 tracking-tight">Available Yachts</h2>
        <p className="text-sm text-slate-500 font-light">{totalCount} luxury vessels match your criteria</p>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Mobile Filter Button */}
        <button className="lg:hidden flex-1 sm:flex-none h-11 flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>

        {/* Sort Dropdown */}
        <div className="relative flex-1 sm:flex-none">
          <select className="h-11 w-full sm:w-48 appearance-none rounded-full border border-slate-200 bg-white pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer transition-colors shadow-sm truncate">
            <option>Recommended</option>
            <option>Most Popular</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Highest Rated</option>
            <option>Largest Capacity</option>
            <option>Newest Additions</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-slate-400" />
        </div>
      </div>
    </div>
  );
}
