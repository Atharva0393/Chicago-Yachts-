import React from "react";
import { YachtCard } from "./YachtCard";
import { Sparkles } from "lucide-react";

interface RecommendedFleetProps {
  yachts: any[];
}

export function RecommendedFleet({ yachts }: RecommendedFleetProps) {
  if (!yachts || yachts.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-100">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-2xl font-medium text-slate-900 tracking-tight">Recommended For You</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {yachts.map((yacht) => (
            <div key={yacht.id}>
              <YachtCard {...yacht} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
