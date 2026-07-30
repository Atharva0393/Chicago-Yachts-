import React from "react";
import { 
  Wifi, Music, Tv, Wind, Waves, Coffee, 
  Wine, Anchor, Sun, Speaker, Mic, GlassWater
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface YachtAmenitiesProps {
  amenities: string[];
}

export function YachtAmenities({ amenities }: YachtAmenitiesProps) {
  // Map amenity strings to icons
  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('wifi') || n.includes('internet')) return <Wifi className="w-6 h-6 stroke-[1.5]" />;
    if (n.includes('sound') || n.includes('audio') || n.includes('bluetooth')) return <Music className="w-6 h-6 stroke-[1.5]" />;
    if (n.includes('tv') || n.includes('television')) return <Tv className="w-6 h-6 stroke-[1.5]" />;
    if (n.includes('air') || n.includes('ac')) return <Wind className="w-6 h-6 stroke-[1.5]" />;
    if (n.includes('swim') || n.includes('water toys')) return <Waves className="w-6 h-6 stroke-[1.5]" />;
    if (n.includes('coffee') || n.includes('kitchen')) return <Coffee className="w-6 h-6 stroke-[1.5]" />;
    if (n.includes('bar') || n.includes('ice') || n.includes('fridge')) return <Wine className="w-6 h-6 stroke-[1.5]" />;
    if (n.includes('sun') || n.includes('deck')) return <Sun className="w-6 h-6 stroke-[1.5]" />;
    return <Anchor className="w-6 h-6 stroke-[1.5]" />;
  };

  return (
    <section className="py-10 border-b border-slate-100">
      <h2 className="text-2xl font-medium text-slate-900 tracking-tight mb-8">What this yacht offers</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
        {amenities.slice(0, 8).map((amenity, index) => (
          <div key={index} className="flex items-center gap-4 text-slate-700">
            {getIcon(amenity)}
            <span className="font-light text-lg">{amenity}</span>
          </div>
        ))}
      </div>

      {amenities.length > 8 && (
        <Button variant="outline" className="mt-8 rounded-full h-12 px-6 border-slate-200 text-slate-900 hover:bg-slate-50 font-medium">
          Show all {amenities.length} amenities
        </Button>
      )}
    </section>
  );
}
