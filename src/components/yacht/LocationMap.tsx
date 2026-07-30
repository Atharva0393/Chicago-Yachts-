import React from "react";
import { MapPin } from "lucide-react";

export function LocationMap({ location }: { location: string }) {
  return (
    <section className="py-10 border-b border-slate-100">
      <h2 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">Location</h2>
      <p className="text-slate-500 font-light mb-8 flex items-center gap-1.5">
        <MapPin className="w-4 h-4" /> 
        Pickup from {location}
      </p>
      
      <div className="w-full h-72 md:h-96 bg-slate-100 rounded-3xl overflow-hidden relative border border-slate-200 flex items-center justify-center group">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" />
        
        <div className="relative z-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-sm text-center">
          <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-slate-900">{location}</h3>
          <p className="text-xs text-slate-500 mt-1">Exact slip details provided upon booking confirmation.</p>
        </div>
      </div>
    </section>
  );
}
