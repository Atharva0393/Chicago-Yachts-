import React from "react";
import Image from "next/image";
import { Users, Ruler, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const yachts = [
  {
    id: "sunseeker-manhattan",
    name: "Sunseeker Manhattan 68",
    capacity: 15,
    length: "68 ft",
    price: 1800,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=2074&auto=format&fit=crop",
  },
  {
    id: "prestige-590",
    name: "Prestige 590",
    capacity: 12,
    length: "59 ft",
    price: 1100,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1621277227181-4ebc37dbb46a?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "azimut-s6",
    name: "Azimut S6",
    capacity: 10,
    length: "59 ft",
    price: 1500,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2070&auto=format&fit=crop",
  }
];

export function ExperienceYachts() {
  return (
    <section className="py-24 bg-white">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-normal text-slate-900 tracking-tight">
              Recommended Yachts
            </h2>
            <p className="mt-4 text-slate-500 text-lg font-light leading-relaxed">
              Our hand-picked selection of vessels perfect for hosting unforgettable experiences.
            </p>
          </div>
          <Button variant="outline" className="rounded-full px-6 transition-luxury hover:bg-slate-900 hover:text-white border-slate-200">
            View Full Fleet
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {yachts.map((yacht) => (
            <div key={yacht.id} className="group bg-white rounded-[24px] p-4 border border-slate-100 hover:shadow-premium transition-luxury flex flex-col">
              <div className="relative h-60 w-full rounded-[16px] overflow-hidden mb-6">
                <Image
                  src={yacht.image}
                  alt={yacht.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-900 flex items-center gap-1.5 shadow-sm">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {yacht.rating}
                </div>
              </div>
              <div className="px-2 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-medium text-slate-900 mb-2">{yacht.name}</h3>
                    <div className="flex items-center gap-4 text-slate-500 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{yacht.capacity} Guests</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Ruler className="w-4 h-4" />
                        <span>{yacht.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Starting From</span>
                    <span className="text-lg font-semibold text-slate-900">${yacht.price}<span className="text-sm text-slate-400 font-normal">/hr</span></span>
                  </div>
                  <Button className="rounded-full px-6 bg-slate-900 hover:bg-slate-800 text-white transition-luxury hover-lift">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
