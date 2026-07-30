import React from "react";

interface YachtOverviewProps {
  name: string;
  description: string;
}

export function YachtOverview({ name, description }: YachtOverviewProps) {
  return (
    <section className="py-10 border-b border-slate-100">
      <h2 className="text-2xl font-medium text-slate-900 tracking-tight mb-6">Overview</h2>
      <div className="prose prose-slate prose-lg text-slate-600 font-light leading-relaxed">
        <p>{description}</p>
      </div>
      
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Perfect For</h3>
          <p className="text-sm text-slate-700 font-medium">Corporate Events, Luxury Sunset Cruises, Architecture Tours</p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Cruising Area</h3>
          <p className="text-sm text-slate-700 font-medium">Chicago River & Lake Michigan (Playpen)</p>
        </div>
      </div>
    </section>
  );
}
