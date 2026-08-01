import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const yachts = [
  {
    id: "aquila-44",
    name: "Aquila 44",
    capacity: 12,
    price: 850,
    location: "Navy Pier",
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "sea-ray-l650",
    name: "Sea Ray L650 Fly",
    capacity: 13,
    price: 1200,
    location: "Chicago River",
    image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop",
  },
  {
    id: "azimut-S6",
    name: "Azimut S6",
    capacity: 10,
    price: 1500,
    location: "Lake Michigan",
    image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2070&auto=format&fit=crop",
  }
];

export function DestinationYachts() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-normal text-slate-900 tracking-tight">
              Recommended Fleet
            </h2>
            <p className="mt-4 text-slate-500 text-lg font-light leading-relaxed">
              Our hand-picked selection of luxury vessels stationed across Chicago's most iconic waters.
            </p>
          </div>
          <Link href="/fleet">
            <Button variant="outline" className="rounded-full px-6 transition-luxury hover:bg-slate-900 hover:text-white border-slate-200">
              View Full Fleet
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {yachts.map((yacht) => (
            <Link href={`/fleet/${yacht.id}`} key={yacht.id} className="group bg-white rounded-[24px] p-4 border border-slate-100 hover:shadow-premium transition-luxury flex flex-col block">
              <div className="relative h-60 w-full rounded-[16px] overflow-hidden mb-6">
                <Image
                  src={yacht.image}
                  alt={yacht.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 shadow-sm">
                  <Navigation className="w-3 h-3" />
                  {yacht.location}
                </div>
              </div>
              <div className="px-2 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-medium text-slate-900 mb-1">{yacht.name}</h3>
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                      <Users className="w-4 h-4" />
                      <span>Up to {yacht.capacity} Guests</span>
                    </div>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Starting From</span>
                    <span className="text-lg font-semibold text-slate-900">${yacht.price}<span className="text-sm text-slate-400 font-normal">/hr</span></span>
                  </div>
                  <div className="rounded-full px-6 py-2 text-sm font-medium bg-slate-900 text-white transition-luxury group-hover:bg-slate-800">
                    Book Now
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
