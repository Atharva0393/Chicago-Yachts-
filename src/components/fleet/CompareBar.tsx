"use client"

import React from "react";
import { useCompare } from "@/lib/contexts/CompareContext";
import { X, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

// We need to pass the full yacht data to render thumbnails, or we can fetch them if only IDs are stored.
// For now, since CompareContext only stores IDs, we'll assume we pass a function to get yacht data or 
// we map it in the parent component.
// Let's assume the parent passes the full selected yacht objects.

interface CompareBarProps {
  selectedYachts: any[];
}

export function CompareBar({ selectedYachts }: CompareBarProps) {
  const { removeYacht, clearCompare } = useCompare();

  if (selectedYachts.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none flex justify-center animate-in slide-in-from-bottom-10 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 flex flex-col md:flex-row items-center gap-6 pointer-events-auto border border-slate-700/50 max-w-5xl w-full">
        
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
            <Scale className="w-5 h-5 text-slate-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">Compare Yachts</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">{selectedYachts.length} of 3 selected</span>
          </div>
        </div>

        <div className="flex-1 flex gap-4 overflow-x-auto custom-scrollbar pb-2 md:pb-0">
          {selectedYachts.map((yacht) => (
            <div key={yacht.id} className="relative w-40 shrink-0 bg-slate-800 rounded-lg p-2 pr-8 flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-md overflow-hidden bg-slate-700 shrink-0">
                <Image src={yacht.image} alt={yacht.name} fill className="object-cover" />
              </div>
              <span className="text-xs text-slate-200 font-medium truncate">{yacht.name}</span>
              <button 
                onClick={() => removeYacht(yacht.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {/* Empty Slots */}
          {Array.from({ length: Math.max(0, 3 - selectedYachts.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="w-40 shrink-0 border border-dashed border-slate-700 rounded-lg p-2 flex items-center justify-center opacity-50">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Add Yacht</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <button onClick={clearCompare} className="text-xs text-slate-400 hover:text-white transition-colors font-medium underline-offset-4 hover:underline">
            Clear
          </button>
          <Link href="/compare">
            <Button className="rounded-full bg-white text-slate-900 hover:bg-slate-100 font-medium shadow-md">
              Compare Now
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
