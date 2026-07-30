import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    location: "Navy Pier",
    experiences: [
      { name: "Sunset Cruise", image: "https://images.unsplash.com/photo-1512411966023-f2203eb364d4?q=80&w=2070&auto=format&fit=crop" },
      { name: "Fireworks Charter", image: "https://images.unsplash.com/photo-1498855926480-d98e83099315?q=80&w=2070&auto=format&fit=crop" }
    ]
  },
  {
    location: "Chicago River",
    experiences: [
      { name: "Architecture Tour", image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=2070&auto=format&fit=crop" },
      { name: "Romantic Dinner", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop" }
    ]
  },
  {
    location: "Lake Michigan",
    experiences: [
      { name: "Full Day Charter", image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2070&auto=format&fit=crop" },
      { name: "Swimming Experience", image: "https://images.unsplash.com/photo-1582291560662-35f11181f087?q=80&w=2070&auto=format&fit=crop" }
    ]
  }
];

export function DestinationExperiences() {
  return (
    <section className="py-24 bg-white">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-normal text-slate-900 tracking-tight">
            Popular Experiences
          </h2>
          <p className="mt-4 text-slate-500 text-lg font-light leading-relaxed">
            Curated journeys designed perfectly for their unique waterfront environments.
          </p>
        </div>

        <div className="space-y-24">
          {categories.map((category, idx) => (
            <div key={category.location} className="flex flex-col border-t border-slate-100 pt-16 first:border-0 first:pt-0">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-medium text-slate-900">{category.location}</h3>
                <Link href="/experiences" className="text-sm font-semibold text-slate-900 flex items-center gap-2 group hover:text-slate-600 transition-colors">
                  View All
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {category.experiences.map((exp) => (
                  <div key={exp.name} className="group relative h-[300px] rounded-[24px] overflow-hidden">
                    <Image
                      src={exp.image}
                      alt={exp.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-end">
                      <h4 className="text-2xl font-medium text-white">{exp.name}</h4>
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
