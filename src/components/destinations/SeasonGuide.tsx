import React from "react";
import Image from "next/image";

const seasons = [
  {
    season: "Spring",
    months: "April - May",
    description: "Experience the city awakening. Enjoy crisp, clear days perfect for architectural photography and serene morning cruises before the summer rush.",
    image: "https://images.unsplash.com/photo-1558284566-654877bcceb5?q=80&w=2070&auto=format&fit=crop"
  },
  {
    season: "Summer",
    months: "June - August",
    description: "The peak of luxury. Vibrant sunsets, Wednesday and Saturday fireworks, and swimming in the pristine, warm waters of Lake Michigan.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
  },
  {
    season: "Fall",
    months: "September - October",
    description: "A tranquil and stunning time on the water. Witness the magnificent autumn colors along the shoreline with comfortable, cool breezes.",
    image: "https://images.unsplash.com/photo-1473172765389-c439167b57ac?q=80&w=2069&auto=format&fit=crop"
  }
];

export function SeasonGuide() {
  return (
    <section className="py-24 bg-slate-950 text-white overflow-hidden">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-normal tracking-tight mb-4">
            The Season Guide
          </h2>
          <p className="text-slate-400 text-lg font-light leading-relaxed">
            Chicago's waters transform beautifully throughout the year. Discover the unique charm of every charter season.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {seasons.map((season, idx) => (
            <div key={season.season} className={`group relative h-[450px] rounded-[24px] overflow-hidden ${idx === 1 ? 'md:-translate-y-8' : ''}`}>
              <Image
                src={season.image}
                alt={`${season.season} in Chicago`}
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-2">
                  {season.months}
                </span>
                <h3 className="text-3xl font-medium mb-4">{season.season}</h3>
                <p className="text-sm text-slate-300 font-light leading-relaxed transform translate-y-8 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {season.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
