import React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

const addons = [
  { name: "Private Chef", desc: "Five-star multi-course dining.", image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop" },
  { name: "Premium Bar", desc: "Top-shelf liquor & mixologist.", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop" },
  { name: "Live DJ", desc: "Curated soundtracks for your party.", image: "https://images.unsplash.com/photo-1516280440502-861f5c6ef6e6?q=80&w=2070&auto=format&fit=crop" },
  { name: "Photographer", desc: "Professional event documentation.", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop" },
  { name: "Decorations", desc: "Bespoke floral and balloon setups.", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2069&auto=format&fit=crop" },
  { name: "Drone Video", desc: "Cinematic aerial memories.", image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=2070&auto=format&fit=crop" },
  { name: "Water Toys", desc: "Jetskis, seabobs, and inflatables.", image: "https://images.unsplash.com/photo-1515233519808-11de3930b503?q=80&w=2069&auto=format&fit=crop" },
  { name: "Transportation", desc: "Chauffeur service to the dock.", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop" }
];

export function LuxuryAddons() {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-normal text-slate-900 tracking-tight">
            Elevate Your Journey
          </h2>
          <p className="mt-4 text-slate-500 text-lg font-light leading-relaxed">
            Customize your charter with our premium, hand-selected additions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {addons.map((addon) => (
            <div key={addon.name} className="group flex flex-col bg-white rounded-[20px] overflow-hidden border border-slate-100 hover:shadow-premium transition-luxury">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={addon.image}
                  alt={addon.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-slate-900 shadow-sm flex items-center gap-1 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <Plus className="w-3 h-3" /> Add to Booking
                </div>
              </div>
              <div className="p-5 flex flex-col text-center">
                <h3 className="text-base font-medium text-slate-900 mb-1">{addon.name}</h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  {addon.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
