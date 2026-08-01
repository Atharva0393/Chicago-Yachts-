import React from "react";
import Image from "next/image";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import Link from "next/link";

const destinations = [
  {
    id: "navy-pier",
    name: "Navy Pier",
    description: "Chicago's premier entertainment destination, offering spectacular firework displays and sweeping skyline views.",
    popularFor: "Fireworks, Entertainment, Sightseeing",
    duration: "2-4 Hours",
    bestTime: "Summer Evenings",
    image: "/images/destinations/dest_navypier_1785520881845.png"
  },
  {
    id: "chicago-river",
    name: "Chicago River",
    description: "Navigate through the architectural heart of the city, surrounded by world-renowned skyscrapers.",
    popularFor: "Architecture Tours, Dining",
    duration: "2-3 Hours",
    bestTime: "Late Afternoon",
    image: "/images/destinations/dest_chicagoriver.png"
  },
  {
    id: "lake-michigan",
    name: "Lake Michigan",
    description: "Experience the vast, ocean-like expanse of the Great Lakes with unobstructed panoramic views.",
    popularFor: "Sailing, Swimming, Sunsets",
    duration: "4-8 Hours",
    bestTime: "Summer Days",
    image: "/images/destinations/dest_lakemichigan.png"
  },
  {
    id: "monroe-harbor",
    name: "Monroe Harbor",
    description: "A prestigious starting point nestled right against the iconic Grant Park and Buckingham Fountain.",
    popularFor: "Quick Excursions, Photography",
    duration: "2 Hours",
    bestTime: "Morning",
    image: "/images/destinations/dest_monroeharbor.png"
  },
  {
    id: "burnham-harbor",
    name: "Burnham Harbor",
    description: "Located perfectly next to the Museum Campus, offering a calm and deeply scenic charter experience.",
    popularFor: "Family Trips, Quiet Cruising",
    duration: "3-5 Hours",
    bestTime: "Afternoon",
    image: "/images/destinations/dest_burnhamharbor.png"
  }
];

export function FeaturedDestinations() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-normal text-slate-900 tracking-tight">
              Featured Destinations
            </h2>
            <p className="mt-4 text-slate-500 text-lg font-light leading-relaxed">
              From the architectural marvels of the Chicago River to the vast beauty of Lake Michigan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, index) => (
            <div 
              key={dest.id} 
              className={`group flex flex-col bg-white rounded-[24px] overflow-hidden border border-slate-100 hover:shadow-premium transition-luxury ${index === 1 || index === 4 ? 'lg:translate-y-8' : ''}`}
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-medium text-slate-900 mb-3">{dest.name}</h3>
                <p className="text-slate-500 text-sm font-light leading-relaxed mb-6 flex-1">
                  {dest.description}
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 w-24 shrink-0 pt-0.5">Popular For</span>
                    <span className="text-sm font-medium text-slate-700">{dest.popularFor}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{dest.duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{dest.bestTime}</span>
                  </div>
                </div>

                <Link 
                  href={`#${dest.id}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 group/btn"
                >
                  Explore Destination 
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
