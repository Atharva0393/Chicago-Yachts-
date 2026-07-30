import React from "react";
import Image from "next/image";
import { ArrowRight, Users, Clock } from "lucide-react";
import Link from "next/link";

const experiences = [
  {
    id: "sunset-cruise",
    title: "Sunset Cruise",
    description: "Experience the magic of Chicago's golden hour as the city skyline lights up against the descending sun.",
    guests: "2-12 Guests",
    duration: "3 Hours",
    price: 950,
    yachts: "Azimut S6, Sea Ray",
    image: "https://images.unsplash.com/photo-1512411966023-f2203eb364d4?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "corporate-events",
    title: "Corporate Events",
    description: "Impress clients or reward your team with a highly bespoke, fully-catered luxury yacht experience.",
    guests: "Up to 30 Guests",
    duration: "4-8 Hours",
    price: 2500,
    yachts: "Aquila 44, Sunseeker",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: "birthday-celebrations",
    title: "Birthday Celebrations",
    description: "Unforgettable celebrations on the water with custom decorations, premium bar, and private chef options.",
    guests: "Up to 15 Guests",
    duration: "4 Hours",
    price: 1200,
    yachts: "Sea Ray L650, Prestige",
    image: "https://images.unsplash.com/photo-1530103862676-de8892bf30b5?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "marriage-proposal",
    title: "Marriage Proposal",
    description: "The ultimate romantic gesture. We handle every detail to ensure your special moment is flawlessly executed.",
    guests: "2 Guests",
    duration: "2 Hours",
    price: 800,
    yachts: "Azimut S6",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop"
  }
];

export function FeaturedExperiences() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-normal text-slate-900 tracking-tight">
              Featured Experiences
            </h2>
            <p className="mt-4 text-slate-500 text-lg font-light leading-relaxed">
              Curated journeys designed perfectly for their unique waterfront environments.
            </p>
          </div>
          <Link href="#all-experiences" className="text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors flex items-center gap-2 group">
            View All Experiences
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {experiences.map((exp, index) => (
            <div 
              key={exp.id} 
              className={`group flex flex-col bg-white rounded-[24px] overflow-hidden border border-slate-100 hover:shadow-premium transition-luxury ${index % 2 === 1 ? 'md:translate-y-12' : ''}`}
            >
              <div className="relative h-[300px] w-full overflow-hidden">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-sm">
                  From ${exp.price}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-medium text-slate-900 mb-3">{exp.title}</h3>
                <p className="text-slate-500 text-sm font-light leading-relaxed mb-8 flex-1">
                  {exp.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{exp.guests}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{exp.duration}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Recommended Yachts</span>
                    <span className="text-sm text-slate-700 font-medium">{exp.yachts}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
