import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ExperiencesHero() {
  return (
    <section className="relative min-h-[90vh] w-full flex items-center pt-24 pb-20 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/experiencesbg.png"
          alt="People enjoying a luxury yacht experience at sunset"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-950/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-slate-900/20 to-transparent"></div>
      </div>

      <div className="container relative z-10 px-6 md:px-8 max-w-7xl mx-auto h-full flex flex-col justify-center items-center text-center mt-12 md:mt-0">
        <div className="max-w-4xl flex flex-col items-center">
          <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/80 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
            Curated Journeys
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-normal text-white leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
            Extraordinary Experiences <br className="hidden md:block" /> On The Water
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200/90 max-w-2xl leading-relaxed font-light animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-both">
            Celebrate life's greatest moments aboard Chicago's most luxurious yacht fleet.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
            <Button className="rounded-full px-8 bg-white text-slate-900 hover:bg-slate-100 min-h-[48px] text-sm font-medium transition-all duration-300 hover-lift w-full sm:w-auto">
              Explore Our Fleet
            </Button>
            <Link href="#how-it-works">
              <Button variant="outline" className="rounded-full px-8 border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white min-h-[48px] text-sm font-medium transition-all duration-300 w-full sm:w-auto backdrop-blur-sm">
                Plan Your Experience
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
