import React from "react";
import { YachtCard } from "../fleet/YachtCard";

interface SimilarYachtsProps {
  yachts: any[];
}

export function SimilarYachts({ yachts }: SimilarYachtsProps) {
  if (!yachts || yachts.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-medium text-slate-900 tracking-tight mb-8">Similar Yachts</h2>
        <div className="flex overflow-x-auto custom-scrollbar pb-6 gap-6 snap-x snap-mandatory">
          {yachts.map((yacht) => (
            <div key={yacht.id} className="w-[320px] shrink-0 snap-start">
              <YachtCard {...yacht} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
