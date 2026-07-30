import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function FleetPagination() {
  return (
    <div className="mt-20 flex justify-center items-center gap-2">
      <button className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-colors disabled:opacity-50" disabled>
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      <button className="h-10 w-10 rounded-full bg-slate-900 text-white font-medium flex items-center justify-center shadow-md">
        1
      </button>
      
      <button className="h-10 w-10 rounded-full hover:bg-slate-100 font-medium flex items-center justify-center text-slate-600 transition-colors">
        2
      </button>
      
      <button className="h-10 w-10 rounded-full hover:bg-slate-100 font-medium flex items-center justify-center text-slate-600 transition-colors">
        3
      </button>
      
      <span className="text-slate-400 px-2">...</span>
      
      <button className="h-10 w-10 rounded-full hover:bg-slate-100 font-medium flex items-center justify-center text-slate-600 transition-colors">
        8
      </button>
      
      <button className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-colors">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
