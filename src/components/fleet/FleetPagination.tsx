import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FleetPaginationProps {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export function FleetPagination({ currentPage, totalPages, setPage }: FleetPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-20 flex justify-center items-center gap-2">
      <button 
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-colors disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      {pages.map(page => (
        <button 
          key={page}
          onClick={() => setPage(page)}
          className={`h-10 w-10 rounded-full font-medium flex items-center justify-center transition-colors ${
            currentPage === page 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button 
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-colors disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
