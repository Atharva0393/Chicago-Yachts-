import React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

const addons = [
  {
    title: "Private Chef Experience",
    price: 450,
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=2000&auto=format&fit=crop",
    desc: "Custom multi-course menu prepared onboard."
  },
  {
    title: "Premium Open Bar",
    price: 250,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop",
    desc: "Top-shelf spirits, champagne, and mixologist."
  },
  {
    title: "Drone Videography",
    price: 350,
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=2000&auto=format&fit=crop",
    desc: "Cinematic 4K footage of your luxury charter."
  }
];

export function LuxuryAddons() {
  return (
    <section className="py-10 border-b border-slate-100">
      <h2 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">Luxury Add-ons</h2>
      <p className="text-slate-500 font-light mb-8">Elevate your experience with bespoke upgrades.</p>
      
      <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-6 snap-x">
        {addons.map((addon, index) => (
          <div key={index} className="w-[280px] shrink-0 snap-start bg-white border border-slate-100 rounded-2xl overflow-hidden group hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-40 overflow-hidden">
              <Image 
                src={addon.image} 
                alt={addon.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-5 flex flex-col h-[calc(100%-10rem)] justify-between">
              <div>
                <h3 className="font-medium text-slate-900 mb-1">{addon.title}</h3>
                <p className="text-xs text-slate-500 font-light line-clamp-2">{addon.desc}</p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <span className="font-semibold text-slate-900">+${addon.price}</span>
                <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
