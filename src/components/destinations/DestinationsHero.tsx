import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function DestinationsHero() {
  return (
    <section className="relative min-h-[85vh] w-full flex items-center pt-24 pb-20 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/destinationsbg.png"
          alt="Chicago skyline from a luxury yacht"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-950/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      </div>

      <div className="container relative z-10 px-6 md:px-8 max-w-7xl mx-auto h-full flex flex-col justify-center items-center text-center mt-12 md:mt-0">
        <div className="max-w-4xl flex flex-col items-center">
          <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/80 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
            Curated Locations
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-normal text-white leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
            Discover Chicago<br />From The Water
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200/90 max-w-2xl leading-relaxed font-light animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-both">
            Explore the city's most iconic waterfront destinations through unforgettable luxury yacht experiences.
          </p>
          <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
            <Button className="rounded-full px-8 bg-white text-slate-900 hover:bg-slate-100 min-h-[48px] text-sm font-medium transition-all duration-300 hover-lift">
              Explore Experiences
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
