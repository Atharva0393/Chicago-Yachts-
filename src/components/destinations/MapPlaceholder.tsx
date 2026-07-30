import React from "react";
import { MapPin } from "lucide-react";

export function MapPlaceholder() {
  return (
    <section className="py-12 bg-background overflow-hidden relative">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        <div className="bg-slate-100 rounded-[32px] h-[600px] w-full relative overflow-hidden border border-slate-200">
          
          {/* Subtle Map-like Pattern Background */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }}
          />

          {/* Frosted Glass Overlay Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-slate-200/50 backdrop-blur-[2px]" />

          {/* Interactive Map UI Overlay */}
          <div className="absolute inset-x-0 bottom-8 flex justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-full shadow-lg border border-white/40 flex items-center gap-4">
              <span className="text-sm font-medium text-slate-900">Interactive Map Experience</span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="text-sm text-slate-500 font-light">Coming Soon</span>
            </div>
          </div>

          {/* Simulated Markers */}
          {/* Navy Pier */}
          <div className="absolute top-[30%] right-[30%] flex flex-col items-center animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-2 shadow-lg whitespace-nowrap">
              Navy Pier
            </div>
            <div className="relative">
              <div className="absolute -inset-2 bg-blue-500/20 rounded-full animate-ping" />
              <div className="w-4 h-4 bg-slate-900 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>
          </div>

          {/* Chicago River */}
          <div className="absolute top-[45%] left-[40%] flex flex-col items-center animate-bounce" style={{ animationDuration: '3.5s' }}>
            <div className="relative">
              <div className="w-3 h-3 bg-slate-400 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div className="text-slate-600 text-[10px] font-semibold mt-1 uppercase tracking-wider">
              River
            </div>
          </div>

          {/* Burnham Harbor */}
          <div className="absolute bottom-[25%] left-[55%] flex flex-col items-center animate-bounce" style={{ animationDuration: '4s' }}>
            <div className="relative">
              <div className="w-3 h-3 bg-slate-400 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div className="text-slate-600 text-[10px] font-semibold mt-1 uppercase tracking-wider">
              Burnham
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
