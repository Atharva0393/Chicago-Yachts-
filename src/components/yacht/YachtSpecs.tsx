import React from "react";
import { Ruler, Users, BedDouble, Bath, Gauge, Anchor, Droplets, Ship } from "lucide-react";

interface YachtSpecsProps {
  specs: {
    year: string;
    length: string;
    beam: string;
    cabins: number;
    bathrooms: number;
    sleepingCapacity: number;
    maxGuests: number;
    cruisingSpeed: string;
  }
}

export function YachtSpecs({ specs }: YachtSpecsProps) {
  const specItems = [
    { icon: <Ship className="w-5 h-5 text-slate-400" />, label: "Year Built", value: specs.year },
    { icon: <Ruler className="w-5 h-5 text-slate-400" />, label: "Length", value: specs.length },
    { icon: <Anchor className="w-5 h-5 text-slate-400" />, label: "Beam", value: specs.beam },
    { icon: <Users className="w-5 h-5 text-slate-400" />, label: "Max Guests", value: specs.maxGuests },
    { icon: <BedDouble className="w-5 h-5 text-slate-400" />, label: "Cabins", value: specs.cabins },
    { icon: <Bath className="w-5 h-5 text-slate-400" />, label: "Bathrooms", value: specs.bathrooms },
    { icon: <BedDouble className="w-5 h-5 text-slate-400" />, label: "Sleeps", value: specs.sleepingCapacity },
    { icon: <Gauge className="w-5 h-5 text-slate-400" />, label: "Cruising Speed", value: specs.cruisingSpeed },
  ];

  return (
    <section className="py-10 border-b border-slate-100">
      <h2 className="text-2xl font-medium text-slate-900 tracking-tight mb-8">Specifications</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-8 gap-x-4">
        {specItems.map((spec, index) => (
          <div key={index} className="flex flex-col gap-2">
            {spec.icon}
            <span className="text-slate-900 font-medium">{spec.value}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{spec.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
